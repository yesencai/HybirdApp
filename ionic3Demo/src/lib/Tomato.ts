/**********************************************/
/* 番茄物联JavaScript客户端SDK核心API接口定义 */
/**********************************************/

/*
  接口调用流程：

  第一步：根据TOnLogEchoCallback、TOnEventCallback、TOnRecvCallback创建回调函数。
  第二步：调用SdkInit函数时行SDK初始化。
  第三步：调用SdkStart函数启动SDK服务。HmacSHA1
  第四步：等待事件回调函数的事件，收到EV_LoginSuccess 和EV_GetTopicSuccess事件后，云服务平台就连接成功了。
  第五步：云服务平台连接成功后，就可以随意调用PackSend函数进行数据发送了。接收的数据在OnRecvCallback里。
  
*/
import { Injectable } from '@angular/core';
import { Platform, ToastController, App } from 'ionic-angular';
import { Paho } from 'ng2-mqtt'
import * as CryptoJS from 'crypto-js/crypto-js';

const EV_Connect = 1;
const EV_Disconnect = 2;
const EV_LoginSuccess = 3;
const EV_LoginFail = 4;
const EV_GetTopicSuccess = 5;
const EV_GetTopicFail = 6;
const EV_ReleaseTopicSuccess = 7;
const EV_RecvBeatPack = 8;

//当事件为EV_Disconnect时的数据
const EVDATA_CONN_LOST = "1"; //掉线了
const EVDATA_CONN_CLOSE = "2"; //客户端主动断开连接

const LOGTYPE_INFO = 0; //普通提示型日志
const LOGTYPE_ERROR = 1; //错误提醒型日志

const SRCTYPE_SERVER = 0;     //从应用服务器发过来的
const SRCTYPE_DEVCLI = 1;     //从其它设备发送来的

var FLogEchoCallBack = null;
var FEventCallBack = null;
var FRecvCallBack = null;
var FDeveloperID = null;
var FCustomData = null;
var FMqttClient = null;

var FHostName = "";
var FHostPort = "";
var FProductKey = "";
var FDeviceName = "";
var FDeviceSecret = "";
var FMqttParamsInited = false;

var FWillDisconnect = false;

var connected = false;

var _this;

@Injectable()
export class Tomato {

  DSTTYPE_SERVER: number = 2;     //发送给应用服务器，这里的值有两种，0和2，
  //当服务器是使用普通的设备来实现时填写2，
  //当服务器是使用消息队列来实现时填写0
  DSTTYPE_DEVCLI: number = 1;     //发送给其它设备

  //构造函数 依赖注入
  constructor(public platform: Platform,
    public appCtrl: App,
    public toastCtrl: ToastController) {
    _this = this;
  }

  /*显示调试信息*/
  echoDebugInfo(ADebugText) {
    alert(ADebugText);
  }

  /*主题订阅*/
  subscribe(ATopic, AQos) {
    //console.info('Subscribing to: Topic: ', topic, '. QoS: ', qos);
    FMqttClient.subscribe(ATopic, { qos: Number(AQos) });
  }

  /*发送主题消息*/
  publish(ATopic, AQos, AMessage, ARetain) {
    //console.info('Publishing Message: Topic: ', topic, '. QoS: ' + qos + '. Message: ', message);
    var message = new Paho.MQTT.Message(AMessage);
    message.destinationName = ATopic;
    message.qos = Number(AQos);
    message.retained = ARetain;
    FMqttClient.send(message);
  }


  /*取消某个主题的订阅*/
  unsubscribe(ATopic) {
    FMqttClient.unsubscribe(ATopic, {
      onSuccess: _this.unsubscribeSuccess,
      onFailure: _this.unsubscribeFailure,
      invocationContext: { topic: ATopic }
    });
  }


  /*取消主题订阅成功时的回调函数*/
  unsubscribeSuccess(context) {
    //console.info('Successfully unsubscribed from ', context.invocationContext.topic);
  }

  /*取消主题订阅失败时的回调函数*/
  unsubscribeFailure(context) {
    //console.info('Failed to  unsubscribe from ', context.invocationContext.topic);
  }

  /*当连接并登录成功时的回调函数 */
  onConnect(context) {
    // Once a connection has been made, make a subscription and send a message.

    //订阅默认主题
    var mTopic = "/" + FProductKey + "/" + FDeviceName + "/get";
    _this.subscribe(mTopic, 0);

    var msg = "aliyun connect and login Success";
    if (FLogEchoCallBack != null) {
      FLogEchoCallBack(LOGTYPE_INFO, 1, msg);
    } else {
      _this.echoDebugInfo(msg);
    }

    if (FEventCallBack != null) {
      FEventCallBack(EV_LoginSuccess, "");
      FEventCallBack(EV_GetTopicSuccess, "");
    }

    //var statusSpan = document.getElementById("connectionStatus");
    //statusSpan.innerHTML = "Connected to: " + context.invocationContext.host + ':' + context.invocationContext.port + context.invocationContext.path + ' as ' + context.invocationContext.clientId;
    connected = true;
  }

