import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { AlarmNumberPage } from '../alarm-number/alarm-number';
import { Common } from '../../lib/Common'
import { TTConst } from '../../lib/TTConst'
import { Tomato } from '../../lib/tomato'
import { Base64 } from 'js-base64';
import { Emitter } from '../../other/emitter'
import { RegistCode }from '../../other/registCode'
import { Storage } from '@ionic/storage'

/**
 * Generated class for the AlarmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-alarm',
	templateUrl: 'alarm.html',
})

export class AlarmPage {
	phoneNumber1 = "未填写";
	phoneNumber2 = "";
	nbsp = " ";
	deviceInfo;
	notifyInterval;//通知间隔
	protectionWay;//布防方式
	alarmPriority;
	foo: boolean;
	//报警优先级 短信 - 电话
	// private _alarmPriority: string;
	// public get alarmPriority() {
	// 	var alr = this._alarmPriority;
	//     return this._alarmPriority;
	// }

	constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public common: Common, public ttConst: TTConst, public tomato: Tomato,public serve: RegistCode,public storage : Storage) {
		this.deviceInfo = navParams.get('deviceInfo')
		let self = this;
		Emitter.register(this.ttConst.TT_HOMEPROTECTION_NOTIFICATION_NAME, self.onAddAlarmResponse, self);
		this.alarmPriority = 'sms';
		this.foo = false;
		this.protectionWay = '撤防';
		this.notifyInterval = 'oneDay';
		this.storage.get('loginname').then((value1) => {	 
			this.phoneNumber1 = value1;
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad AlarmPage');
	}
	//y页面将要离开
	ionViewWillUnload() {
		console.log(this + '界面销毁');
		let self = this;
		Emitter.remove(this.ttConst.TT_HOMEPROTECTION_NOTIFICATION_NAME, self.removeEmitter, self);
	}
	// 用于pop 回调的 block
	callBackFromB = (params) => {
		return new Promise((resolve, reject) => {
			if (params) {
				resolve('成功取到B页面返回的参数');
				this.phoneNumber1 = params[0];
				this.phoneNumber2 = params[1];
				if (this.phoneNumber1 === undefined) {
					this.phoneNumber1 = "";
				}
				if (this.phoneNumber2 === undefined) {
					this.phoneNumber2 = "";
				}
				if (this.phoneNumber1 == "" && this.phoneNumber2 == "") {
					this.phoneNumber1 = "未填写";
				}

			} else {
				reject('取回B页面数据失败')
			}
		});
	}
	goToBPage() {
		this.navCtrl.push(AlarmNumberPage, {
			callback: this.callBackFromB
		})
	}

	//填写多个电话
	chooseNumber() {
		this.navCtrl.push(AlarmNumberPage, {
			callback: this.callBackFromB
		})
	}
	//保存设置信息
	saveSetting() {
		var alarmP;
		if (this.alarmPriority == 'sms') {
			alarmP = "0";
		} else {
			alarmP = "1";
		}

		var interval;
		if (this.notifyInterval == 'tenMinute') {
			interval = '10'
		} else if (this.notifyInterval == 'twentyMinute') {
			interval = '20'
		} else if (this.notifyInterval == 'thirtyMinute') {
			interval = '30'
		} else if (this.notifyInterval == 'oneHour') {
			interval = '60'
		} else if (this.notifyInterval == 'twoHour') {
			interval = '120'
		} else if (this.notifyInterval == 'oneDay') {
			interval = '1440'
		}
		var protectionWay;
		if (this.protectionWay == '撤防') {
			protectionWay = '0'
		} else if (this.notifyInterval == '在家布防') {
			protectionWay = '1'
		} else if (this.notifyInterval == '外出布防') {
			protectionWay = '1'
		} else if (this.notifyInterval == '其他布防') {
			protectionWay = '1'
		} 
		this.common.showLoading("正在保存...");
		var dat = this.common.MakeHeader(this.ttConst.SET_DEVICE) +
			this.common.MakeParam(this.ttConst.SET_DEVICE_DEFENSE, this.deviceInfo.deviceId) +
			this.common.MakeParam(this.ttConst.SET_DEVICE_MODE, alarmP) +
			this.common.MakeParam(this.ttConst.SET_DEVICE_PHONE1, this.phoneNumber1) +
			this.common.MakeParam(this.ttConst.SET_DEVICE_PHONE2, this.phoneNumber2) +
			this.common.MakeParam(this.ttConst.SET_DEVICE_Interval, interval)+
			this.common.MakeParam(this.ttConst.SET_SECOND_DEVICE_DEFENSE, protectionWay);
			this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.deviceInfo.deviceId, dat);

	}
	toggleFun() {
		this.foo = !this.foo;
		var num;
		this.foo ? num = 3 : num = 0;
		var dat = this.common.MakeHeader(this.ttConst.SET_DEVICE) +
			this.common.MakeParam(this.ttConst.SET_DEVICE_DEFENSE, this.deviceInfo.deviceId) +
			this.common.MakeParam(this.ttConst.SET_DEVICE_MODE, num)
		this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.deviceInfo.deviceId, dat);
	}
	//登录成功后的回调
	onAddAlarmResponse(name, flag, msg) {
		this.common.hideLoading();
		this.codeMessage(flag);
		if (flag == '1') {
			this.codeMessage("设置预警成功");
		} else {
			this.codeMessage(msg);
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