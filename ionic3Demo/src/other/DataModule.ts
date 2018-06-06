
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