  /*当连接失败时的回调函数*/
  onFail(context) {
    var msg = "aliyun connect fail";
    if (FLogEchoCallBack != null) {
      FLogEchoCallBack(LOGTYPE_INFO, 2, msg);
    } else {
      _this.echoDebugInfo(msg);
    }

    if (FEventCallBack != null) {
      FEventCallBack(EV_LoginFail, "");
    }
    //var statusSpan = document.getElementById("connectionStatus");
    //statusSpan.innerHTML = "Failed to connect: " + context.errorMessage;
    connected = false;
  }

  /*当连接掉线时的回调函数*/
  onConnectionLost(responseObject) {
    var msg;

    if (FWillDisconnect == true) {
      msg = "aliyun disconnected";
    } else {
      msg = "aliyun connect fail";
    }

    if (FLogEchoCallBack != null) {
      FLogEchoCallBack(LOGTYPE_INFO, 3, msg);
    } else {
      _this.echoDebugInfo(msg);
    }

    if (FEventCallBack != null) {
      if (FWillDisconnect == true) {
        FEventCallBack(EV_Disconnect, EVDATA_CONN_CLOSE);
      } else {
        FEventCallBack(EV_Disconnect, EVDATA_CONN_LOST);
      }
    }

    //if (responseObject.errorCode !== 0) {
    //  echoDebugInfo("Connection Lost: " + responseObject.errorMessage);
    //}

    FWillDisconnect = false;
    connected = false;
  }

  /*当收到消息时的回调函数*/
  onMessageArrived(message) {
    //echoDebugInfo('Message Recieved: Topic: '+ message.destinationName+ '. Payload: '+ message.payloadString+ '. QoS: '+ message.qos);
    //echoDebugInfo(message);
    if (FRecvCallBack != null) {
      //FRecvCallBack();
      //echoDebugInfo('Message Recieved: Topic: '+ message.destinationName+ '. Payload: '+ message.payloadString+ '. QoS: '+ message.qos)

      //诸智云发送过来的数据包格式：{"sid":"11122333","did":"1001100008","dty":"1","data":"abcde"}
      var mPayloadString, mSrcID, mDstID, mSrcType, mData, mJsonObject;
      mPayloadString = message.payloadString;

      if (_this.isJSON(mPayloadString)) {
        mJsonObject = _this.JsonStrToObject(mPayloadString);
        mSrcType = mJsonObject.dty;
        mSrcID = mJsonObject.sid;
        mDstID = mJsonObject.did;
        mData = mJsonObject.data;

        if (mDstID == FDeviceName) { //只处理属于自己的数据
          if (mData.length > 1) {
            //诸智云发过来的数据第一个字节用于表示数据种类，因此长度肯定大于1。
            //第1字节是S时表示这是一个普通的字符串，
            //第1字节是X时表示这是一个十六进制数据，需要转码再返回
            if (mData.charAt(0) == "S") {
              mData = mData.substr(1, mData.length - 1); //去掉第1字节
              FRecvCallBack(mSrcType, mSrcID, mData);
            } else {
              if (mData.charAt(0) == "H") {
                mData = mData.substr(1, mData.length - 1); //去掉第1字节
                var L = (mData.length - 1) / 2;
                var Ret = new Array();
                var str = "";
                for (var i = 0; i < L; ++i) {
                  Ret[i] = parseInt(mData.substring(i * 2, i * 2 + 2), 16);
                }

                for (var j = 0; j < Ret.length; j++) {
                  str += String.fromCharCode(Ret[j]);
                }
                FRecvCallBack(mSrcType, mSrcID, str);

              }
            }
          }
        }
      }
    }
  }

  /*连接并登录MQTT服务器*/
  connect(AHostName, APort, AClientID, APath, AUser, APass, AKeepAlive, ATimeOut, ATls, ACleanSession) {
    if (APath.length > 0) {
      FMqttClient = new Paho.MQTT.Client(AHostName, Number(APort), APath, AClientID);
    } else {
      FMqttClient = new Paho.MQTT.Client(AHostName, Number(APort), AClientID);
    }

    // set callback handlers
    FMqttClient.onConnectionLost = _this.onConnectionLost;
    FMqttClient.onMessageArrived = _this.onMessageArrived;
    var options = {
      invocationContext: { host: AHostName, port: APort, path: FMqttClient.path, clientId: AClientID },
      timeout: ATimeOut,
      keepAliveInterval: AKeepAlive,
      cleanSession: ACleanSession,
      useSSL: ATls,
      onSuccess: _this.onConnect,
      onFailure: _this.onFail,
      userName: "",
      password: ""
    };

    if (AUser.length > 0) {
      options.userName = AUser;
    }

    if (APath.length > 0) {
      options.password = APass;
    }

    // connect the client
    FMqttClient.connect(options);
  }

