/**********************************************/
/*             公共api函数脚本文件            */
/**********************************************/

import {SdkSendStr} from '../lib/sdk.js'

// 解析收到的数据
export  const getFieldValue = function(DataStr, FieldID) {
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
}

export const zx_sdk_SendStrByParent = function (DstType, DstID, StrPack) {
    SdkSendStr(DstType, DstID, StrPack);
    return 0;
}

//通过主页面发送字符串数据包
//本函数只能在子页面中调用，不能在主页面调用，否则会出错
//主窗口中的程序请直接调用SendLogText()函数
function SendLogByParent(ALogText) {
    parent.window.SendLogText(ALogText);
}

//通过主页面显示对话框
//本函数只能在子页面中调用，不能在主页面调用，否则会出错
//主窗口中的程序请直接调用ShowMessage()函数
function ShowMsgByParent(AMsgText) {
    parent.window.ShowMessage(AMsgText);
}

//对把参数打包成“长度+ID+参数值”的格式
export const zx_sdk_MakeParam = function (ParamID, ParamValue) {
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
}

//把数据包ID转换为四位16进制字符串
export const zx_sdk_MakeHeader = function (PackID) {
    var p = PackID.toString(16).toUpperCase();
    while (p.length < 4) p = "0" + p;
    p = p + " ";
    return p;
}

//判断一个字符串是否是一个正确的手机号
//是就返回true，不是就返回false
//这个函数是在网上下载的，如果需要看实现原理，请看如下网址
//http://blog.csdn.net/nongweiyilady/article/details/74007124
function isPoneAvailable(phoneInput) {
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
}

//设备清单添加
function insertDIV(deviceId, deviceName, devicestate, deviceonline) {
    var divElId = document.createElement("div");
    divElId.id = deviceId;
    divElId.style.backgroundColor = "#86C1E6";
    divElId.style.width = "300px";
    divElId.style.height = "80px";
    divElId.style.marginLeft = "15px";
    divElId.style.marginTop = "10px";
    // divElId.style.border="1px solid #bfbfbf";
    divElId.style.borderRadius = "5px";
    var navEl = document.getElementById('nav');
    navEl.appendChild(divElId);

    var btn1 = document.createElement("button");
    btn1.id = deviceId + "1";
    btn1.title = deviceId;
    btn1.innerHTML = "操作";
    btn1.style.color = "#013560";
    btn1.style.backgroundColor = "#fff";
    btn1.style.width = "55px";
    btn1.style.height = "30px";
    btn1.style.marginLeft = "150px";
    btn1.style.marginTop = "45px";
    btn1.style.border = "1px solid #bfbfbf";
    btn1.style.borderRadius = "10px";
    btn1.style.lineHeight = "30px";
    btn1.addEventListener("click", control, false);
    function control() {

        var sessionID = localStorage.getItem("sessionID");
        var dat = MakeHeader(CM_DEVINFO) +
            zx_sdk_MakeParam(CM_DEVINFO_USER, sessionID) +
            zx_sdk_MakeParam(CM_DEVINFO_ID, deviceId);
        zx_sdk_SendStrByParent(DSTTYPE_SERVER, "", dat);

    }
    divElId.appendChild(btn1);

    var btn2 = document.createElement("button");
    btn2.id = deviceId + "2";
    btn2.innerHTML = "删除";

    btn2.style.color = "#013560";
    btn2.style.backgroundColor = "#fff";
    btn2.style.width = "55px";
    btn2.style.height = "30px";
    btn2.style.marginRight = "10px";
    btn2.style.marginTop = "45px";
    btn2.style.border = "1px solid #bfbfbf";
    btn2.style.borderRadius = "10px";
    btn2.style.lineHeight = "30px";
    btn2.style.float = "right";
    btn2.addEventListener("click", Delete, false);
    function Delete() {
        var con = confirm("确认删除设备:" + deviceId);
        if (con) {
            var sessionID = localStorage.getItem("sessionID");
            var dat = MakeHeader(CM_DEVDEL) +
                zx_sdk_MakeParam(CM_DEVDEL_USER, sessionID) +
                zx_sdk_MakeParam(CM_DEVDEL_ID, deviceId);
            zx_sdk_SendStrByParent(DSTTYPE_SERVER, "", dat);
        } else {
            return;
        }
    }
    divElId.appendChild(btn2);


    var div1 = document.createElement("div");
    div1.innerHTML = "" + deviceName;
    div1.style.width = "230px";
    div1.style.height = "30px";
    div1.style.marginTop = "-64px";
    div1.style.marginLeft = "10px";
    // div1.style.border="1px solid #bfbfbf";
    div1.style.overflow = "hidden";

    divElId.appendChild(div1);


    var div2 = document.createElement("div");
    if (deviceonline == "0") {
        div2.innerHTML = "在线";
        div2.style.color = "red";
    } else {
        div2.innerHTML = "离线";
        div2.style.color = "#fff";
    }
    div2.style.width = "50px";
    div2.style.height = "30px";
    div2.style.marginTop = "-40px";
    div2.style.float = "right";
    div2.style.marginRight = "-75px";
    // div2.style.border="1px solid #bfbfbf";
    divElId.appendChild(div2);


    var div3 = document.createElement("div");
    if (devicestate == "0") {
        div3.innerHTML = "开";
        div3.style.color = "red";
    } else {
        div3.innerHTML = "关";
        div3.style.color = "#fff";
    }
    div3.style.width = "30px";
    div3.style.height = "20px";
    div3.style.margin = "15px";
    // div3.style.border="1px solid #bfbfbf";
    divElId.appendChild(div3);

}


