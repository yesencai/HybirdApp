/**********************************************/
/*             公共api函数脚本文件            */
/**********************************************/
/// <reference path="../node_modules/@types/paho-mqtt/index.d.ts" />
"use strict";
exports.__esModule = true;
require ('js-base64')
var Common = (function () {
    function Common() {
    }
    // 解析收到的数据
    Common.prototype.getParsingValue = function (DataStr, FieldID) {
        var iStart, L, Fid, tmp;
        L = 0;
        Fid = 0;
        iStart = 5;
        var result = "";
        while (iStart < DataStr.length - 4) {
            tmp = DataStr.substring(iStart, iStart + 4);
            L = parseInt(tmp, 16);
            tmp = DataStr.substring(iStart + 4, iStart + 6);
            Fid = parseInt(tmp, 16);
            if (Fid == FieldID) {
                if (iStart + 6 + L - 2 < DataStr.length) {
                    result = DataStr.substring(iStart + 6, iStart + 6 + L - 2);
                } else {
                    result = DataStr.substring(iStart + 6);
                }
                return result;
            }
            iStart = iStart + L + 4;
        }
        return result;
    };
    //通过主页面发送字符串数据包，本函数只能在子页面中调用，不能在主页面调用，否则会出错
    Common.prototype.SendStrByParent = function (DstType, DstID, StrPack) {
        client = new Paho.MQTT.Client(location.hostname, Number(location.port), "clientId");
        console.log(client);
        return 0;
    };
    //对把参数打包成“长度+ID+参数值”的格式
    Common.prototype.MakeParam = function (ParamID, ParamValue) {
        var mLen, mID, p;
        var iLen = ParamValue.length + 2;

        p = '';
        if (iLen < 65536) {
            mLen = iLen.toString(16).toUpperCase();
            while (mLen.length < 4) mLen = "0" + mLen;
            mID = ParamID.toString(16).toUpperCase();
            if (mID.length < 2) mID = "0" + mID;
            p = mLen + mID + ParamValue
        }

        return p;
    };
    //把数据包ID转换为四位16进制字符串
    Common.prototype.MakeHeader = function (PackID) {
        var p = PackID.toString(16).toUpperCase();
        while (p.length < 4) p = "0" + p;
        p = p + " ";
        return p;
    };
    //判断一个字符串是否是一个正确的手机号
    //是就返回true，不是就返回false
    //这个函数是在网上下载的，如果需要看实现原理，请看如下网址
    //http://blog.csdn.net/nongweiyilady/article/details/74007124
    Common.prototype.isPoneAvailable = function (phoneInput) {
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;

        if (phoneInput.length == 11) {
            if (!myreg.test(phoneInput)) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    };
    //解析页面传值函数
    Common.prototype.GetQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        } else {
            return null;
        }
    };
    return Common;
}());
exports.Common = Common;
