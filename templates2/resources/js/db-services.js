/* dbServices */
/**-------------------------------dbServices start------------------------------------------*/
var dbServices = angular.module("dbImService", ['ngResource']);

dbServices.factory("dbImService", ["$resource", "$http", DbImService]);

function DbImService($resource, $http) {

    var Imserver = $resource(Metronic.getResourcesPath() + "js/db-im-data.json");
    var imCacheMap = {};//临时缓存数据字典

    function queryImData(typeCode, callback, noCache, transcode) {
        if (!noCache) {
            var dicts = imCacheMap[typeCode];
            if (dicts && dicts.length > 0) {
                callback(dicts);
                return;
            }
        }
        var ApiRequest = {};
        ApiRequest["transCode"] = transcode;
        ApiRequest["requestBody"] = {"typeCode": typeCode};
        $http.post("../data/", ApiRequest).success(function (data, status, headers, config) {
            var dicts = [];
            angular.forEach(data.responseBody, function (dict) {
                dicts.push({"name": dict.nameCn, "value": dict.code});
            });
            imCacheMap[typeCode] = dicts;
            callback(dicts);
        }).error(function (data, status, headers, config) {

        });
    }

    return {
        /**
         * 根据父类代码获取字典项数据，通过callback返回对应的数据callback(dict)
         * @param parentCode 数据字典父类代码
         * @param callback 回调方法，可以为空
         */
        queryByJSON: function (parentCode, callback) {
            Imserver.get().$promise.then(function (dict) {
                callback = callback || function () {
                    };
                callback(dict[parentCode]);
            });
        },
        /**
         * 绑定查询到的数据，直接将查询到的数据绑定在$scope上
         * @param $scope 需要绑定的作用域
         * @param categoryCode 字典分类，已经绑定在作用域上的命名空间
         * @param callback 回调方法，可以为空
         */
        bindByJSON: function ($scope, categoryCode, callback) {
            this.queryByJSON(categoryCode, function (dicts) {
                callback = callback || function () {
                    };
                $scope[categoryCode] = dicts;
                callback(dicts);
            });
        },
        /**
         * 绑定查询到的数据，直接将查询到的数据绑定在$scope上，并根据分类项值获取分类项对象
         * 使用场景：修改页面回填下拉项。
         * @param $scope 需要绑定的作用域
         * @param categoryCode 字典分类，已经绑定在作用域上的命名空间
         * @param sourceObject，下拉框默认值获取的源对象，以及后续绑定字典的宿主对象
         * @param dictName 下拉框默认选中的值对应的name名称
         */
        bindSelectByJSON: function ($scope, categoryCode, sourceObject, dictName) {
            this.bindByJSON($scope, categoryCode, function (dictS) {
                if (!categoryCode) {
                    return;
                }
                var dictObj = undefined;
                angular.forEach(dictS, function (dict) {
                    if (dict['value'] === sourceObject[dictName]) {
                        dictObj = dict;
                    }
                });
                sourceObject[dictName] = dictObj;
            })
        },
        /**
         * 根据接口查询字典数据（如果subCode不为空，则查询小类代码数据，否则只查询大类代码数据）
         * @param parentCode 字典大类代码
         * @param subCode 字典大类代码
         * @param callback 回到方法 可为空
         * @param noCache 不缓存 可为空 默认缓存
         */
        queryImCode: function (parentCode, subCode, callback, noCache) {
            callback = callback || function () {
                };
            var typeCode = subCode || parentCode;
            var transCode = subCode ? "1026" : "1002";
            queryImData(typeCode, function (dictS) {
                callback(dictS);
            }, noCache, transCode);
        },
        /**
         * 通过接口查询数据字典(如果subCode不为空，则查询小类代码数据，否则只查询大类代码数据 并绑定)
         * @param parentCode 字典大类代码
         * @param subCode 字典大类代码
         * @param callback
         */
        bindImCode: function ($scope, parentCode, subCode, callback, noCache) {
            callback = callback || function () {
                };
            var typeCode = subCode || parentCode;
            var transCode = subCode ? "1026" : "1002";
            queryImData(typeCode, function (dictS) {
                $scope[typeCode] = dictS;
                callback(dictS);
            }, noCache, transCode);
        },

        /**
         * 为下拉框绑定数据字典数据，同时可以进行初始化绑定对象
         * @param $scope
         * @param parentCode 字典大类代码
         * @param subCode 字典大类代码
         * @param sourceObject，下拉框默认值获取的源对象，以及后续绑定字典的宿主对象
         * @param dictName 下拉框默认选中的值对应的name名称
         */
        bindSelect: function ($scope, parentCode, subCode, sourceObject, dictName) {

            this.bindImCode($scope, parentCode, subCode, function (dictS) {
                if (!sourceObject || !dictName) {
                    return;
                }
                var dictObj = undefined;
                angular.forEach(dictS, function (dict) {
                    if (dict['value'] === sourceObject[dictName]) {
                        dictObj = dict;
                    }
                });
                sourceObject[dictName] = dictObj;
            });
        }

    };

}
/**-------------------------------dbUtils start------------------------------------------*/

