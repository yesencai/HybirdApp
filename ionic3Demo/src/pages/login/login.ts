
import { Component ,ViewChild} from '@angular/core';
import { IonicPage, Tabs,NavController, Platform,NavParams, LoadingController, ToastController } from 'ionic-angular';
import { RegisteredPage } from '../registered/registered';
import { TabsPage } from '../tabs/tabs';
import { ResetPswPage } from '../reset-psw/reset-psw';
import { Common } from '../../lib/Common'
import { TTConst } from '../../lib/TTConst'
import { Tomato } from '../../lib/tomato'
import { Base64 } from 'js-base64';
import { Emitter } from '../../other/emitter'
import { BackButtonProvider } from '../../other/back-button-provider'
@IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {

	@ViewChild('myTabs') tabRef: Tabs;

	constructor(public navCtrl: NavController, public navParams: NavParams, private backButtonService: BackButtonProvider,
		private platform: Platform,public toastCtrl: ToastController, public loadingCtrl: LoadingController, public common: Common, public ttConst: TTConst, public tomato: Tomato) {
		let self = this;
		Emitter.register(this.ttConst.TT_LOGIN_NOTIFICATION_NAME, self.onLoginResponse, self);
		this.platform.ready().then(() => {
			this.backButtonService.registerBackButtonAction(this.tabRef);
		  });
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LoginPage');
	}
	//y页面将要离开
	ionViewWillUnload() {
		console.log(this + '界面销毁');
		let self = this;
		Emitter.remove(this.ttConst.TT_LOGIN_NOTIFICATION_NAME, self.removeEmitter, self);
	}
	logIn(username: HTMLInputElement, password: HTMLInputElement) {
		if (username.value.length == 0) {
			let toast = this.toastCtrl.create({
				message: "请输入账号!",
				duration: 2000,
				position: "top",
			});
			toast.present();
		} else if (password.value.length == 0) {
			let toast = this.toastCtrl.create({
				message: "请输入密码!",
				duration: 2000,
				position: "top"

			});
			toast.present();
		} else {
			let userinfo: string = '用户名：' + username.value + '密码：' + password.value;
			if (userinfo.length > 0) {

				this.common.showLoading("登录中...");
				var dat = this.common.MakeHeader(this.ttConst.CLIENT_LOGIN) +
					this.common.MakeParam(this.ttConst.CLIENT_LOGIN_USERNAME, username.value) +
					this.common.MakeParam(this.ttConst.CLIENT_LOGIN_PASSWORD, password.value);
				this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, "", dat);
			}

		}
	}

	//注册
	registered() {
		this.navCtrl.push(RegisteredPage);

	}

	resetPassword() {
		this.navCtrl.push(ResetPswPage);
	}

	//登录成功后的回调
	onLoginResponse(name, flag, msg) {
		this.common.hideLoading();
		if (flag == '1') {
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
	removeEmitter(dd){

	}


}