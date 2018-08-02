import { Component, animate } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Common } from '../../lib/Common'
import { TTConst } from '../../lib/TTConst'
import { Tomato } from '../../lib/tomato'
import { Emitter } from '../../other/emitter'
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { RegistCode } from '../../other/registCode'
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { ChildDevicePage } from '../child-device/child-device';

/**
 * Generated class for the EditorChildDevicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editor-child-device',
  templateUrl: 'editor-child-device.html',
})
export class EditorChildDevicePage {

  maxNmber;
  pageIdentifier;
  deviceList = [];
  deviceInfo;
  //设备名
  deviceName;
  deviceId;
  password;
  deciceIdArray = [];
  type;
  showGreeting;
  address;
  serial;
  
  public callback: any;
  constructor(public serve: RegistCode, public navCtrl: NavController, public navParams: NavParams, public alerCtrl: AlertController, public ttConst: TTConst, public common: Common, public tomato: Tomato, public toastCtrl: ToastController) {
    this.pageIdentifier = navParams.get("pageIdentifier");
    this.deviceList = navParams.get("deviceList");
    this.deviceInfo = navParams.get("deviceInfo");
    this.type = navParams.get("type");
    this.callback = this.navParams.get('callback');
    let self = this;
    this.deviceName = this.deviceInfo.alias;
    if (this.deviceInfo.serial == '客厅') {
      this.address = 'room';
    } else if (this.deviceInfo.serial == '厨房') {
      this.address = 'kitchen';
    } else if (this.deviceInfo.serial == '卧室') {
      this.address = 'bedroom';
    } else if (this.deviceInfo.serial == '室外') {
      this.address = 'outdoor';
    }else{
      this.address = 'room';
    }
    Emitter.register(this.ttConst.TT_GETSECONDARYDEVICEID_NOTIFICATION_NAME, self.onGetSecondaryDeviceIdResponse, self);
    Emitter.register(this.ttConst.TT_ADDDEVICEGOTOLEARNING_NOTIFICATION_NAME, self.onGoingLearningStatusResponse, self);
    Emitter.register(this.ttConst.TT_CHANGEREMARKE_NOTIFICATION_NAME, self.onChangeRemarkResponse, self);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditorChildDevicePage');
    // this.deviceName = "报警器";
    // this.deviceId = "123456789";
    // this.deciceIdArray = ["123456789", "12345672389", "1234523454326789", "12345671212589"];
    // this.password = "请输入设备激活码";
    if (this.pageIdentifier == 'add') {
      this.showGreeting = true;
    } else {
      this.showGreeting = false;
    }
    // if (this.type == '0') {
    //   this.showGreeting = false;
    // } else {
    //   this.showGreeting = true;
    // }
    this.gotoLearningState();

    this.maxNmber = 0;

  }
  //y页面将要离开
  ionViewWillUnload() {
    console.log(this + '界面销毁');
    let self = this;
    Emitter.remove(this.ttConst.TT_GETSECONDARYDEVICEID_NOTIFICATION_NAME, self.removeEmitter, self);
    Emitter.remove(this.ttConst.TT_ADDDEVICEGOTOLEARNING_NOTIFICATION_NAME, self.removeEmitter, self);
    Emitter.remove(this.ttConst.TT_CHANGEREMARKE_NOTIFICATION_NAME, self.removeEmitter, self);
  }
  changeDeviceName() {
    this.changeRemark();
  }
  //添加设备名
  changeRemark() {
    let prompt = this.alerCtrl.create({
      title: '修改设备名',
      inputs: [{
        name: 'title',
        placeholder: '请输入您要修改的名字!'
      },],
      buttons: [{
        text: '取消',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: '确认',
        handler: data => {
          if (this.pageIdentifier == 'iditor') {
            if (data.title.length > 0) {
              this.common.showLoading("正在修改...");
              var dat = this.common.MakeHeader(this.ttConst.CLIENT_SET) +
                this.common.MakeParam(this.ttConst.CLIENT_SET_SECOND_DEVICE_ID, this.deviceInfo.deviceId) +
                this.common.MakeParam(this.ttConst.CLIENT_SET_DEVICE_NAME, data.title);
              this.deviceName = data.title;
              this.serial = this.deviceInfo.serial;
              this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, this.serve.getServeId(), dat);
            }
          } else {
            this.deviceName = data.title;
          }
        }
      }
      ]
    });
    prompt.present();
  }
  selectAddress() {
    if (this.pageIdentifier == 'iditor') {
      var address;
      if (this.address == 'room') {
        address = '客厅';
      } else if (this.address == 'kitchen') {
        address = '厨房';
      } else if (this.address == 'bedroom') {
        address = '卧室';
      } else if (this.address == 'outdoor') {
        address = '室外';
      }
      this.common.showLoading("正在修改...");
      var dat = this.common.MakeHeader(this.ttConst.CLIENT_SET) +
        this.common.MakeParam(this.ttConst.CLIENT_SET_SECOND_DEVICE_ID, this.deviceInfo.deviceId) +
        this.common.MakeParam(this.ttConst.CLIENT_SET_DEVICE_AREA, address);
      this.serial = address;
      this.deviceName = this.deviceInfo.alias;
      this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, this.serve.getServeId(), dat);
    }
  }
  getDeviceInfo() {

  }
  removeEmitter() {

  }
  inputPassword() {

    let prompt = this.alerCtrl.create({
      title: '输入设备激活码',
      inputs: [{
        name: 'title',
        placeholder: '请输入设备激活码!'
      },],
      buttons: [{
        text: '取消',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: '确认',
        handler: data => {
          if (data.title.length > 0) {
            this.password = data.title;
          }
        }
      }
      ]
    });
    prompt.present();
  }
  //进入学习状态
  gotoLearningState() {
    var dat = this.common.MakeHeader(this.ttConst.CLIENT_SECDEV_LEARN) +
      this.common.MakeParam(this.ttConst.CLIENT_SECDEV_LEARN_TIME, 60) +
      this.common.MakeParam(this.ttConst.CLIENT_SECDEV_LEARN_CONTROL, this.type);
    this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.deviceInfo.deviceId, dat);
  }
  saveSetting() {
    if (this.pageIdentifier == 'iditor') {
      this.deviceList.forEach(element => {
        if (this.deviceId == element.deviceId) {
          element.alias = this.deviceName;
        }
      });
    } else {
      if (this.deviceName == undefined) {
        this.common.hideLoading();
        this.codeMessage('设备名不能为空');
        return;
      }
      if (this.deviceId == undefined) {
        this.common.hideLoading();
        this.codeMessage('设备id不能为空');
        return;
      }
      var address;
      if (this.address == 'room') {
        address = '客厅';
      } else if (this.address == 'kitchen') {
        address = '厨房';
      } else if (this.address == 'bedroom') {
        address = '卧室';
      } else if (this.address == 'outdoor') {
        address = '室外';
      }
      this.deviceList.push({
        deviceImg: "./assets/imgs/logo.png",
        serial: address,
        deviceId: this.deviceId,
        alias: this.deviceName,
        alarmWay: "Online",
        deviceStatu: "撤防",
        deviceOpenDoor: "开门",
        type: this.type,
        number: this.deviceList.length + 1,
      })
      this.navCtrl.popTo(this.navCtrl.getByIndex(2));
    }
  }
  //获取二级设备id
  onGetSecondaryDeviceIdResponse(name, deviceId) {
    if (deviceId.length > 0) {
      this.deciceIdArray.push(deviceId);
      var dat = this.common.MakeHeader(this.ttConst.ACK_DEVICE_SEND_ID) +
        this.common.MakeParam(this.ttConst.ACK_DEVICE_SEND_ID_SUCCESS, "1")
      this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.deviceInfo.deviceId, dat);
    } else {
      var dat = this.common.MakeHeader(this.ttConst.ACK_DEVICE_SEND_ID) +
        this.common.MakeParam(this.ttConst.ACK_DEVICE_SEND_ID_ERRORINFO, "2");
      this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.deviceInfo.deviceId, dat);
    }
  }
  onChangeRemarkResponse(name, flag, msg) {
    this.common.hideLoading();
    if (flag == '1') {
      this.deviceInfo.alias = this.deviceName;
      this.deviceInfo.serial = this.serial;
      this.callback(this.deviceInfo).then(() => {
        this.navCtrl.pop()
      });
    } else {
      this.codeMessage(msg)
    }

  }
  //进入学习状态的回调
  onGoingLearningStatusResponse(name, flag, msg) {
    if (flag == '1') {
      this.codeMessage(msg);
    } else {
      this.codeMessage(msg);
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
