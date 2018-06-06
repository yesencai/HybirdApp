import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Common } from '../../lib/Common'
import { TTConst } from '../../lib/TTConst'
import { Tomato } from '../../lib/tomato'
import { Base64 } from 'js-base64';
import { Emitter } from '../../other/emitter'
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
/**
 * Generated class for the ResetPswPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
	selector: 'page-reset-psw',
	templateUrl: 'reset-psw.html',
})
export class ResetPswPage {

	constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public common: Common, public ttConst: TTConst, public tomato: Tomato,public alerCtrl:AlertController) {
		let self = this;
		Emitter.register(ttConst.TT_RESETPASSWORD_NOTIFICATION_NAME, self.onResetPawResponse, self);

	}
	//y页面将要离开
	ionViewWillUnload() {
		console.log(this + '界面销毁');
		let self = this;
		Emitter.remove(this.ttConst.TT_RESETPASSWORD_NOTIFICATION_NAME, self.removeEmitter, self);
	}
	ionViewDidLoad() {
		console.log('ionViewDidLoad ResetPswPage');
	}

	clickCodebutton(username: HTMLInputElement) {
		if (username.value.length == 0) {

			let toast = this.toastCtrl.create({
				message: "请输入正确的用户名!",
				duration: 2000,
				position: "top"
			});
			toast.present();
		} else {
			//发送验证码成功后开始倒计时

			this.verifyCode.disable = false;
			this.settime();
			//调用获取验证码接口
			var dat = this.common.MakeHeader(this.ttConst.CLIENT_SMS) +
				this.common.MakeParam(this.ttConst.CLIENT_SMS_USER, username.value) +
				this.common.MakeParam(this.ttConst.CLIENT_SMS_TYPE, "2");
			this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, "", dat);
		}
	}
	// 验证码倒计时
	verifyCode: any = {
		verifyCodeTips: "获取验证码",
		countdown: 60,
		disable: true
	}
	// 倒计时
	settime() {
		if (this.verifyCode.countdown == 1) {
			this.verifyCode.countdown = 60;
			this.verifyCode.verifyCodeTips = "获取验证码";
			this.verifyCode.disable = true;
			return;
		} else {
			this.verifyCode.countdown--;
		}

		this.verifyCode.verifyCodeTips = "重新获取(" + this.verifyCode.countdown + ")";
		setTimeout(() => {
			this.verifyCode.verifyCodeTips = "重新获取(" + this.verifyCode.countdown + ")";
			this.settime();
		}, 1000);
	}

	nexted(username: HTMLInputElement, code: HTMLInputElement) {
		if (username.value.length <= 0) {
			let toast = this.toastCtrl.create({
				message: "请输入账号!",
				duration: 2000,
				position: "top"
			});
			toast.present();
		} else if (code.value.length <= 0) {
			let toast = this.toastCtrl.create({
				message: "请输入验证码!",
				duration: 2000,
				position: "top"
			});
			toast.present();
		} else {

			this.common.showLoading("正在重置密码...");
			var dat = this.common.MakeHeader(this.ttConst.CLIENT_UNPASSWORD) +
				this.common.MakeParam(this.ttConst.CLIENT_UNPASSWORD_USERNAME, username.value) +
				this.common.MakeParam(this.ttConst.CLIENT_UNPASSWORD_SMS, code.value);
			this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, "", dat);
		}
	}

	//重置密码成功
	onResetPawResponse(name, flag, msg) {
		this.common.hideLoading();
		if (flag == '1') {
			this.doConfirm();
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
	//删除通知后的回调
	removeEmitter() {

	}
	doConfirm() {
		let confirm = this.alerCtrl.create({
			title: '密码重置成功',
			message: '您的密码已重置为123456，请重新登录!',
			buttons: [
				{
					text: '确定',
					handler: () => {
						this.navCtrl.pop();
					}
				}
			]
		});
		confirm.present()
	}
}