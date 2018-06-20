
import { Injectable } from '@angular/core';
import { Platform, ToastController, App } from 'ionic-angular';
import { Paho } from 'ng2-mqtt'
import * as CryptoJS from 'crypto-js/crypto-js';
import { Tomato } from '../lib/tomato'
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
var _this;

@Injectable()
export class Common {
    loadingIsOpen: boolean = false;
    loading;
    //构造函数 依赖注入
    constructor(public platform: Platform,
        public appCtrl: App,
        public toastCtrl: ToastController, public tomato: Tomato, public loadingCtrl: LoadingController) {
        _this = this;
    }
    // 解析收到的数据
    getFieldValue(DataStr, FieldID) {
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

    disconnect() {
        this.tomato.disconnect;
    }

    //通过主页面发送字符串数据包，本函数只能在子页面中调用，不能在主页面调用，否则会出错
    SendStrByParent(DstType, DstID, StrPack) {
        this.tomato.SdkSendStr(DstType, DstID, StrPack);
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

    //判断一个字符串是否是一个正确的手机号
    //是就返回true，不是就返回false
    //这个函数是在网上下载的，如果需要看实现原理，请看如下网址
    //http://blog.csdn.net/nongweiyilady/article/details/74007124
    isPoneAvailable(phoneInput) {
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


    /**
     * 统一调用此方法显示loading
     * @param content 显示的内容
     */
    showLoading(content: string = ''): void {
        if (!this.loadingIsOpen) {
            this.loadingIsOpen = true;
            this.loading = this.loadingCtrl.create({
                content: content
            });
            this.loading.present();
            setTimeout(() => { //最长显示10秒
                this.loadingIsOpen && this.loading.dismiss();
                this.loadingIsOpen = false;
            }, 10000);
        }
    };

    /**
     * 关闭loading
     */
    hideLoading(): void {
        this.loadingIsOpen && this.loading.dismiss();
        this.loadingIsOpen = false;
    };


    /*取得某个区间范围内的随机整数*/
    randomInt(n, m) {
        var iRnd = Math.floor(Math.random() * (m - n + 1) + n);
        return iRnd;
    }
    //转换时间
    transDate(n) {
        var date = new Date(n);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        return (Y + M + D)
    }


}
