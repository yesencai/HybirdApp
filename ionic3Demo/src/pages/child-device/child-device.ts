import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EditorChildDevicePage } from '../editor-child-device/editor-child-device'
import { Common } from '../../lib/Common'
import { TTConst } from '../../lib/TTConst'
import { Tomato } from '../../lib/tomato'
import { Emitter } from '../../other/emitter'
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { ChooseDevicePage } from '../choose-device/choose-device'
import { RegistCode } from '../../other/registCode'
import { SencondDeviceInfoPage } from '../../pages/sencond-device-info/sencond-device-info'
/**
 * Generated class for the ChildDevicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-child-device',
  templateUrl: 'child-device.html',
})
export class ChildDevicePage {

  deviceList = [];
  shouldShowDelete;
  title;
  idtor;
  deviceInfo;
  deviceId;
  i = 0;
  deviceStatu: any
  constructor(public serve: RegistCode, public navCtrl: NavController, public navParams: NavParams, public ttConst: TTConst, public common: Common, public tomato: Tomato, public toastCtrl: ToastController) {
    this.deviceInfo = navParams.get('deviceInfo')
    this.title = '保存';
    this.idtor = false;
    let self = this;
    this.deviceStatu = this.deviceInfo.deviceStatu;
    Emitter.register(this.ttConst.TT_SECONDARYDEVICELIST_NOTIFICATION_NAME, self.onSecondaryDeviceListResponse, self);
    Emitter.register(this.ttConst.TT_DELETEGETSECONDARYDEVICE_NOTIFICATION_NAME, self.onDeleteSecondaryDeviceListResponse, self);
    Emitter.register(this.ttConst.TT_ADDGETSECONDARYDEVICE_NOTIFICATION_NAME, self.onAddSecondaryDeviceResponse, self);
    Emitter.register(this.ttConst.TT_HOMEPROTECTION_NOTIFICATION_NAME, self.onHomeProtectionDeviceResponse, self);

  }

  //y页面将要离开
  ionViewWillUnload() {
    console.log(this + '界面销毁');
    let self = this;
    Emitter.remove(this.ttConst.TT_SECONDARYDEVICELIST_NOTIFICATION_NAME, self.removeEmitter, self);
    Emitter.remove(this.ttConst.TT_DELETEGETSECONDARYDEVICE_NOTIFICATION_NAME, self.removeEmitter, self);
    Emitter.remove(this.ttConst.TT_ADDGETSECONDARYDEVICE_NOTIFICATION_NAME, self.removeEmitter, self);
    Emitter.remove(this.ttConst.TT_SECODEDEVICEREMOAVAL_NOTIFICATION_NAME, self.removeEmitter, self);
    Emitter.remove(this.ttConst.TT_HOMEPROTECTION_NOTIFICATION_NAME, self.removeEmitter, self);

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ChildDevicePage');
    this.getDeviceList();
    this.gotoLearningState();
  }
  //进入学习状态
  gotoLearningState() {
    var dat = this.common.MakeHeader(this.ttConst.CLIENT_SECDEV_LEARN) +
      this.common.MakeParam(this.ttConst.CLIENT_SECDEV_LEARN_TIME, 60);
    this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.deviceInfo.deviceId, dat);
  }
  //保存设置
  saveSetting() {

    if (this.deviceList.length == 0) {
      this.codeMessage('尚未绑定设备');
      return;
    }
    this.common.showLoading('正在保存设置');
    console.log(this.deviceList);
    this.deviceList.forEach(element => {
      var dat = this.common.MakeHeader(this.ttConst.CLIENT_ADD_SECOND_DEVICE) +
        this.common.MakeParam(this.ttConst.CLIENT_ADD_DEVICE_TOTAL, this.deviceList.length) +
        this.common.MakeParam(this.ttConst.CLIENT_ADD_DEVICE_NUM, element.number) +
        this.common.MakeParam(this.ttConst.CLIENT_ADD_DEVICE_ID, this.deviceInfo.deviceId) +
        this.common.MakeParam(this.ttConst.CLIENT_ADD_SECOND_DEVICE_ID, element.deviceId) +
        this.common.MakeParam(this.ttConst.CLIENT_ADD_SECOND_DEVICE_TYPE, element.type.replace(/\s+/g, "")) +
        this.common.MakeParam(this.ttConst.CLIENT_ADD_SECOND_DEVICE_NAME, element.alias) +
        this.common.MakeParam(this.ttConst.CLIENT_ADD_SECOND_DEVICE_ADDR, element.serial);
      this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.deviceInfo.deviceId, dat);
    });
  }
  /**
 * 回调函数
 */
  getData = (data) => {
    return new Promise((resolve, reject) => {
      this.deviceList.forEach(element => {
        if (element.deviceId == data.deviceId) {
          element.alias = data.alias;
          element.serial = data.serial
        }
      });
      resolve();
    });
  };
  editor(event, item) {
    this.idtor = true;
    this.navCtrl.push(EditorChildDevicePage, {
      pageIdentifier: "iditor",
      deviceList: this.deviceList,
      deviceInfo: item,
      callback: this.getData
    });

  }
  childdeviceInfo(item) {
    this.navCtrl.push(SencondDeviceInfoPage,{
      deviceInfo: item,
			deviceList: this.deviceList
    })
  }
  delete(event, item) {
    this.deviceId = item.deviceId;
    this.common.showLoading('正在删除设备');
    var dat = this.common.MakeHeader(this.ttConst.CLIENT_DEL_SECOND_DEVICE) +
      this.common.MakeParam(this.ttConst.CLIENT_DEL_SECOND_DEVICE_ID, item.deviceId)
    this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, this.serve.getServeId(), dat);
  }
  addDevice() {
    this.navCtrl.push(ChooseDevicePage, {
      pageIdentifier: "add",
      deviceList: this.deviceList,
      deviceInfo: this.deviceInfo,
    });
  }

  //获取二级设备列表
  getDeviceList() {
    var dat = this.common.MakeHeader(this.ttConst.CLIENT_GET_SECOND_DEVICE) +
      this.common.MakeParam(this.ttConst.CLIENT_GET_FIRST_DEVICE_ID, this.deviceInfo.deviceId)
    this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, this.serve.getServeId(), dat);
  }

  onSecondaryDeviceListResponse(name,
    deviceId,
    deviceOnline,
    deviceName,
    deviceAddress,
    deviceStatu, deviceOpenDoor, deviceType) {
    if (deviceStatu == '0') {
      deviceStatu = '撤防';
    } else {
      deviceStatu = '布防';
    }
    this.deviceList.push({
      deviceImg: "./assets/imgs/logo.png",
      serial: deviceAddress,
      deviceId: deviceId,
      alias: deviceName,
      alarmWay: deviceOnline,
      deviceStatu: deviceStatu,
      deviceOpenDoor: deviceOpenDoor,
      type: deviceType.replace(/\s+/g, ""),
      number: this.deviceList.length + 1,
    }, )
    var i;
    var x;
    for (i = 0; i < this.deviceList.length; i++) {
      for (x = i + 1; x < this.deviceList.length; x++) {
        if (this.deviceList[i].deviceId == this.deviceList[x].deviceId) {
          this.deviceList.splice(x, 1)
        }
      }
    }
  }
  onDeleteSecondaryDeviceListResponse(name, flag, msg) {
    this.common.hideLoading();
    if (flag == '1') {
      this.codeMessage('删除设备成功');
      for (let i = 0; i < this.deviceList.length; i++) {
        let element = this.deviceList[i];
        if (element.deviceId === this.deviceId) {
          this.deviceList.splice(i, 1);
        }
      }
    } else {
      this.codeMessage(msg);
    }
  }
  //添加二级设备回调
  onAddSecondaryDeviceResponse(name, flag, msg, number) {
    this.common.hideLoading();
    if (flag == '1') {
      this.codeMessage("保存二级设备成功" + number);
      this.deviceList.forEach(element => {
        if (number == element.number) {
          var dat = this.common.MakeHeader(this.ttConst.CLIENT_ADD_SECOND_DEVICE) +
            this.common.MakeParam(this.ttConst.CLIENT_ADD_DEVICE_TOTAL, this.deviceList.length) +
            this.common.MakeParam(this.ttConst.CLIENT_ADD_DEVICE_NUM, element.number) +
            this.common.MakeParam(this.ttConst.CLIENT_ADD_DEVICE_ID, this.deviceInfo.deviceId) +
            this.common.MakeParam(this.ttConst.CLIENT_ADD_SECOND_DEVICE_ID, element.deviceId) +
            this.common.MakeParam(this.ttConst.CLIENT_ADD_SECOND_DEVICE_TYPE, element.type) +
            this.common.MakeParam(this.ttConst.CLIENT_ADD_SECOND_DEVICE_NAME, element.alias) +
            this.common.MakeParam(this.ttConst.CLIENT_ADD_SECOND_DEVICE_ADDR, element.serial);
          this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, this.serve.getServeId(), dat);
        }
      });
    } else {
      this.codeMessage(msg);

    }
  }

  //撤防
  removal(event, item) {
    this.deviceId = item.deviceId;
    this.deviceStatu = '撤防';
    //设备在线
    var dat = this.common.MakeHeader(this.ttConst.SET_DEVICE) +
      this.common.MakeParam(this.ttConst.SET_SECOND_DEVICE_ID, item.deviceId) +
      this.common.MakeParam(this.ttConst.SET_SECOND_DEVICE_DEFENSE, "0");
    this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.deviceInfo.deviceId, dat);
  }
  //布防
  protection(event, item) {
    this.deviceId = item.deviceId;
    this.deviceStatu = '布防';
    //设备在线
    var dat = this.common.MakeHeader(this.ttConst.SET_DEVICE) +
      this.common.MakeParam(this.ttConst.SET_SECOND_DEVICE_ID, item.deviceId) +
      this.common.MakeParam(this.ttConst.SET_SECOND_DEVICE_DEFENSE, "1");
    this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.deviceInfo.deviceId, dat);
  }
  removeEmitter() {

  }
  //设置布防回调
  onHomeProtectionDeviceResponse(name, flag, msg) {
    if (flag == '1') {
      this.deviceList.forEach(element => {
        if (element.deviceId == this.deviceId) {
          element.deviceStatu = this.deviceStatu;
        }
      });
    }

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
