
import { Injectable } from '@angular/core';
import { Platform, ToastController, App } from 'ionic-angular';
import { Tomato } from '../lib/tomato'
import { TTConst } from '../lib/TTConst'
import { Common } from '../lib/Common'
import { Emitter } from './emitter'
import { websocket } from '../lib/websocket'
import { connect } from 'http2';
import { Storage } from '@ionic/storage'

let self;
@Injectable()
export class DataModule {
    constructor(public platform: Platform,
        public appCtrl: App, public tool: Tomato, public ttConst: TTConst, public common: Common, public toastCtrl: ToastController, public websocket: websocket, public storage: Storage) {
        self = this;
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

    //链接服务器
    onConnectClick() {

        // var randomInt = this.common.randomInt(1,100000);
        // this.tool.SdkGetRegistCode(this.OnEventCallback,"1436280001","1004",randomInt);
        this.storage.get('RegCode').then((value1) => {
            if (!value1) {
                self.websocket.registered_connectwebsocket();
            } else {
                // l4uattL0H4i
                // var HostName = "l4uattL0H4i.iot-as-mqtt.cn-shanghai.aliyuncs.com";
                // var HostPort = "443";
                // var productKey = "l4uattL0H4i";
                // var deviceName = "C1001000100008";
                // var deviceSecret = "4DdWeXJeyMhuBXzs99VmpsFEK2c96i2i";
                var RegCode = value1;
                if (RegCode == "undefined") {
                    return;
                }
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
                self.tool.SdkInit(self.OnLogEchoCallback, self.OnEventCallback, self.OnRecvCallback, "1", mCustomData);
                self.tool.SdkStart();
            }
        });

    }
    OnLogEchoCallback(LogType, LogCode, LogText) {
        self.codeMessage(LogText);
        console.log("OnLogEchoCallback:" + LogType + "+" + LogCode + "+" + LogText);
        if (LogCode == '1') {
            Emitter.fire(self.ttConst.TT_MQTTCONNET_NOTIFICATION_NAME, LogCode, LogText);
        }
    }

    OnEventCallback(EventType, EventData) {
        console.log("OnEventCallback:" + EventType + "+" + EventData);
    }

    OnRecvCallback(SrcType, SrcID, PackData) {
        console.log('数据回调PackData' + PackData);
        if (PackData === '该查询时间段没有记录！') {
            self.codeMessage(PackData);
        }
        if (PackData==='尚未绑定设备') {
            self.codeMessage(PackData);
        }
        if (PackData == undefined) {
            return 0;
        }
        console.log("OnEventCallback:" + SrcType + " " + SrcID + " " + PackData);

        var mPackID, iPackID;
        mPackID = PackData.substring(0, 4);
        iPackID = parseInt(mPackID, 16);
        switch (iPackID) {
            case self.ttConst.ACK_CLIENT_SMS: {
                self.onSMSResponse(PackData);
                break;
            }
            case self.ttConst.ACK_CLIENT_RAGISTER: {
                self.onRegistResponse(PackData);
                break;
            }
            case self.ttConst.ACK_CLIENT_LOGIN: {
                self.onLoginResponse(PackData);
                break;
            }
            case self.ttConst.ACK_CLIENT_UPDATEPWD: {
                self.onChangePswResponse(PackData);
                break;
            }
            case self.ttConst.ACK_CLIENT_LOGOFF: {
                self.onExitResponse(PackData);
                break;
            }
            case self.ttConst.ACK_CLIENT_UNPASSWORD: {
                self.onResetPassWordResponse(PackData);
                break;
            }
            case self.ttConst.ACK_CLIENT_ADD_FIRST_DEVICE: {
                self.onAddNormalDeviceResponse(PackData);
                break;
            }
            case self.ttConst.ACK_CLIENT_GET_FIRST_DEVICE: {
                self.onGetDeviceListResponse(PackData);
                break;
            }
            case self.ttConst.ACK_CLIENT_DEL_FIRST_DEVICE: {
                self.onRemoveDeviceResponse(PackData);
                break;
            }
            case self.ttConst.ACK_SET_DEVICE: {
                self.onHomeProtectionDeviceResponse(PackData);
                break;
            }
            case self.ttConst.ACK_CLIENT_GET_HISTOR_FIRST_DEVICE: {
                self.onDeviceProtectionDeviceHistroyListResponse(PackData);
                break;
            }
            case self.ttConst.ACK_CLIENT_SET: {
                self.onChangeRemarkDeviceHistroyListResponse(PackData);
                break;
            }
            case self.ttConst.ACK_SET_DEVICE: {
                self.onAddAlarmResponse(PackData);
                break;
            }
            case self.ttConst.ACK_SETUPDATENOTIFYALARM: {
                self.onOffLineDeviceResponse(PackData);
                break;
            }
            case self.ttConst.ACK_CLIENT_GET_SECOND_DEVICE: {
                self.onSecondaryDeviceListResponse(PackData);
                break;
            }
            case self.ttConst.DEVICE_SEND_ID: {
                self.ongetSecondaryDeviceIDResponse(PackData);
                break;
            }
            case self.ttConst.ACK_CLIENT_ADD_SECOND_DEVICE: {
                self.onAddSecondaryDeviceResponse(PackData);
                break;
            }
            case self.ttConst.ACK_CLIENT_DEL_SECOND_DEVICE: {
                self.onDeleteSecondaryDeviceResponse(PackData);
                break;
            }
            case self.ttConst.ACK_CLIENT_STOP_CALL: {
                self.onStopCallResponse(PackData);
                break;
            }
            case self.ttConst.ACK_CLIENT_LEARN: {
                self.onLearningResponse(PackData);
                break;
            }
            case self.ttConst.SERVER_SEND: {
                self.onCallThePoliceResponse(PackData);
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
        self.codeMessage(message);
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
        // 外出布防\留守布防\撤防\
        var deviceStat = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_GET_FIRST_DEVICE_STAT);
        //告警等
        var deviceAlarmStat = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_GET_FIRST_DEVICE_ALARMSTAT);
        // 别名，自定义名
        var deviceName = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_GET_FIRST_DEVICE_NAME);
        // var chinese = deviceName.replace(/[^\u4e00-\u9fa5]/gi,"");
        // deviceName = deviceName.substring(0,deviceName.length - chinese.length);
        var deviceNotifyalarmPhone1 = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_GET_FIRST_DEVICE_NOTIFYALARM_PHONE1);
        var deviceNotifyalarmPhone2 = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_GET_FIRST_DEVICE_NOTIFYALARM_PHONE2);
        var deviceNotifyalarmMode = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_GET_FIRST_DEVICE_NOTIFYALARM_MODE);
        //以下不作用于门磁
        var deviceNotifyalarm = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_GET_FIRST_DEVICE_NOTIFYALARM_TIME);
        // 下挂的第二级设备数量      
        var deviceNumber = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_GET_FSECOND_DEVICE_NUMBER);
        // 设备位置      
        var deviceAddress = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_GET_FSECOND_DEVICE_AREA);
        // var chinese1 = deviceAddress.replace(/[^\u4e00-\u9fa5]/gi,"");
        // deviceAddress = deviceAddress.substring(0,deviceAddress.length - chinese.length);
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
            deviceNumber, deviceAddress, deviceAlarmStat);
    }
    //删除设备设备成功数据处理
    onRemoveDeviceResponse(PackData) {
        var mFlag = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_DEL_FIRST_DEVICE_SUCCESS);
        var message = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_DEL_FIRST_DEVICE_ERRORINFO);
        Emitter.fire(this.ttConst.TT_REMOVEDEVICE_NOTIFICATION_NAME, mFlag, message);
    }
    //设置布防
    onHomeProtectionDeviceResponse(PackData) {
        var mFlag = this.common.getFieldValue(PackData, this.ttConst.ACK_SET_DEVICE_SUCCESS);
        var message = this.common.getFieldValue(PackData, this.ttConst.ACK_SET_DEVICE_ERRORINFO);
        Emitter.fire(this.ttConst.TT_HOMEPROTECTION_NOTIFICATION_NAME, mFlag, message);
    }

    //获取设备布防历史记录
    onDeviceProtectionDeviceHistroyListResponse(PackData) {
        var deviceId = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_GET_HISTOR_FIRST_DEVICEID);
        var historyTime = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_GET_HISTOR_FIRST_HISTORYTIME);
        var historyData = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_GET_HISTOR_FIRST_HISTORYDATA);
        Emitter.fire(this.ttConst.TT_GETDEVICEHISTORYLIST_NOTIFICATION_NAME, deviceId, historyTime, historyData);
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
    //修改设备别名
    onChangeRemarkDeviceHistroyListResponse(PackData) {
        var mFlag = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_SET_SUCCESS);
        var message = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_SET_ERRORINFO);
        Emitter.fire(this.ttConst.TT_CHANGEREMARKE_NOTIFICATION_NAME, mFlag, message);
    }
    //添加预警
    onAddAlarmResponse(PackData) {
        var mFlag = this.common.getFieldValue(PackData, this.ttConst.ACK_SET_DEVICE_SUCCESS);
        var message = this.common.getFieldValue(PackData, this.ttConst.ACK_SET_DEVICE_ERRORINFO);
        Emitter.fire(this.ttConst.TT_ADDALARM_NOTIFICATION_NAME, mFlag, message);

    }
    //设备离线时收到服务器回复
    onOffLineDeviceResponse(PackData) {
        var mFlag = this.common.getFieldValue(PackData, this.ttConst.ACK_SETUPDATENOTIFYALARM_SUCCESS);
        var message = this.common.getFieldValue(PackData, this.ttConst.ACK_SETUPDATENOTIFYALARM_ERRORINFO);
        Emitter.fire(this.ttConst.TT_DEVICEOFFLINE_NOTIFICATION_NAME, mFlag, message);
    }

    //获取第二级在设备
    onSecondaryDeviceListResponse(PackData) {
        // 第二季设备id
        var deviceId = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_GET_SECOND_DEVICE_ID);
        // 设备是否在线
        var deviceOnline = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_GET_SECOND_DEVICE_ONLINE);
        // 设备名称
        var deviceName = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_GET_SECOND_DEVICE_NAME);
        // 设备位置
        var deviceAddress = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_GET_SECOND_DEVICE_AREA);
        // 布防还是撤防
        var deviceStatu = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_GET_SECOND_DEVICE_STAT);
        //开门还是关门
        var deviceOpenDoor = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_GET_SECOND_DEVICE_ALARMSTAT);
        //遥控器还是探头
        var deviceType = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_GET_SECOND_DEVICE_TYPE);

        Emitter.fire(this.ttConst.TT_SECONDARYDEVICELIST_NOTIFICATION_NAME,
            deviceId,
            deviceOnline,
            deviceName,
            deviceAddress,
            deviceStatu, deviceOpenDoor, deviceType);
    }

    //获取二级设备id
    ongetSecondaryDeviceIDResponse(PackData) {
        // 设备id，唯一识别号
        var deviceId = this.common.getFieldValue(PackData, this.ttConst.DEVICE_SEND_SECONDDEVICEID);
        Emitter.fire(this.ttConst.TT_GETSECONDARYDEVICEID_NOTIFICATION_NAME,
            deviceId, );
    }
    //添加第二级设备
    onAddSecondaryDeviceResponse(PackData) {
        var mFlag = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_ADD_SECOND_DEVICE_SUCCESS);
        var message = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_ADD_SECOND_DEVICE_ERRORINFO);
        var number = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_ADD_SECOND_DEVICE_NUM);

        Emitter.fire(this.ttConst.TT_ADDGETSECONDARYDEVICE_NOTIFICATION_NAME, mFlag, message,number);
    }
    //删除第二级设备
    onDeleteSecondaryDeviceResponse(PackData) {
        var mFlag = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_DEL_SECOND_DEVICE_SUCCESS);
        var message = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_DEL_SECOND_DEVICE_ERRORINFO);
        Emitter.fire(this.ttConst.TT_DELETEGETSECONDARYDEVICE_NOTIFICATION_NAME, mFlag, message);
    }
    //停止拨打电话
    onStopCallResponse(PackData) {
        var mFlag = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_SECDEV_LEARN_SUCCESS);
        var message = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_DEL_SECOND_DEVICE_ERRORINFO);
        Emitter.fire(this.ttConst.TT_STOPCALL_NAME, mFlag, message);
    }
    //学习状态回调
    onLearningResponse(PackData){
        var deviceid = this.common.getFieldValue(PackData, this.ttConst.ACK_CLIENT_LEARN_DEVICEID);
        Emitter.fire(this.ttConst.TT_ADDDEVICEGOTOLEARNING_NOTIFICATION_NAME,deviceid);

    }
    //设备报警，收到回复
    onCallThePoliceResponse(PackData){
        var deviceid = this.common.getFieldValue(PackData, this.ttConst.SERVER_SEND_DEVICE_ID);
        var secodedeviceid = this.common.getFieldValue(PackData, this.ttConst.SERVER_SEND_SECOND_DEVICE_ID);
        var deviceidStatu = this.common.getFieldValue(PackData, this.ttConst.SERVER_SEND_DEVICE_STAT);
        var deviceidDefense = this.common.getFieldValue(PackData, this.ttConst.SERVER_SEND_DEVICE_DEFENSE);
        this.common.deviceid = deviceid;
        this.common.secodedeviceid = secodedeviceid;
        this.common.deviceidStatu = deviceidStatu;
        this.common.deviceidDefense = deviceidDefense;
        Emitter.fire(this.ttConst.TT_CLLPHONE_NOTIFICATION_NAME,deviceid,secodedeviceid,deviceidStatu,deviceidDefense);
    }
}