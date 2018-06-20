import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AlarmPage } from '../alarm/alarm';
import { HistoryPage } from '../history/history';
import { Common } from '../../lib/Common'
import { TTConst } from '../../lib/TTConst'
import { Tomato } from '../../lib/tomato'
import { Base64 } from 'js-base64';
import { Emitter } from '../../other/emitter'
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

/**
 * Generated class for the DeviceInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-device-info',
	templateUrl: 'device-info.html',
})
export class DeviceInfoPage {

	userInfo;
	title;
	deviceList = [];
	deviceImg: string = "./assets/imgs/logo.png"
	listData: Object = [{
		title: "修改设备名",
		index: 0
	}, {
		title: "设置报警",
		index: 1
	}, {
		title: "历史记录",
		index: 2

	}];

	constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public common: Common, public ttConst: TTConst, public tomato: Tomato, public alerCtrl: AlertController) {
		this.userInfo = navParams.get('deviceInfo')
		this.deviceList = navParams.get('deviceList')
		let self = this;
		Emitter.register(this.ttConst.TT_REMOVEDEVICE_NOTIFICATION_NAME, self.onRemoveDeviceResponse, self);
		Emitter.register(this.ttConst.TT_CHANGEREMARKE_NOTIFICATION_NAME, self.onChangeRemarkResponse, self);

	}

	ionViewDidLoad() {
		console.log(this.userInfo);
	}
	//y页面将要离开
	ionViewWillUnload() {
		console.log(this + '界面销毁');
		let self = this;
		Emitter.remove(this.ttConst.TT_REMOVEDEVICE_NOTIFICATION_NAME, self.removeEmitter, self);
		Emitter.remove(this.ttConst.TT_CHANGEREMARKE_NOTIFICATION_NAME, self.removeEmitter, self);

	}
	deleteDevice() {
		this.doConfirm(this.userInfo.deviceId);
	}
	clickItem(item) {

	}
	seleteItem(item) {
		if (item.index == 0) {
			this.changeRemark();
		} else if (item.index == 1) {
			this.navCtrl.push(AlarmPage,{
				deviceInfo: this.userInfo
			});

		} else {
			this.navCtrl.push(HistoryPage, {
				deviceInfo: this.userInfo
			});
		}
	}

	doConfirm(deviceId) {
		let confirm = this.alerCtrl.create({
			title: '删除设备',
			message: '是否同时解除关联该设备下的第二级设备?',
			buttons: [
				{
					text: '取消',
					handler: () => {
						console.log('Disagree clicked');
					}
				},
				{
					text: '同时删除二级设备',
					handler: () => {
						this.common.showLoading("正在删除...");
						var dat = this.common.MakeHeader(this.ttConst.CLIENT_DEL_FIRST_DEVICE) +
							this.common.MakeParam(this.ttConst.CLIENT_DEL_FIRST_DEVICE_ID, deviceId) +
							this.common.MakeParam(this.ttConst.CLIENT_DEL_SECOND_DEVICE_WHETHER, '1');
						this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, "", dat);
					}
				},
				{
					text: '只删除一级设备',
					handler: () => {
						this.common.showLoading("正在删除...");
						var dat = this.common.MakeHeader(this.ttConst.CLIENT_DEL_FIRST_DEVICE) +
							this.common.MakeParam(this.ttConst.CLIENT_DEL_FIRST_DEVICE_ID, deviceId) +
							this.common.MakeParam(this.ttConst.CLIENT_DEL_SECOND_DEVICE_WHETHER, '0');
						this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, "", dat);
					}
				}
			]
		});
		confirm.present()
	}
	removeEmitter() {

	}
	//删除设备成功之后的回调
	onRemoveDeviceResponse(name, flag, msg) {
		this.common.hideLoading();
		if (flag == '1') {
			event.stopPropagation();
			for (var i = 0; i < this.deviceList.length; i++) {
				if (this.userInfo == this.deviceList[i]) {
					this.deviceList.splice(i, 1);
					this.navCtrl.pop();
				}
			}
		} else {
			this.codeMessage(msg)
		}

	}
	onChangeRemarkResponse(name, flag, msg) {
		this.common.hideLoading();
		if (flag == '1') {
			this.userInfo.title = this.title;
			
		} else {
			this.codeMessage(msg)
		}

	}
	//添加电话号码
	changeRemark() {
		let prompt = this.alerCtrl.create({
			title: '修改设备名',
			inputs: [{
				name: 'title',
				placeholder: '请输入您要修改的名字!'
			},],
			buttons: [{
				text: '取消',
				handler: data => {
					console.log('Cancel clicked');
				}
			},
			{
				text: '确认',
				handler: data => {
					if (data.title.length > 0) {
						this.title = data.title;
						this.common.showLoading("正在修改...");
						var dat = this.common.MakeHeader(this.ttConst.CLIENT_SET) +
							this.common.MakeParam(this.ttConst.CLIENT_SET_DEVICE_ID, this.userInfo.deviceId) +
							this.common.MakeParam(this.ttConst.CLIENT_SET_DEVICE_NAME, data.title)
						this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, "", dat);
					}
				}
			}
			]
		});
		prompt.present();
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
}