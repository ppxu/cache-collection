/**
 * @ignore
 * @file cache
 * @description 中途岛缓存模块
 * @author 自寒 <zihan.yx@taobao.com>
 */

/**
 * cache组，具体存取操作都在cache组
 * @param  {Number} uid
 * @return {}
 */
function groupCache(uid) {
    var self = this;
    self.uid = uid;
    //cache内容保存在node全局对象中，方便共享和统一管理
    global._cacheGroupList[uid] = {};
    //存放该组中的计时器
    global._cacheGroupList[uid].timeoutList = [];
}

/**
 * 写入值
 * @param {String} key
 * @param {any type} value
 * @param {number} expire
 */
groupCache.prototype.set = function(key, value, expire) {
    if (!key || !value) {
        throw new Error('set method must have key and value');
    }

    var self = this;
    var _cache = global._cacheGroupList[self.uid];

    if (!_cache) {
        throw new Error('set on no exist group ' + self.uid);
    }

    _cache[key] = value;

    //过期设置
    var expireTime = parseInt(expire, 10) || 0;
    if (expire > 0) {
        //保存计时器
        _cache.timeoutList.push(setTimeout(function() {
            self.del(key);
        }, expireTime));
    }
};

/**
 * 读取值
 * @param  {String} key
 * @return {}
 */
groupCache.prototype.get = function(key) {
    if (!key) {
        throw new Error('get method must have key');
    }

    var self = this;
    var _cache = global._cacheGroupList[self.uid];

    if (!_cache) {
        throw new Error('get on no exist group ' + self.uid);
    }

    return _cache[key] === undefined ? null : _cache[key];
};

/**
 * 是否已缓存
 * @param  {String}  key
 * @return {Boolean}
 */
groupCache.prototype.isCached = function(key) {
    if (!key) {
        throw new Error('isCached method must have key');
    }

    var self = this;
    var _cache = global._cacheGroupList[self.uid];

    if (!_cache) {
        throw new Error('isCached on no exist group ' + self.uid);
    }

    return _cache[key] === undefined ? false : true;
};

/**
 * 删除值
 * @param  {String} key
 * @return {}
 */
groupCache.prototype.del = function(key) {
    if (!key) {
        throw new Error('del method must have key');
    }

    var self = this;
    var _cache = global._cacheGroupList[self.uid];

    if (_cache && _cache[key]) {
        _cache[key] = null;
        delete _cache[key];
    }
};

/**
 * 删除组
 * @return {}
 */
groupCache.prototype.clear = function() {
    var self = this;
    var _cache = global._cacheGroupList[self.uid];

    if (_cache) {
        //清除计时器
        if (_cache.timeoutList.length) {
            _cache.timeoutList.forEach(function(t) {
                clearTimeout(t);
            });
            _cache.timeoutList = [];
        }
        global._cacheGroupList[self.uid] = {};
        global._cacheGroupList[self.uid].timeoutList = [];
    }
};

/**
 * 创建组
 * @return {Object} groupCache
 */
function _createGroup() {
    !global._cacheGroupList && (global._cacheGroupList = {});
    var uid = 'cache_' + (+new Date());
    return new groupCache(uid);
}

/**
 * 清空缓存
 * @return {}
 */
function _clear() {
    if (global._cacheGroupList) {
        for (var group in global._cacheGroupList) {
            if (group.timeoutList && group.timeoutList.length) {
                group.timeoutList.forEach(function(t) {
                    clearTimeout(t);
                });
            }
        }
        global._cacheGroupList = {};
    }
}

exports.createGroup = _createGroup;
exports.clear = _clear;