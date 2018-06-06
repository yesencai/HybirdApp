import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { PersonPage } from '../person/person';
import { ChangePswPage } from '../change-psw/change-psw';
import { ResetPswPage } from '../reset-psw/reset-psw';
import { AboutPage } from '../about/about';
import { DevicePage } from '../device/device';
import { Common } from '../../lib/Common'
import { TTConst } from '../../lib/TTConst'
import { Tomato } from '../../lib/tomato'
import { Base64 } from 'js-base64';
import { Emitter } from '../../other/emitter'

/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-setting',
	templateUrl: 'setting.html',
})

export class SettingPage {


	headimage: string = "./assets/imgs/logo.png";
	name: string = "未填写";
	mobile: string = "未填写";

	constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public alerCtrl: AlertController, public loadingCtrl: LoadingController, public common: Common, public ttConst: TTConst, public tomato: Tomato, public toastCtrl: ToastController) {
		let self = this;
		Emitter.register(this.ttConst.TT_EXIT_NOTIFICATION_NAME, self.onExitResponse, self);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SettingPage');
	}

	//y页面将要离开
	ionViewWillUnload() {
		console.log(this + '界面销毁');
		let self = this;
		Emitter.remove(this.ttConst.TT_EXIT_NOTIFICATION_NAME, self.removeEmitter, self);
	}
	logOut() {
		this.doConfirm();
	}
	seleteItem(index) {
		if (index == 1) {
			this.navCtrl.push(PersonPage, {
				headimage: this.headimage,
				name: this.name,
				mobile: this.mobile

			});
		} else if (index == 2) {
			this.navCtrl.push(ChangePswPage);
		} else if (index == 3) {
			this.navCtrl.push(ResetPswPage);
		} else {
			this.navCtrl.push(AboutPage);
		}
		// else if (index == 4) {
		// 	this.navCtrl.push(DevicePage);
		// } 
	}
	doConfirm() {
		let confirm = this.alerCtrl.create({
			title: '退出登录',
			message: '确定退出登录?',
			buttons: [
				{
					text: '取消',
					handler: () => {
						console.log('Disagree clicked');
					}
				},
				{
					text: '同意',
					handler: () => {
						this.common.showLoading("正在退出登录...");
						var dat = this.common.MakeHeader(this.ttConst.CLIENT_LOGOFF);
						this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, "", dat);
					}
				}
			]
		});
		confirm.present()
	}
	//登录成功后的回调
	onExitResponse(name, flag, msg) {
		this.common.hideLoading();
		if (flag == '1') {
			this.events.publish('toLogin');
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
