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
	clickCodebutton(username) {
		variable = username;
		if(username.value.length > 0) {
			let toast = this.toastCtrl.create({
				message: "获取验证码成功!",
				duration: 2000,
				position: "top"
			});
			toast.present();
		} else {
			let toast = this.toastCtrl.create({
				message: "请输入账号!",
				duration: 2000,
				position: "top"
			});
			toast.present();
		}
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