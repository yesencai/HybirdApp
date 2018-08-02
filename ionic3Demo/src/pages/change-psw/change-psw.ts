import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Common } from '../../lib/Common'
import { TTConst } from '../../lib/TTConst'
import { Tomato } from '../../lib/tomato'
import { Base64 } from 'js-base64';
import { Emitter } from '../../other/emitter'
import { Storage } from '@ionic/storage'
import { RegistCode } from '../../other/registCode'

/**
 * Generated class for the ChangePswPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-change-psw',
	templateUrl: 'change-psw.html',
})
export class ChangePswPage {

	passWord;
	constructor(public serve : RegistCode, public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public common: Common, public ttConst: TTConst, public tomato: Tomato,public storage : Storage) {
		var self = this;
		Emitter.register(this.ttConst.TT_CHAGEPASSWORD_NOTIFICATION_NAME, self.onChangePaswgeResponse, self);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ChangePswPage');
	}
	//y页面将要离开
	ionViewWillUnload() {
		console.log(this + '界面销毁');
		let self = this;
		Emitter.remove(this.ttConst.TT_CHAGEPASSWORD_NOTIFICATION_NAME, self.removeEmitter, self);
	}
	changePassword(oldpassword: HTMLInputElement, newpassword: HTMLInputElement) {
		if (oldpassword.value.length <= 0) {
			let toast = this.toastCtrl.create({
				message: "请输入旧密码!",
				duration: 2000,
				position: "top"

			});
			toast.present();
		} else if (newpassword.value.length <= 0) {
			let toast = this.toastCtrl.create({
				message: "请输入新密码!",
				duration: 2000,
				position: "top"
			});
			toast.present();
		} else {
			this.passWord = newpassword;
			this.common.showLoading("登录中...");
			var dat = this.common.MakeHeader(this.ttConst.CLIENT_UPDATEPWD) +
				this.common.MakeParam(this.ttConst.CLIENT_UPDATEPWD_OLD, oldpassword.value) +
				this.common.MakeParam(this.ttConst.CLIENT_UPDATEPWD_NEW, newpassword.value);
			this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, this.serve.getServeId(), dat);
		}
	}
	onChangePaswgeResponse(name, flag, msg) {
		this.common.hideLoading();
		if (flag == '1') {
			this.storage.set("password", this.passWord);
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

	removeEmitter() {

	}
}