var dbUtils = angular.module("dbUtils", ["ngResource"]);

dbUtils.factory("dbUtils", ["$modal", "$http", "$window", 'toaster', DialogUtil]);

function DialogUtil($modal, $http, $window, toaster) {
    function getHtml(content, type) {
        var html = [];
        html.push('<div class="modal-header">');
        html.push('<h3 class="modal-title">提示</h3>');
        html.push('</div>');
        html.push('<div class="modal-body">');
        html.push(content);
        html.push('</div>');
        html.push('<div class="modal-footer">');
        html.push('<button class="btn btn-primary" type="button" ng-click="ok()">确定</button>');
        if (type == "confirm") {
            html.push('<button class="btn btn-warning" type="button" ng-click="cancel()">取消</button>');
        }
        html.push('</div>');
        return html.join('');
    }

    function DialogController($scope, $modalInstance) {
        $scope.ok = function () {
            $modalInstance.close('cancel');
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
    }

    function dbAlert(content, okFun) {
        $modal.open({
            animation: true,
            template: getHtml(content),
            controller: ['$scope', '$modalInstance', DialogController],
            size: "sm",
            backdrop: "static"
        }).result.then(function () {
            if (angular.isFunction(okFun)) {
                okFun.call();
            }
        });
    }

    function doTip(content) {
        var html = [];
        html.push('<div class="modal-header">');
        html.push('<h3 class="modal-title">提示</h3>');
        html.push('<div class="modal-body">');
        html.push(content);
        html.push('</div>');
        html.push('</div>');
        html.push('<div class="modal-footer">');
        html.push('</div>');

        $modal.open({
            animation: true,
            template: html.join(""),
            controller: ['$scope', '$modalInstance', DialogController],
            size: "sm"
        })
    }

    function doToasterTip(type, title, content) {
        toaster.pop({
            type: type,
            title: title,
            body: content,
            timeout: 4000,
            bodyOutputType: 'trustedHtml'
        });
    }

    return {
        success: function (content, title) {
            doToasterTip('success', title, content);
        },
        info: function (content, title) {
            doToasterTip('info', title, content);
        },
        warning: function (content, title) {
            doToasterTip('warning', title, content);
        },
        error: function (content, title) {
            doToasterTip('error', title, content);
        },
        alert: function (content, okFun) {
            dbAlert(content, okFun);
        },
        tip: function (content) {
            doToasterTip(content);
        },
        confirm: function (content, okFun, cancerFun) {
            $modal.open({
                animation: true,
                template: getHtml(content, 'confirm'),
                controller: ['$scope', '$modalInstance', DialogController],
                size: "sm",
                backdrop: "static"
            }).result.then(function () {
                okFun.call();
            }, function () {
                if (angular.isFunction(cancerFun)) {
                    cancerFun.call();
                }
            });
        },
        post: function (transCode, reqBody, success, error) {
            Metronic.startPageLoading();
            var ApiRequest = {};
            ApiRequest["transCode"] = transCode;
            ApiRequest["requestBody"] = reqBody;
            $http.post(transCode, ApiRequest).success(function (data, status, headers, config) {
                //console.log(data.responseBody);
                Metronic.stopPageLoading();
                if (data.status == "401") {//用户未登录
                    $window.location.href = "login.html";
                } else if (data.status == "403") {//用户没有权限
                    doToasterTip('warning', "提示", "非常抱歉，您没有权限操作!");
                } else if (data.status == "500") {//用户没有权限
                    doToasterTip('error', "提示", data.errorMsg?data.errorMsg:"系统异常!");
                }else {
                    success(data.responseBody);
                }

                //判断返回值是系统异常，还是业务异常，来决定是否需要调用error回调
            }).error(function (data, status, headers, config) {
                doToasterTip('error', "提示", "系统异常!");
                Metronic.stopPageLoading();
                if (angular.isFunction(error)) {
                    error(data);
                }
            });
        },
        get: function (transCode, reqBody, error) {
            Metronic.startPageLoading();
            var ApiRequest = {};
            ApiRequest["transCode"] = transCode;
            ApiRequest["requestBody"] = reqBody;
            $http.get("../api.do", ApiRequest).success(function (data) {
                Metronic.stopPageLoading();
                if (data.status == "401") {//用户未登录
                    $window.location.href = "login.html";
                } else if (data.status == "403") {//用户没有权限
                    doToasterTip('warning', "提示", "非常抱歉，您没有权限操作!");
                }else if (data.status == "500") {//用户没有权限
                    doToasterTip('error', "提示", "系统异常!");
                }
                //判断返回值是系统异常，还是业务异常，来决定是否需要调用error回调
            }).error(function (data, status, headers, config) {
                doToasterTip('error', "提示", "系统异常!");
                Metronic.stopPageLoading();
                if (angular.isFunction(error)) {
                    error(data);
                }
            });
        },
        dateFormat: function (date) {
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var date = date.getDate();
            return year + "-" + (month > 9 ? month : ("0" + month)) + "-" + (date > 9 ? date : ("0" + date));
        },

        /*
         * 根据指定变量获取集合中此变量的数组数据返回.
         * @param name
         * @param rows
         * @returns {Array}
         */
        getFieldArray: function (objectList, name) {
            var data = [];
            angular.forEach(objectList, function (record) {
                data.push(record[name]);
            });
            return data;
        }
    }
}

/**
 * 表单校验自定义标签
 在需要校验的表单input元素上添加：db-validator="required number" 属性，其中required number为校验方法的名称
 如需额外添加校验方法，可以在这里的method 当中添加
 * */
dbServices.directive('dbValidator', ['$log', function ($log) {
    var methods = {};
    methods["required"] = function (value) {
        var msg = "字段为必录项!";
        var valid = (value != "");
        return {valid: valid, msg: msg};
    };
    methods["date"] = function (value) {
        var msg = "日期格式不正确";
        var valid = (/^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(value));
        return {valid: valid, msg: msg};
    };
    methods["number"] = function (value) {
        var msg = "非有效数字";
        var valid = (/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value));
        return {valid: valid, msg: msg};
    };
    methods["email"] = function (value) {
        var msg = "邮箱格式不正确";
        var valid = false;
        if (value != null && value != "") {
            valid = (/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i
                .test(value));
        }
        return {valid: valid, msg: msg};
    };
    methods["mobile"] = function (value) {
        var msg = "手机格式不正确";
        var valid = (/^(13|14|15|17|18)\d{9}$/.test(value));
        return {valid: valid, msg: msg};
    };
    methods["idCard"] = function (value) {
        var msg = "身份证号格式不正确";
        var valid = (/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value));
        return {valid: valid, msg: msg};
    };

    return {
        require: 'ngModel',
        link: function ($scope, $element, $attrs, $ngModelCtrl) {
            var name = $attrs.name;
            $scope.$dbForm = {};
            //解析规则
            var rules = $attrs.dbValidator;
            // 校验
            var rs = rules.split(" ");
            var check = function (value) {
                for (var index in rs) {
                    var method = rs[index];
                    if (!angular.isFunction(methods[method])) {
                        continue;
                    }
                    if ($ngModelCtrl.$isEmpty(value)) {
                        value = "";
                    }
                    if (angular.isString(value)) {
                        value = value.replace(/\r/g, "");
                    }
                    var result = methods[method](value);
                    if (!result.valid) {
                        return result;
                    }
                }
                return {valid: true, msg: ""};
            };
            //输入框输入值时会调用此方法
            $ngModelCtrl.$parsers.push(function (input) {
                var validity = check(input);
                $ngModelCtrl.$setValidity('custom', validity.valid);
                $scope.$dbForm[name] = validity;
                return validity.valid ? input : false;
            });
            //第一次渲染时会调用此方法
            $ngModelCtrl.$formatters.push(function (input) {
                var validity = check(input);
                $ngModelCtrl.$setValidity('custom', validity.valid);
                $scope.$dbForm[name] = validity;
                console.log($scope.$dbForm);
                return validity.valid ? input : "";
            });
        }
    }
}]);
