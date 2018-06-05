
import { Injectable } from '@angular/core';
import { Platform, ToastController, App } from 'ionic-angular';
import { Tomato } from '../lib/tomato'
import { TTConst } from '../lib/TTConst'
import { Common } from '../lib/Common'
var _this;
@Injectable()
export class DataModule {
    constructor( public tool: Tomato, public ttConst: TTConst, public common: Common, public toastCtrl: ToastController) {
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
        alert("logInfo:" + LogType + LogCode + LogText);
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
                _this.OnSMSResponse(PackData);
                break;
            }
            case _this.ttConst.ACK_CLIENT_RAGISTER: {
                _this.OnSMSResponse(PackData);
                break;
            }
        }
    }
    
    //当收到验证码回复数据包时的处理函数
    OnSMSResponse(PackData) {
        var message = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_SMS_ERRORINFO);
        var xx=new GB2312UTF8();
        var Utf8=xx.Gb2312ToUtf8("你aaa好aaaaa");
        _this.codeMessage(message);
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
