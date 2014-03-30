//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// jListQuery plugin ///////////////////////////////////////////////////////
//////////////////////////////////////// Author: Shantanu  ///////////////////////////////////////////////////////
//////////////////////////////////////// Date: Feb 2014    ///////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var _list = null;
var _tempList = null;
var _joins = [];
var _isJoin = false;

(function ($) {
    $.list = function (list) {
        //Throw exception if object is not a list
        if (Object.prototype.toString.call(list) != '[object Array]') {
            throw "object is not a list";
        }
        //Initialize list
        _list = list;
        _isJoin = false;
        _joins = [];
        _tempList = null;
        return this;
    },
    $.join = function (list, on) {
        //Throw exception if object is not a list
        if (Object.prototype.toString.call(list) != '[object Array]') {
            throw "object is not a list";
        }

        if (!isFunction(on)) {
            throw "on is not a function"
        }

        if (!_isJoin)
            _joins = [];

        var tempList = _isJoin ? _joins : _list;

        var tempJoins = [];

        //Join lists on specified key
        for (var i = 0; i < list.length; i++) {
            for (var j = 0; j < tempList.length; j++) {
                var item1 = tempList[j];
                var item2 = list[i];

                //Check if key value matches
                if (on(item1, item2)) {
                    var joinedItem = null;

                    if (!_isJoin) {
                        joinedItem = [item1, item2];
                    }
                    else {
                        tempList[j].push(item2);

                        joinedItem = tempList[j];
                    }

                    tempJoins.push(joinedItem);
                }
            }
        }

        _joins = tempJoins;

        _isJoin = true;

        return this;
    },
    $.forEach = function (action) {
        //Throw exception if object is not a function
        if (!isFunction(action)) {
            throw "predicate is not a function"
        }

        var tempList = _isJoin ? _joins : _list;

        //Call action on each item in list
        for (var i = 0; i < tempList.length; i++) {
            var obj = tempList[i];

            action(obj, i);
        }

        return this;
    },
    $.firstOrDefault = function (predicate) {
        //Throw exception if object is not a function
        if (!isFunction(predicate)) {
            throw "predicate is not a function"
        }

        var tempList = _isJoin ? _joins : _list;

        var obj = null;

        //Find the first item in the list that matches the predicate
        for (var i = 0; i < tempList.length; i++) {
            var obj = tempList[i];
            var found = false;
            //Check if predicate matches
            if (predicate(obj)) {
                found = true;
                break;
            }            
        }

        if (found)
            return obj;
        else
            return null;
    },
    $.lastOrDefault = function (predicate) {
        //Throw exception if object is not a function
        if (!isFunction(predicate)) {
            throw "predicate is not a function"
        }

        var tempList = _isJoin ? _joins : _list;

        var obj = null;

        //Find the last item in the list that matches the predicate
        for (var i = tempList.length - 1; i >= 0; i--) {
            obj = tempList[i];
            var found = false;
            //Check if predicate matches
            if (predicate(obj)) {
                found = true;
                break;
            }            
        }

        if (found)
            return obj;
        else
            return null;
    },
    $.singleOrDefault = function (predicate) {
        //Throw exception if object is not a function
        if (!isFunction(predicate)) {
            throw "predicate is not a function"
        }

        //Find items that match predicate
        $.where(predicate);
        //If count of matched item is 1 then return item
        if (_tempList.length == 1) {
            return _tempList[0];
        }
        return null;
    },
    $.where = function (predicate) {
        //Throw exception if object is not a function
        if (!isFunction(predicate)) {
            throw "predicate is not a function"
        }

        var list = [];

        var tempList = _isJoin ? _joins : _list;

        //Find all items in list that match predicate
        for (var i = 0; i < tempList.length; i++) {
            var obj = tempList[i];
            //Check if predicate matches
            if (predicate(obj)) {
                list.push(obj);
            }                       
        }

        _tempList = list;

        return this;
    }, 
    $.toList = function (reinitialize) {        
        if (_tempList != null) {
            //Re-initialize new list
            _isJoin = false;

            if (reinitialize) {
                return $.list(_tempList);
            }
            else {
                return _tempList;
            }
        }        

        return this;
    },
    $.orderBy = function (predicate) {
        //Throw exception if object is not a function
        if (!isFunction(predicate)) {
            throw "predicate is not a function"
        }

        var tempList = _isJoin ? _joins : _list;
        
        //Order the list by using the native javascript sort function
        if (predicate != null)
            tempList.sort(predicate);
        else
            tempList.sort();

        _tempList = tempList;

        return this;
    },
    $.select = function (predicate) {
        //Throw exception if object is not a function
        if (!isFunction(predicate)) {
            throw "predicate is not a function"
        }

        var tempList = _isJoin ? _joins : _list;

        var tempOutList = [];
        //Select items in the list
        $.forEach(function (item) {
            if (predicate != null) {
                tempOutList.push(predicate(item));
            }
            else
                tempOutList.push(item);
        });

        return tempOutList;
    },
    $.removeAll = function (predicate) {
        //Throw exception if object is not a function
        if (!isFunction(predicate)) {
            throw "predicate is not a function"
        }

        var tempList = _isJoin ? _joins : _list;
        var i = 0;
        //Remove all items in the list that match the predicate
        $.forEach(function (item) {
            if (predicate(item)) {
                tempList.splice(i, 1);
            }
            i++;
        });

        return this;
    }
})(jQuery);

function isFunction(functionToCheck) {
    return functionToCheck && Object.prototype.toString.call(functionToCheck) === '[object Function]';
}