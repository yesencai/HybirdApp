import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Common } from '../../lib/Common'
import { TTConst } from '../../lib/TTConst'
import { Tomato } from '../../lib/tomato'
import { Base64 } from 'js-base64';
import { Emitter } from '../../other/emitter'
import { TabsPage } from '../tabs/tabs'
/**
 * Generated class for the NormalDevicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-normal-device',
  templateUrl: 'normal-device.html',
})
export class NormalDevicePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public common: Common, public ttConst: TTConst, public tomato: Tomato) {
    let self = this;
    Emitter.register(this.ttConst.TT_ADDNORMALDEVECE_NOTIFICATION_NAME, self.onAddDeviceResponse, self);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NormalDevicePage');
  }

  //y页面将要离开
  ionViewWillUnload() {
    console.log(this + '界面销毁');
    let self = this;
    Emitter.remove(this.ttConst.TT_ADDNORMALDEVECE_NOTIFICATION_NAME, self.removeEmitter, self);
  }


  //添加普通设备
  addDevice(deviceId, passWord) {
    if (deviceId.value.length == 0) {
      this.codeMessage("请输入设备id!");
    } else if (passWord.value.length == 0) {
      this.codeMessage("请输入设备密码");
    } else {
      this.common.showLoading("登录中...");
      var dat = this.common.MakeHeader(this.ttConst.CLIENT_ADD_FIRST_DEVICE) +
        this.common.MakeParam(this.ttConst.CLIENT_ADD_FIRST_DEVICE_ID, deviceId.value) +
        this.common.MakeParam(this.ttConst.CLIENT_ADD_FIRST_DEVICE_CODE, passWord.value);
      this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, "", dat);
    }
  }

  //绑定设备成功回调
  onAddDeviceResponse(name,flag,msg) {
    this.common.hideLoading();
		if (flag == '1') {
			this.navCtrl.setRoot(TabsPage)
		} else {
			this.codeMessage(msg)
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
  removeEmitter(dd) {

  }
}

