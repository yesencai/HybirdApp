
import { Injectable } from '@angular/core';
import { Platform, ToastController, App } from 'ionic-angular';
import { Tomato } from '../lib/tomato'
import { Storage } from '@ionic/storage'
import { RegistCode } from '../other/registCode'
import { Device } from '@ionic-native/device';
var ws: WebSocket
var web: WebSocket
var FDeveloperID = "1436280001";
var FAppID = "1004";
var FCustomData = "123456";//mac地址或随机数保存起来

var wsUri = "ws://www.tomato8848.net:449/";

const ACK_GETREGCODE_SUCCESS = 1;
const ACK_GETREGCODE_ERRORINFO = 2;
const ACK_GETREGCODE_REGCODE = 3;
var self;
@Injectable()
export class websocket {
    constructor(public device: Device, public regist: RegistCode, public appCtrl: App, public platform: Platform, public toastCtrl: ToastController, public tomato: Tomato, public storage: Storage) {
        self = this;
        if (device.uuid != null) {
            FCustomData = device.uuid;
        }
    }
    //链接webSocket
    connectwebsocket(ssid, password) {
        ws = new WebSocket('ws://192.168.4.1:8250/?ssid=' + ssid + '&password=' + password)
        //websocket连接成功
        ws.onopen = function () {


        };

        //接收数据回调
        ws.onmessage = function (evt) {

        };

        //websocket关闭回调
        ws.onclose = function (evt) {

        };
        //websocket发生错误回调
        ws.onerror = function (evt) {

        }

    }
    //链接webSocket
    registered_connectwebsocket() {
        web = new WebSocket(wsUri);
        //websocket连接成功
        web.onopen = function () {
            self.writeToScreen("websocket连接成功");
            self.SendGetRegCode();
        };

        //接收数据回调
        web.onmessage = function (evt) {
            var mFlag = self.GetParamValue(evt.data, ACK_GETREGCODE_SUCCESS);
            var RegCode = self.GetParamValue(evt.data, ACK_GETREGCODE_REGCODE);
            if (mFlag == "1") {
                //1.将注册数据写入到文件保存
                self.storage.set("RegCode", RegCode).then((val) => {
                    // alert('sss' + val);
                    //2.提示信息
                    self.writeToScreen("注册成功！");
                    self.regist.getRegitstCode();
                    //3.重新加载注册数据并登陆阿里云
                    self.doLoadRegsitCode(RegCode);

                });

            } else {
                self.writeToScreen("注册失败！");
            }

        };

        //websocket关闭回调
        web.onclose = function (evt) {
            // 关闭 websocket
            self.writeToScreen("websocket关闭");

        };
        //websocket发生错误回调
        web.onerror = function (evt) {
            self.writeToScreen("websocket发生错误回调");
        }

    }
    //主动发送数据
    webSend(message) {
        web.send(message);
    }
    //主动关闭websocket
    close() {
        ws.close(0, '关闭');
    }

    // 解析收到的数据
    GetParamValue(DataStr, FieldID) {
        var iStart, L, Fid, tmp;
        L = 0;
        Fid = 0;
        iStart = DataStr.indexOf(" ") + 1;
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

    doLoadRegsitCode(RegCode) {
        if (RegCode.indexOf("REGCODE ") == 0) {
            // self.writeToScreen("注册码存在");
            web.close(3000, '关闭');
            var HostName = this.GetParamValue(RegCode, 1);
            var HostPort = this.GetParamValue(RegCode, 2);
            var productKey = this.GetParamValue(RegCode, 3);
            var deviceName = this.GetParamValue(RegCode, 4);
            var deviceSecret = this.GetParamValue(RegCode, 5);
            var ServerDevID = this.GetParamValue(RegCode, 6);
            var mCustomData = '{' +
                '"HostName":"' + HostName + '",' +
                '"HostPort":"' + HostPort + '",' +
                '"productKey":"' + productKey + '",' +
                '"deviceName":"' + deviceName + '",' +
                '"deviceSecret":"' + deviceSecret + '"' +
                '}';
            self.tomato.SdkInit(self.OnLogEchoCallback, self.OnEventCallback, self.OnRecvCallback, "1", mCustomData);
            self.tomato.SdkStart();
        }
    }

    //发送获取注册码的数据包
    SendGetRegCode() {
        var StrPack = "1001 " +
            this.MakeParam(1, FDeveloperID) +
            this.MakeParam(2, FCustomData) +
            this.MakeParam(3, "123456") +
            this.MakeParam(4, FAppID) +
            this.MakeParam(5, "1502") +
            this.MakeParam(6, "C") +
            this.MakeParam(7, "") +
            this.MakeParam(8, "V0.12");
        // this.writeToScreen("SENT: " + StrPack);
        web.send(StrPack);
    }

    writeToScreen(message) {
        // this.codeMessage(message);
    }
    //获取验证码后的提示信息，失败或成功
    codeMessage(msg) {
        let toast = self.toastCtrl.create({
            message: msg,
            duration: 2000,
            position: "top"
        });
        toast.present();
    }

    //对把参数打包成“长度+ID+参数值”的格式
    MakeParam(ParamID, ParamValue) {
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
    MakeHeader(PackID) {
        var p = PackID.toString(16).toUpperCase();
        while (p.length < 4) p = "0" + p;
        p = p + " ";
        return p;
    }
    OnLogEchoCallback(LogType, LogCode, LogText) {
        self.codeMessage(LogText);
        console.log("OnLogEchoCallback:" + LogType + "+" + LogCode + "+" + LogText);
    }

    OnEventCallback(EventType, EventData) {
        console.log("OnEventCallback:" + EventType + "+" + EventData);
    }

    OnRecvCallback(SrcType, SrcID, PackData) {

    }
}