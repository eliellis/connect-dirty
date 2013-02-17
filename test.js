var dirtySessions = require('./connect-dirty.js'), express = require('express'),
assert = require('assert'), connect = require('connect');

var store = new dirtySessions();
var future = new Date('January 1, 2014 12:00:00');

describe('connect-dirty sessions', function(){

    beforeEach(function(done){
        store.clear(function(){
            store.set('test', {data: 'test', cookie: {expires: new Date(future)}});
            store.set('test2', {data: 'test', cookie: {expires: new Date(future)}}, done);
        });
    });

    describe('#get()', function(){
        it('should return the session data given a certain id without error', function(done){
            store.get('test', done);
        });
    });

    describe('#all()', function(){
        it('should return all session data without error', function(done){
            store.all(done);
        });
    });

    describe('#length()', function(){
        it('should return store session count without error', function(done){
            store.length(done);
        });
    });

    describe('#set()', function(){
        it('should set values given a session id without error', function(done){
            store.set('test', {data: 'test2', cookie: {expires: new Date(future)}}, function(){
                store.get('test', function(err, data){
                    if (data && data.data === 'test2' && !err){
                        done();
                    }
                    else{
                        done(new Error('Key not set properly'));
                    }
                });
            });
        });
    });

    describe('#destroy()', function(){
        it('should remove value given a session id without error', function(done){
            store.destroy('test', function(){
                var test = store.get('test', function(data){
                    if (data){
                        done(new Error('Requested key not destroyed'));
                    }
                    else{
                        done();
                    }
                });
            });
        });
    });

});