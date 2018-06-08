
import { Injectable } from '@angular/core';
import { Platform, ToastController, App } from 'ionic-angular';
import { Tomato } from '../lib/tomato'
import { TTConst } from '../lib/TTConst'
import { Common } from '../lib/Common'
import { Emitter } from './emitter'
var _this;
@Injectable()
export class DataModule {
    constructor(public tool: Tomato, public ttConst: TTConst, public common: Common, public toastCtrl: ToastController) {
        _this = this;
    }

    //链接服务器
    onConnectClick() {
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
        this.tool.SdkInit(this.OnLogEchoCallback, this.OnEventCallback, this.OnRecvCallback, "1", mCustomData);
        this.tool.SdkStart();

    }
    OnLogEchoCallback(LogType, LogCode, LogText) {
        _this.codeMessage(LogText);
        console.log("OnLogEchoCallback:" + LogType + "+" + LogCode + "+" + LogText);
    }

    OnEventCallback(EventType, EventData) {

        console.log("OnEventCallback:" + EventType + "+" + EventData);
    }

    OnRecvCallback(SrcType, SrcID, PackData) {
        console.log('数据回调PackData' + PackData);

        if (PackData == undefined) {
            return 0;
        }
        console.log("OnEventCallback:" + SrcType + " " + SrcID + " " + PackData);

        var mPackID, iPackID;
        mPackID = PackData.substring(0, 4);
        iPackID = parseInt(mPackID, 16);
        switch (iPackID) {
            case _this.ttConst.ACK_CLIENT_SMS: {
                _this.onSMSResponse(PackData);
                break;
            }
            case _this.ttConst.ACK_CLIENT_RAGISTER: {
                _this.onRegistResponse(PackData);
                break;
            }
            case _this.ttConst.ACK_CLIENT_LOGIN: {
                _this.onLoginResponse(PackData);
                break;
            }
            case _this.ttConst.ACK_CLIENT_UPDATEPWD: {
                _this.onChangePswResponse(PackData);
                break;
            }
            case _this.ttConst.ACK_CLIENT_LOGOFF: {
                _this.onExitResponse(PackData);
                break;
            }
            case _this.ttConst.ACK_CLIENT_UNPASSWORD: {
                _this.onResetPassWordResponse(PackData);
                break;
            }
            case _this.ttConst.ACK_CLIENT_ADD_FIRST_DEVICE: {
                _this.onAddNormalDeviceResponse(PackData);
                break;
            }
            case _this.ttConst.ACK_CLIENT_GET_FIRST_DEVICE: {
                _this.onGetDeviceListResponse(PackData);
                break;
            }
        }
    }

    //当收到验证码回复数据包时的处理函数
    onSMSResponse(PackData) {
        var mFlag = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_SMS_SUCCESS);
        if (mFlag == '1') {

        }
        var message = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_SMS_ERRORINFO);
        _this.codeMessage(message);
    }

    //注册成功数据处理
    onRegistResponse(PackData) {

        var mFlag = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_RAGISTER_SUCCESS);
        var message = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_RAGISTER_ERRINFO);
        Emitter.fire(this.ttConst.TT_REGISTED_NOTIFICATION_NAME, mFlag, message);

    }

    //登录成功数据处理
    onLoginResponse(PackData) {
        var mFlag = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_LOGIN_SUCCESS);
        var message = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_LOGIN_ERRORINFO);
        Emitter.fire(this.ttConst.TT_LOGIN_NOTIFICATION_NAME, mFlag, message);

    }

    //修改密码成功数据处理
    onChangePswResponse(PackData) {
        var mFlag = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_UPDATEPWD_SUCCESS);
        var message = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_UPDATEPWD_ERRORINFO);
        Emitter.fire(this.ttConst.TT_CHAGEPASSWORD_NOTIFICATION_NAME, mFlag, message);
    }

    //退出登录成功数据处理
    onExitResponse(PackData) {
        var mFlag = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_LOGOFF_SUCCESS);
        var message = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_LOGOFF_ERRORINFO);
        Emitter.fire(this.ttConst.TT_EXIT_NOTIFICATION_NAME, mFlag, message);
    }

    //重置密码成功数据处理
    onResetPassWordResponse(PackData) {
        var mFlag = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_UNPASSWORD_SUCCESS);
        var message = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_UNPASSWORD_ERRORINFO);
        Emitter.fire(this.ttConst.TT_RESETPASSWORD_NOTIFICATION_NAME, mFlag, message);
    }
    //添加普通设备成功数据处理
    onAddNormalDeviceResponse(PackData) {
        var mFlag = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_ADD_FIRST_DEVICE_SUCCESS);
        var message = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_ADD_FIRST_DEVICE_ERRORINFO);
        Emitter.fire(this.ttConst.TT_ADDNORMALDEVECE_NOTIFICATION_NAME, mFlag, message);
    }
    //添加普通设备成功数据处理
    onGetDeviceListResponse(PackData) {
        // 网关名称，唯一识别号
        var deviceId = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_GET_FIRST_DEVICE_ID);
        // 模式，GPRS 或 WIFI
        var deviceMode = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_GET_FIRST_DEVICE_MODE);
        // 在线状态
        var deviceOnline = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_GET_FIRST_DEVICE_ONLINE);
        // 外出布防\留守布防\撤防\告警等
        var deviceStat = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_GET_FIRST_DEVICE_STAT);
        // 别名，自定义名
        var deviceName= this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_GET_FIRST_DEVICE_NAME);
        var deviceNotifyalarmPhone1 = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_GET_FIRST_DEVICE_NOTIFYALARM_PHONE1);
        var deviceNotifyalarmPhone2 = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_GET_FIRST_DEVICE_NOTIFYALARM_PHONE2);
        var deviceNotifyalarmMode= this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_GET_FIRST_DEVICE_NOTIFYALARM_MODE);
        //以下不作用于门磁
        var deviceNotifyalarm = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_GET_FIRST_DEVICE_NOTIFYALARM_TIME);
        // 下挂的第二级设备数量      
        var deviceNumber= this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_GET_FSECOND_DEVICE_NUMBER);

        Emitter.fire(this.ttConst.TT_GETDEVICELIST_NOTIFICATION_NAME,
              deviceId,
              deviceMode,
              deviceOnline,
              deviceStat,
              deviceName,
              deviceNotifyalarmPhone1,
              deviceNotifyalarmPhone2,
              deviceNotifyalarmMode,
              deviceNotifyalarm,
              deviceNumber);
    }

    //获取验证码后的提示信息，失败或成功
    codeMessage(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 2000,
            position: "top"
        });
        toast.present();
    }

}
