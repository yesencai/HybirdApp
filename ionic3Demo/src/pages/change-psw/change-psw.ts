import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController } from 'ionic-angular';
import {TabsPage } from '../tabs/tabs';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl : LoadingController,public toastCtrl :ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePswPage');
  }
  changePassword(oldpassword : HTMLInputElement,newpassword : HTMLInputElement){
  		if(oldpassword.value.length<=0){
  			let toast = this.toastCtrl.create({
				message: "请输入旧密码!",
				duration: 2000,
				position:"top"

			});
			toast.present();
  		}else if(newpassword.value.length<=0){
  			let toast = this.toastCtrl.create({
				message: "请输入新密码!",
				duration: 2000,
				position:"top"
			});
			toast.present();
  		}else{
  			let loading = this.loadingCtrl.create({
					content: "修改密码中...",
					duration: 2000,
				});
				loading.present(loading);
				setTimeout(() => {
					this.navCtrl.setRoot(TabsPage)
				}, 2000);
  		}
  }

}
