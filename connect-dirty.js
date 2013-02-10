var Store = require('connect').session.Store, util = require('util'),
dirty = require('dirty'), fs = require('fs');

var DirtySession = module.exports = function DirtySession(options){
    var self = this;
    var db = (options && options.file) ? dirty(options.file) : dirty('sessions.db');
    db.on('load', function(length){
        self.sessionCount = length;
        self.db = db;
    });
};

util.inherits(DirtySession, Store);

DirtySession.prototype.get = function(sid, fn){
    var self = this;
    process.nextTick(function(){
        var expires, sess = self.db.get(sid);
        if (sess) {
            expires = ('string' === typeof sess.cookie.expires) ? new Date(sess.cookie.expires) : sess.cookie.expires;
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
        self.db.set(sid, sess);
        if (fn) fn();
    });
};

DirtySession.prototype.destroy = function(sid, fn){
    var self = this;
    process.nextTick(function(){
        self.db.rm(sid, function(){
            if (fn) fn();
        });
    });
};

DirtySession.prototype.all = function(fn){
    var arr = [];
    this.db.forEach(function(key, val){
        if (arr.length !== self.sessionCount){
            arr.push(val);
        }
        else{
            if (fn) fn(null, arr);
        }
    });
};

DirtySession.prototype.clear = function(fn){
    fs.unlink(this.db.path, function(){
        this.db = dirty(this.db.path);
        if (fn) fn();
    });
};

DirtySession.prototype.length = function(fn){
    fn(null, this.sessionCount);
};