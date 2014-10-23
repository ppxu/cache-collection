cache-collection
============

提供统一的缓存管理，可以根据需要创建多个不同的缓存组，缓存组里可以进行写入、读取和删除内容的操作，同时，所有的缓存组都存放在一个全局对象里面，即共享一份内存空间，这样可以保证读写速度，并且可以快速删除一个缓存组或者所有缓存

### Install

    npm install cache-collection

### Usage

    var cache = require('cache-collection');

    //创建一个group
    var test = cache.createGroup();

    //写入值
    test.set('name', 'taobao');
    //读取值
    var name = test.get('name');
    //是否已缓存
    var exist = test.isCached('name');
    //删除值
    test.del('name');

    //设置过期时间，单位毫秒
    test.set('year', 2014, 300*1000);

    //删除group
    test.clear();

    //删除所有cache（小心使用，会把其他人保存的cache也删掉）
    cache.clear();