//信息通知添加
function insertMessage(num, txt, state, time) {


    var divElId = document.createElement("div");
    divElId.id = num;
    divElId.style.backgroundColor = "#86C1E6";
    divElId.style.width = "300px";
    divElId.style.height = "120px";
    divElId.style.marginLeft = "15px";
    divElId.style.marginTop = "10px";
    // divElId.style.border="1px solid #bfbfbf";
    divElId.style.borderRadius = "5px";
    var navEl = document.getElementById('nav');
    navEl.appendChild(divElId);

    var btn = document.createElement("button");
    // btn.innerHTML ="删除";
    btn.style.backgroundImage = "url(../image/d11.png)";
    // btn.style.backgroundColor="#fff";
    btn.style.color = "#013560";
    btn.style.width = "50px";
    btn.style.height = "50px";
    btn.style.marginRight = "10px";
    btn.style.marginTop = "35px";
    // btn.style.border="1px solid #bfbfbf";
    // btn.style.borderRadius="10px";
    // btn.style.lineHeight="50px";
    btn.style.float = "right";
    btn.addEventListener("click", Delete, false);
    function Delete() {
        var con = confirm("确认删除该信息");
        if (con) {
            var sessionID = localStorage.getItem("sessionID");
            var dat = MakeHeader(CM_MSGDEL1) +
                zx_sdk_MakeParam(CM_MSGDEL1_SES, sessionID) +
                zx_sdk_MakeParam(CM_MSGDEL1_MODEL, "1") +
                zx_sdk_MakeParam(CM_MSGDEL1_TIME, time);
            zx_sdk_SendStrByParent(DSTTYPE_SERVER, "", dat);
        } else {
            return;
        }
    }
    divElId.appendChild(btn);


    var divtxt = document.createElement("div");
    divtxt.innerHTML = "" + txt;
    divtxt.style.width = "230px";
    // divtxt.style.wordBreak="break-all";
    divtxt.style.float = "left";
    divtxt.style.left = "16px";
    divtxt.style.height = "90px";
    divtxt.style.overflow = "hidden";
    divtxt.style.marginTop = "20px";
    // divtxt.style.border="1px solid #bfbfbf";
    divtxt.addEventListener("click", readclick, false);
    function readclick() {
        var MyDiv = document.getElementById("MyDiv");
        var fade = document.getElementById("fade");
        MyDiv.style.display = 'block';
        MyDiv.innerHTML = txt + "<input type='text' style='width:40px;height:40px;background-image:url(../image/d12.png);margin:50% 0px 0px 262px;border:none;' onclick='Delet();' />";
        fade.style.display = 'block';
    }
    divElId.appendChild(divtxt);

    var divs = document.createElement("div");
    if (state == "0") {
        divs.innerHTML = "未读";
        divs.style.color = "red";
    } else {
        divs.innerHTML = "已读";
        divs.style.color = "#fff";
    }
    divs.style.width = "40px";
    divs.style.height = "20px";
    divs.style.marginTop = "15px";
    divs.style.float = "right";
    divs.style.right = "4px";
    // divs.style.border="1px solid #bfbfbf";
    divElId.appendChild(divs);


    var divt = document.createElement("div");
    divt.innerHTML = "" + time;
    divt.style.width = "130px";
    divt.style.height = "20px";
    divt.style.float = "right";
    divt.style.marginRight = "-37px";
    divt.style.marginTop = "-110px";
    // divt.style.border="1px solid #bfbfbf";
    divt.style.color = "#fff";
    divElId.appendChild(divt);
}

//解析页面传值函数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    } else {
        return null;
    }
}


//验证码处理
function getMessage(message) {
    // alert(message);
    var m = document.getElementById('message');
    m.value = message;
}

//个人中心界面数据处理
function getPersonInfor(LoginTime, RegisterTime) {
    var loginphone = localStorage.getItem("phone");
    var phone = document.getElementById('phone');
    phone.innerHTML = loginphone;
    var loginTime = document.getElementById('LoginTime');
    loginTime.innerHTML = LoginTime;
    var registerTime = document.getElementById('RegisterTime');
    registerTime.innerHTML = RegisterTime;
}

function Delet() {
    var MyDiv = document.getElementById("MyDiv");
    var fade = document.getElementById("fade");
    MyDiv.style.display = 'none';
    fade.style.display = 'none';
}