# About

kitchen sink

# todo

kxp hidden file structure
types for:
* scatterplot
* csv table
* column type analysers (off load to pandas perhaps?)
* local pip installs (really dont want to break anything)

# done

make sinewave generator as worker

# notes

## client build/run
npm install -g vue-cli
vue init ducksoupdev/vue-webpack-typescript my-project
cd client
npm install

https://medium.com/dailyjs/vue-js-simultaneously-running-express-and-webpack-dev-server-292f4a7ed7a3

## srvsync build/run

change cwd with curl

```bash
# this should 404
curl "http://localhost:5000/fs/cwd"
# this should return an error (invalid content type)
curl -X POST -d '{"chdir":"kb-vue"}' "http://localhost:5000/fs/cwd"
# this should return an error (directory does not exist)
curl -X POST -H "Content-Type: application/json" -d '{"chdir":"kb-dne"}' "http://localhost:5000/fs/cwd"
# this should succeed
curl -X POST -H "Content-Type: application/json" -d '{"chdir":"kb-vue"}' "http://localhost:5000/fs/cwd"
```
