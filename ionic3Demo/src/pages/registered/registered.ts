import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

import {DSTTYPE_SERVER,SdkSendStr} from '../../lib/sdk'
import {zx_sdk_MakeHeader,zx_sdk_MakeParam,zx_sdk_SendStrByParent} from '../../lib/common'

import {Base64} from "js-base64";
import { CLIENT_SMS, CLIENT_SMS_USER, CLIENT_SMS_TYPE } from '../../lib/pack';
/**
 * Generated class for the RegisteredPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-registered',
	templateUrl: 'registered.html',
})
export class RegisteredPage {

	constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {}

	ionViewDidLoad() {
		console.log('ionViewDidLoad RegisteredPage');
	}

	inRegister(username: HTMLInputElement, password: HTMLInputElement, code: HTMLInputElement) {
		if(username.value.length == 0) {
			let toast = this.toastCtrl.create({
				message: "请输入账号!",
				duration: 2000,
				position: "top",
			});
			toast.present();
		} else if(password.value.length == 0) {
			let toast = this.toastCtrl.create({
				message: "请输入密码!",
				duration: 2000,
				position: "top"

			});
			toast.present();
		} else if(code.value.length == 0) {

			let toast = this.toastCtrl.create({
				message: "请输入验证码!",
				duration: 2000,
				position: "top"

			});
			toast.present();

		} else {
			let userinfo: string = '用户名：' + username.value + '密码：' + password.value;
			if(userinfo.length > 0) {

			

				let loading = this.loadingCtrl.create({
					content: "注册中...",
					duration: 2000,

				});
				loading.present(loading);
				setTimeout(() => {
					this.navCtrl.setRoot(TabsPage)
				}, 2000);
			}

		}
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

			//调用获取验证码接口
			var dat = zx_sdk_MakeHeader(CLIENT_SMS) + 
			zx_sdk_MakeParam(CLIENT_SMS_USER, Base64.encode(username.value)) +
			zx_sdk_MakeParam(CLIENT_SMS_TYPE, "1");
			zx_sdk_SendStrByParent(DSTTYPE_SERVER, " ", dat);

			//发送验证码成功后开始倒计时
			this.verifyCode.disable = false;
			this.settime();
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
	//获取验证码后的提示信息，失败或成功
	codeMessage(msg){
		let toast = this.toastCtrl.create({
			message: msg,
			duration: 2000,
			position: "top"
		});
		toast.present();
	}
}