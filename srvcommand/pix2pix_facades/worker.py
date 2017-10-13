import redis
import msgpack

r = redis.StrictRedis(host='localhost', port=6379, db=0)


