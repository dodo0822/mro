# MapReduceOnline

## How to Install

### Set up database ( Ubuntu )
 * Install Redis and MongoDB
```
$ sudo apt-get install redis-server mongodb
```

### Set up database ( OS X )
 * Install Redis and MongoDB using Homebrew
```
$ brew install redis mongodb
```

### Set up Python sandbox
 * Grab a copy of PyPy source code
```
$ wget https://bitbucket.org/pypy/pypy/downloads/pypy-2.6.1-src.tar.bz2
$ tar xf pypy-2.6.1-src.tar.bz2
```
 * Translate PyPy to an executable
```
$ cd pypy-2.6.1-src/pypy/goal
$ ../../rpython/bin/rpython -O2 --sandbox targetpypystandalone.py
( wait for about 10 minutes )
```
 * Now you have a Python sandbox ready for use!

### Set up Hadoop
 * Please Google for that.

### Set up MapReduceOnline
 * Install dependencies
```
$ npm install --global gulp
$ npm install
$ bower install
```
 * Rename ```config.sample.js``` to ```config.js``` and edit it.
 * Build frontend application
```
$ gulp
```
 * Start server ( you need two terminals )
```
( on the first one )
$ node server.js
( on the second one )
$ cd runner
$ node runner.js
```
 * Enjoy! The default HTTP port is ```9090```.

## Troubleshoot

If you can't read a file in HDFS, there may be a problem in ```webhdfs``` module. You can manually fix it. Edit line 528 of ```node_modules/webhdfs/lib/webhdfs.js``` and append
```
headers: {
  'Content-Type': 'text/plain'
}
```