import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,ToastController } from 'ionic-angular';
import { RegisteredPage } from '../registered/registered';
import { TabsPage } from '../tabs/tabs';
import { ResetPswPage } from '../reset-psw/reset-psw';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {

	constructor(public navCtrl: NavController, public navParams: NavParams,public toastCtrl: ToastController, public loadingCtrl: LoadingController) {}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LoginPage');
	}
	//登录
	logIn(username: HTMLInputElement, password: HTMLInputElement) {
		if(username.value.length == 0) {
			let toast = this.toastCtrl.create({
				message: "请输入账号!",
				duration: 2000,
				position:"top",
			});
			toast.present();
		} else if(password.value.length == 0) {
			let toast = this.toastCtrl.create({
				message: "请输入密码!",
				duration: 2000,
				position:"top"

			});
			toast.present();
		} else {
			let userinfo: string = '用户名：' + username.value + '密码：' + password.value;
			if(userinfo.length > 0) {
				let loading = this.loadingCtrl.create({
					content: "登录中...",
					duration: 2000,
				});
				loading.present(loading);
				setTimeout(() => {
					this.navCtrl.setRoot(TabsPage)
				}, 2000);
			}

		}
	}
	//注册
	registered() {
		this.navCtrl.push(RegisteredPage);

	}
	
	resetPassword(){
		this.navCtrl.push(ResetPswPage);
	}

}