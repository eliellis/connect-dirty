var Store = require('connect').session.Store, util = require('util'),
dirty = require('dirty'), fs = require('fs');

var DirtySession = module.exports = function DirtySession(options){
    var self = this;
    var db = (options && options.file) ? dirty(options.file) : dirty('sessions.db');
    this._path = (options && options.file) ? options.file : 'sessions.db';
    db.on('load', function(length){
        self._initial_count = length;
        self._keys = [];
        self._db = db;
    });
};

util.inherits(DirtySession, Store);

DirtySession.prototype.get = function(sid, fn){
    var self = this;
    process.nextTick(function(){
        var expires,
        sess = (self._db && self._db.get(sid)) ? self._db.get(sid) : null;
        if (sess) {
            expires = (typeof sess.cookie.expires === 'string') ? new Date(sess.cookie.expires) : sess.cookie.expires;
            if (!expires || new Date() < expires) {
                fn(null, sess);
            }
            else{
                self.destroy(sid, fn);
            }
        }
        else{
          fn();
        }
    });
};

DirtySession.prototype.set = function(sid, sess, fn){
    var self = this;
    process.nextTick(function(){
        if (self._db.get(sid) !== undefined && self._keys[sid]){
            self._db.set(sid, sess);
        }
        else{
            self._keys[sid] = sess;
            self._db.set(sid, sess);
        }
        if (fn) fn();
    });
};

DirtySession.prototype.destroy = function(sid, fn){
    var self = this;
    process.nextTick(function(){
        self._db.rm(sid, function(){
            if (fn) fn();
        });
    });
};

DirtySession.prototype.all = function(fn){
    var all = {},
    size = this._db.size(),
    self = this;
    self._db.forEach(function(key, val){
        if (size !== Object.keys(all).length){
            all[key] = val;
        }

        if (size === Object.keys(all).length){
            fn(null, all);
        }
    });
};

DirtySession.prototype.clear = function(fn){
    var self = this;
    fs.unlink(self._path, function(){
        self._db = dirty(self._path);
        if (fn) fn();
    });
};

DirtySession.prototype.length = function(fn){
    fn(null, this._db.size());
};