  /*断开连接*/
  disconnect() {
    //echoDebugInfo('Disconnecting from Server');
    FWillDisconnect = true;
    FMqttClient.disconnect();
    connected = false;
  }

  /* 对某个数据进行HmacSHA1加密，在调用本函数前必须加载crypto-js.js这个文件 */
  GetHmacSHA1(Src, Key) {
    var r = CryptoJS.HmacSHA1(Src, Key);
    //这行不要删除，删除后将会导致connect函数无法正常连接。
    //可能是HmacSHA1函数返回的值不是字符串，而是对像，所以这样处理一下就变成字符串了。
    // r = r + "";
    return r.toLocaleString();
  }

  /*
  把一个字符串转换为JSON对象
  使用这个函数时必须加载json2.js这个文件
  */
  JsonStrToObject(AJsonStr) {
    return JSON.parse(AJsonStr);
  }

  /*
  把一个JSON转换为一个字符串
  使用这个函数时必须加载json2.js这个文件
  */
  JsonObjectToStr(AJsonObj) {
    return JSON.stringify(AJsonObj);
  }

  /*
  判断一个变量是否为JSON格式的字符串
  使用这个函数时必须加载json2.js这个文件
  */
  isJSON(str) {
    if (typeof str == 'string') {
      try {
        var obj = JSON.parse(str);
        if (typeof obj == 'object' && obj) {
          return true;
        } else {
          return false;
        }

      } catch (e) {
        return false;
      }
    }
  }

  /*取得某个区间范围内的随机整数*/
  RandomInt(n, m) {
    var iRnd = Math.floor(Math.random() * (m - n + 1) + n);
    return iRnd;
  }

  //日志提示回调函数原型定义(C语言)
  //当有日志提示时，本函数会被调用，可以在这个回调函数中根据不同的日志类别和日志代
  //码决定是否显示这条日志信息
  //参数说明：
  //LogType - 日志类别，是一个整数
  //LogCode - 日志代码，是一个整数
  //LogText - 日志信息，是一个字符串
  //typedef void TOnLogEchoCallback(int16 LogType, int16 LogCode, char * LogText);

  //事件提示回调函数原型定义(C语言)
  //当出现登录成功、网络断开、网络错误等事件时的回调函数
  //参数说明：
  //
  //其它说明：
  //   当登录成功时，当前使用的客户端ID号会通过这个回调函数进行输出。
  //EventType - 事件类别，是一个整数
  //EventData - 相关数据，不同的事件类别有不同的数据，是一个字符串
  //typedef void TOnEventCallback(int16 EventType, void * EventData);

  //应用层数据接收回调函数原型定义(C语言)
  //当接收到应用服务器或其它客户端设备发送过来的应用层数据时，这个函数会被调用
  //参数说明：
  //SrcType       - 发送源类别，0-从应用服务器发过来的；1-从其它设备发送来的
  //SrcID         - 发送源ID，当数据来源是应用服务器时，这个是应用服务器的ID号。是一个字符串
  //                当数据来源是设备时，这个是设备的ID号。SrcID是一个字符串，最大长度是19个字节。
  //PackData      - 本次收到的应用层透明数据，是一个字符串
  //typedef void TOnRecvCallback(char SrcType, char * SrcID, char * PackData);

  //函数功能：SDK初始化
  //参数清单：
  //    LogEchoCallBack - 日志显示回调函数，当有日志时，通过这个回调函数进行输入，可以在这个回调函数中决定是否进行显示。
  //    EventCallBack - 当出现登录成功、登录失败、网络掉线等事件时，通过这个回调函数进行通知。
  //    RecvBackBack - 应用数据接收回调函数。
  //    DeveloperID - 开发者注册号，是一个最大长度为19个字节的字符串。
  //    CustomData - 备用的自定义参数，是一个使用JSON格式字符串。当需要使用特定的ID号进行登录时，可以通过这个参数传入。
  //返 回 值：返回值是一个整数，当返回值为0时，表示成功，其它值是错误代码。
  //          当返回值不为0时表示错误，具体错误信息可以通过日志事件代码确定。
  //错误代码表：
  //
  //其它说明：
  //
  SdkInit(LogEchoCallBack, EventCallBack, RecvCallBack, DeveloperID, CustomData) {
    FLogEchoCallBack = LogEchoCallBack;
    FEventCallBack = EventCallBack;
    FRecvCallBack = RecvCallBack;
    FDeveloperID = DeveloperID;
    FCustomData = CustomData;

    if (_this.isJSON(FCustomData)) {
      var mJsonObj = _this.JsonStrToObject(FCustomData);
      FHostName = mJsonObj.HostName;
      FHostPort = mJsonObj.HostPort;
      FProductKey = mJsonObj.productKey;
      FDeviceName = mJsonObj.deviceName;
      FDeviceSecret = mJsonObj.deviceSecret;
      if (FHostName != null && FHostPort != null && FProductKey != null && FDeviceName != null && FDeviceSecret != null) {
        FMqttParamsInited = true;
      }
    }
    return 0;
  }

