import { SdkInit, SdkStart, EV_GetTopicSuccess, EV_Disconnect } from '../lib/sdk'
import { getFieldValue } from '../lib/common'
import { ACK_CLIENT_SMS, ACK_CLIENT_SMS_SUCCESS, ACK_CLIENT_SMS_ERRORINFO } from '../lib/pack'


//链接服务器
export const onConnectClick = function () {
    //l4uattL0H4i
    var HostName = "l4uattL0H4i.iot-as-mqtt.cn-shanghai.aliyuncs.com";
    var HostPort = "443";
    var productKey = "l4uattL0H4i";
    var deviceName = "C1001000100008";
    var deviceSecret = "4DdWeXJeyMhuBXzs99VmpsFEK2c96i2i";
    var mCustomData = '{' +
        '"HostName":"' + HostName + '",' +
        '"HostPort":"' + HostPort + '",' +
        '"productKey":"' + productKey + '",' +
        '"deviceName":"' + deviceName + '",' +
        '"deviceSecret":"' + deviceSecret + '"' +
        '}';
    SdkInit(OnLogEchoCallback(), OnEventCallback(), OnRecvCallback(), "1", mCustomData);
    SdkStart();

}
function OnLogEchoCallback(LogType, LogCode, LogText) {
    alert("logInfo:" + LogType + LogCode + LogText);
    console.log("OnLogEchoCallback:" + LogType + "+" + LogCode + "+" + LogText);
}

function OnEventCallback(EventType, EventData) {
    console.log("OnEventCallback:" + EventType + "+" + EventData);
}

function OnRecvCallback(SrcType, SrcID, PackData) {
    console.log('数据回调PackData' + PackData);

    if (typeof PackData === "undefined") {
        return 0;
    }
    var mPackID, iPackID;
    mPackID = PackData.substring(0,4);
    iPackID = parseInt(mPackID, 16);
    switch (iPackID) {
        case ACK_CLIENT_SMS: {
            OnSMSResponse();
            break;
        }
    }
}
//当收到验证码回复数据包时的处理函数
function OnSMSResponse(PackData) {
    var mFlag;
    mFlag = getFieldValue(PackData, ACK_CLIENT_SMS);
    if (mFlag == "0") {
        codeMessage("获取验证码成功");
    } else {
        codeMessage("获取验证码失败");
    }
}

function isUndefined(value) {
    //获得undefined，保证它没有被重新赋值
    var undefined = void (0);
    return value === undefined;
}