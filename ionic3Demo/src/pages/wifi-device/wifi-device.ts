import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { websocket } from '../../lib/websocket'
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { Common } from '../../lib/Common'
/**
 * Generated class for the WifiDevicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wifi-device',
  templateUrl: 'wifi-device.html',
})
export class WifiDevicePage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public websocket: websocket,public toastCtrl : ToastController,public common : Common) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WifiDevicePage');
  }
  send(ssid:HTMLInputElement, pwd:HTMLInputElement) {
    if (ssid.value.length==0) {
      this.codeMessage('请输入WiFi账号');
      return;
    }else if (pwd.value.length==0) {
      this.codeMessage('请输入WiFi密码');
      return;
    }
    this.common.showLoading("正在配置WiFi...");
    this.websocket.connectwebsocket(ssid.value, pwd.value);

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
