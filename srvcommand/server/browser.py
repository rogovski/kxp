import os
import redis
import argparse
import uuid
import signal

from flask import Flask, Response, request, jsonify

redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)

app = Flask(__name__)

def on_sigint(signal, frame):
    """ Graceful shutdown
    """
    print('shutdown')
    redis_client.delete('kxp:fs:node')
    redis_client.delete('kxp:fs:cwd')
    redis_client.delete('kxp:fs:fsroot')
    exit(0)

ext2mimetype = {
    '.json': 'application/json',
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.csv': 'text/csv',
    '.jsonl': 'text/plain'
}

def sanitize_path(path):
    """ TODO: sanitize path.
    path whitelist: 
        ^.[a-zA-Z0-9-_]+ 
        ^[a-zA-Z0-9-_]+
        ^[a-zA-Z0-9-_]+(\.jpg|\.png|\.pdf|...)
    """
    fragments = path.split('/')
    valid_fragments = []
    for f in fragments:
        valid_fragments.append(f)
    return '/'.join(valid_fragments)

def read_content(path):
    """
    Returns:
        buffer: utf-8 buffer containing contents of path. None if dne
        status: integer http status
        mimetype: mimetype. None if dne
    """
    if not os.path.exists(path):
        return ('file not found', 404, None)
    mimetype = ext2mimetype.get(os.path.splitext(path)[-1])
    if mimetype is None:
        mimetype = 'text/plain'
    try:
        with open(path, 'rb') as f:
            content = f.read()
        return (content, 200, mimetype)
    except:
        return ('read failed', 500, None)

@app.route('/fs/cwd/read/', methods=['GET'], defaults={'path':''})
@app.route('/fs/cwd/read/<path:path>', methods=['GET'])
def get_cwd_read(path):
    # get cwd from redis
    cwd = redis_client.get('kxp:fs:cwd')
    path_clean = sanitize_path(path)
    buf, status, mimetype = read_content(os.path.join(cwd, path_clean))
    if status != 200:
        return Response(buf, status=status)
    else:
        return Response(buf, status=status, mimetype=mimetype)

@app.route('/fs/cwd/file', methods=['GET'])
def get_cwd_files():
    # get cwd from redis
    cwd = redis_client.get('kxp:fs:cwd')
    if cwd is None:
        return jsonify({ 'error': 'cache: cwd not found' })
    filter_pred = lambda x: os.path.isfile(os.path.join(cwd,x))
    files = filter(filter_pred, os.listdir(cwd))
    return jsonify({ 'files': files })

@app.route('/fs/cwd/dir', methods=['GET'])
def get_cwd_dirs():
    # get cwd from redis
    cwd = redis_client.get('kxp:fs:cwd')
    if cwd is None:
        return jsonify({ 'error': 'cache: cwd not found' })
    filter_pred = lambda x: not os.path.isfile(os.path.join(cwd,x))
    dirs = filter(filter_pred, os.listdir(cwd))
    return jsonify({ 'dirs': dirs })

@app.route('/fs/cwd', methods=['POST'])
def post_ch_cwd():
    if request.headers.get('Content-Type') != 'application/json':
        return jsonify({ 'error': '/fs/cwd content type is not json' })
    # extract post body, fail if empty
    body = request.json
    if body is None or body.get('chdir') is None:
        return jsonify({ 'error': '/fs/cwd post body does not contain chdir' })
    chdir = body['chdir']
    # get fsroot from redis
    fsroot = redis_client.get('kxp:fs:fsroot')
    # get cwd from redis
    cwd = redis_client.get('kxp:fs:cwd')
    # fail if redis entries are None
    if fsroot is None or cwd is None:
        return jsonify({ 'error': 'cache: cwd/fsroot not found' })
    # new cwd placeholder
    new_cwd = None
    # handle case were cwd is '..'
    if chdir == '..':
        if cwd == fsroot:
            return jsonify({ 'error': 'already at root' })
        # remove last path fragment from cwd
        new_cwd = os.path.split(cwd)[0]
        if not os.path.exists(new_cwd):
            return jsonify({ 'error': 'directory {} does not exist'.format(new_cwd) })
        # set new_cwd in redis
        redis_client.set('kxp:fs:cwd', new_cwd)
        return jsonify({ 'cwd': new_cwd })
    # handle case were cwd is a sub directory
    new_cwd = os.path.join(cwd, chdir)
    if not os.path.exists(new_cwd):
        return jsonify({ 'error': 'sub directory {} does not exist'.format(chdir) })
    # set new_cwd in redis
    redis_client.set('kxp:fs:cwd', new_cwd)
    return jsonify({ 'cwd': new_cwd })

# attach sigint listener
signal.signal(signal.SIGINT, on_sigint)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=(
    '''
    filesystem browser server. USAGE: python fs_browser.py -r /root/dir 
    '''))

    parser.add_argument('-f', '--file', dest='rootdir',
                                        action='store',
                                        metavar='DIRECTORY',
                                        default=None,
                                        help='root directory of web server')

    parser.add_argument('-p', '--port', dest='port',
                                        action='store',
                                        metavar='PORT',
                                        default='5000',
                                        help='listen on port')
    # args. see above
    args = parser.parse_args()
    rootdir = args.rootdir
    port = int(args.port)
    if rootdir is None or not os.path.exists(rootdir):
        rootdir = os.path.expanduser('~')
    # set redis cwd, fsroot, node data
    redis_client.set('kxp:fs:node', 'nodeid')
    redis_client.set('kxp:fs:cwd', rootdir)
    redis_client.set('kxp:fs:fsroot', rootdir)
    app.run(debug=True, port=port)
