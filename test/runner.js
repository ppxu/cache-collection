var cache = require('../'),
    chai = require('chai'),
    should = chai.should();

var myCache, myCache1;

describe('cache', function() {

    it('创建group', function() {
        myCache = cache.createGroup();

        myCache.should.have.property('uid').be.a('string').include('cache_');
        global._cacheGroupList.should.be.an('object');
        global._cacheGroupList.should.have.ownProperty(myCache.uid);
        global._cacheGroupList[myCache.uid].should.be.an('object');
    });

    it('写入值', function() {
        myCache.set('hello', 'Taobao');

        global._cacheGroupList[myCache.uid].should.have.ownProperty('hello');
        global._cacheGroupList[myCache.uid].hello.should.equal('Taobao');
    });

    it('读取值', function() {
        var hi = myCache.get('hello');
        var nohi = myCache.get('hehe');

        hi.should.equal('Taobao');
        global._cacheGroupList[myCache.uid].hello.should.equal(hi);
        should.not.exist(nohi);
    });

    it('是否已缓存', function() {
        var hello = myCache.isCached('hello');
        var hehe = myCache.isCached('hehe');

        hello.should.be.true;
        hehe.should.be.false;
    });

    it('统一cache', function() {
        myCache1 = cache.createGroup();

        global._cacheGroupList.should.have.ownProperty(myCache.uid);
        global._cacheGroupList.should.have.ownProperty(myCache1.uid);
    });

    it('过期时间', function(done) {
        this.timeout(10000);
        myCache1.set('year', 2014, 3 * 1000);

        myCache1.get('year').should.equal(2014);
        global._cacheGroupList[myCache1.uid].timeoutList.should.have.length(1);

        setTimeout(function() {
            should.not.exist(myCache1.get('year'));
            done();
        }, 4000);
    });

    it('删除值', function() {
        myCache.del('hello');

        should.not.exist(myCache.get('hello'));
        should.not.exist(global._cacheGroupList[myCache.uid].hello);
    });

    it('过期前删除', function(done) {
        this.timeout(10000);
        myCache1.set('name', 'ppxu', 3 * 1000);

        myCache1.get('name').should.equal('ppxu');

        setTimeout(function() {
            myCache1.del('name');
            should.not.exist(myCache1.get('name'));
            done();
        }, 2000);
    })

    it('参数异常', function() {
        myCache.set.should.
        throw (/set method must have key and value/);
        myCache.get.should.
        throw (/get method must have key/);
        myCache.del.should.
        throw (/del method must have key/);
    });

    it('删除group', function() {
        myCache.set('ano', 'hihi');
        myCache.clear();

        should.not.exist(myCache.get('ano'));
    });

    it('清空缓存', function() {
        cache.clear();

        global._cacheGroupList.should.be.empty;
    });

    it('group异常', function() {
        var fn = function() {
            myCache.set('a', 'b');
        };
        var fn1 = function() {
            myCache.get('a');
        };
        fn.should.
        throw (/set on no exist group/);
        fn1.should.
        throw (/get on no exist group/);
    });

});