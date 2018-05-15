import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import {TabsPage } from '../tabs/tabs';

/**
 * Generated class for the ResetPswPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var variable = "asd";
@IonicPage()
@Component({
	selector: 'page-reset-psw',
	templateUrl: 'reset-psw.html',
})
export class ResetPswPage {

	constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ResetPswPage');
	}
	
		clickCodebutton(username: HTMLInputElement) {
		if(username.value.length == 0) {

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

			let toast = this.toastCtrl.create({
				message: "获取验证码成功!",
				duration: 2000,
				position: "top"
			});
			toast.present();

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
		if(this.verifyCode.countdown == 1) {
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

	nexted(code: HTMLInputElement) {
		if(variable.length <= 0) {
			let toast = this.toastCtrl.create({
				message: "请输入账号!",
				duration: 2000,
				position: "top"
			});
			toast.present();
		} else if(code.value.length <= 0) {
			let toast = this.toastCtrl.create({
				message: "请输入验证码!",
				duration: 2000,
				position: "top"
			});
			toast.present();
		} else {
			let loading = this.loadingCtrl.create({
				content: "正在重置密码...",
				duration: 2000,
			});
			loading.present(loading);
			setTimeout(() => {
				this.navCtrl.setRoot(TabsPage)
			}, 2000);
		}
	}
}