  //函数功能：启动SDK的云服务平台连接功能
  //参数清单：
  //返 回 值：返回值是一个整数，返回值不为0时表示错误，其值为错误码。
  //错误代码表：
  //1 - MQTT 参数没有设置好
  //其它说明：
  //    本函数的返回值只代表函数调用的结果，不能表示平台连接是否成功。平台连接是否成功要看事件回调函数。
  SdkStart() {
    var iRet = 0;
    if (FMqttParamsInited == true) {
      var iTimeStamp = _this.RandomInt(1, 1000000);
      var mClientID = "12345";
      var mAliClientID = mClientID + "|securemode=2,signmethod=hmacsha1,timestamp=" + iTimeStamp + "|";
      var mUser = FDeviceName + "&" + FProductKey;

      var mPassSrc = "clientId" + mClientID + "deviceName" + FDeviceName + "productKey" + FProductKey + "timestamp" + iTimeStamp;
      var mPassKey = FDeviceSecret;
      var mPassEnc = _this.GetHmacSHA1(mPassSrc, mPassKey);
      _this.connect(FHostName, FHostPort, mAliClientID, "/wss", mUser, mPassEnc, 60, 3, true, true);
    } else {
      iRet = 1;
      _this.echoDebugInfo("MQTT Params not init.")
    }
    return iRet;

  }

  //函数功能：停止SDK的云服务平台连接功能
  //参数清单：
  //返 回 值：返回值是一个大于或等于0的整数，返回0时表示调用正常，其它值表示错误。
  //错误代码表：
  //
  //其它说明：
  //
  SdkStop() {
    _this.disconnect();
    return 0;
  }

  //函数功能：发送二进制流形式的应用数据包
  //参数清单：
  //    DstType       - 接收者类别，0-接收者是应用服务器；1-接收者是其它设备或客户端
  //    DstID         - 接收者ID，当接收者类别是应用服务器时，这个是应用服务器的ID号。
  //                    当接收者类别是设备或客户端时，这个是设备或客户端的ID号。
  //                    DstID是一个字符串，最大长度是19个字节。
  //    BinData       - 本次要发送的应用层透明数据，是一个二进制对象，最大字节数不能超过8192字节。
  //    BinSize       - BinData的字节数。
  //返 回 值：返回值是一个大于或等于0的整数，返回0时表示调用正常，其它值表示错误。
  //错误代码表：
  //
  //其它说明：
  //1、有关JavaScript处理二进制流的相关知识请看下面这个网址
  //   http://blog.csdn.net/myweishanli/article/details/22997863
  //2、本函数在向物联网套件发送数据前，会先把要发送的数据包全部转换为16进制数据
  SdkSendBin(DstType, DstID, BinData, BinSize) {

    return 0;
  }

  //函数功能：发送字符串形式的应用数据包
  //参数清单：
  //    DstType       - 接收者类别，0-接收者是应用服务器；1-接收者是其它设备或客户端
  //    DstID         - 接收者ID，当接收者类别是应用服务器时，这个是应用服务器的ID号，如果输入为空，将使用默认的ID号。
  //                    当接收者类别是设备或客户端时，这个是设备或客户端的ID号。
  //                    DstID是一个字符串，最大长度是19个字节。
  //    StrPack       - 本次要发送的应用层透明数据，是一个字符串，最大字节数不能超过8192字节。
  //返 回 值：返回值是一个大于或等于0的整数，返回0时表示调用正常，其它值表示错误。
  //错误代码表：
  //
  //其它说明：
  //
  SdkSendStr(DstType, DstID, StrPack) {

    var mDstID = DstID;
    if (DstType == this.DSTTYPE_SERVER && DstID == "") {
      mDstID = "S1001000101";
    }
    var mJsonStr = '{"sid":"' + FDeviceName + '","did":"' + mDstID + '","dty":"' + DstType + '","data":"S' + StrPack + '"}';
    var mTopic = "/" + FProductKey + "/" + FDeviceName + "/update";
    _this.publish(mTopic, 0, mJsonStr, false);
    return 0;
  }


}
