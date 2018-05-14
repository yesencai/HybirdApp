import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,ToastController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

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
	getCode() {
		let toast = this.toastCtrl.create({
		message: "获取验证码成功!",
		duration: 2000,
		position:"top"
			});
			toast.present();
	}
	inRegister(username: HTMLInputElement, password: HTMLInputElement,code:HTMLInputElement) {
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
		} else if(code.value.length == 0){
			
			let toast = this.toastCtrl.create({
				message: "请输入验证码!",
				duration: 2000,
				position:"top"

			});
			toast.present();
		
		}else{
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
	clickCodebutton(username:HTMLInputElement) {
	if(username.value.length==0){

				let toast = this.toastCtrl.create({
				message: "请输入正确的用户名!",
				duration: 2000,
				position:"top"
			});
			toast.present();
			}else{
			
			let toast = this.toastCtrl.create({
				message: "获取验证码成功",
				duration: 2000,
				position:"top"

			});
			toast.present();
		
		}
	}

}