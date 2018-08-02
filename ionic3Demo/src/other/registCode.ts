

import { Injectable } from '@angular/core';
import { Platform, App } from 'ionic-angular';
import { Storage } from '@ionic/storage'

@Injectable()
export class RegistCode {

    //构造函数 依赖注入
    constructor(public platform: Platform,
        public appCtrl: App,
        public storage: Storage) {
        storage.ready().then(() => {
           this.getRegitstCode();
        });
    }
    code: any;
    getRegitstCode() {
        this.storage.get('RegCode').then((val) => {
            this.code = val; // get the value what I need
        });
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
    getCode() {
        return this.code ? this.code : 'undefined';
    }
    getServeId() {
        var ServerDevID = this.GetParamValue(this.code ? this.code : 'undefined', 6);
        return ServerDevID;
    }

    getDeviceId() {

    }

}
