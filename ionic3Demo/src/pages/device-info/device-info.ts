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
import { ChildDevicePage } from '../child-device/child-device'
import { RegistCode } from '../../other/registCode'
import { WifiDevicePage } from '../wifi-device/wifi-device';
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
	address;
	isWifi = true;
	deviceList = [];
	deviceImg: string = "./assets/imgs/logo.png"
	listData: Object = [{
		title: "修改设备名",
		index: 0
	}, {
		title: "管理子设备",
		index: 1
	}, {
		title: "设置报警",
		index: 2
	}, {
		title: "历史记录",
		index: 3

	}, {
		title: "修改设备位置",
		index: 4

	}];

	constructor(public serve: RegistCode, public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public common: Common, public ttConst: TTConst, public tomato: Tomato, public alerCtrl: AlertController) {
		this.userInfo = navParams.get('deviceInfo')
		this.deviceList = navParams.get('deviceList')
		let self = this;
		Emitter.register(this.ttConst.TT_REMOVEDEVICE_NOTIFICATION_NAME, self.onRemoveDeviceResponse, self);
		Emitter.register(this.ttConst.TT_CHANGEREMARKE_NOTIFICATION_NAME, self.onChangeRemarkResponse, self);
		Emitter.register(this.ttConst.TT_STOPCALL_NAME, self.onStopCallResponse, self);
		if (this.userInfo.deviceMode=='WIFI') {
			this.isWifi = true;
		}else{
			this.isWifi = false;
		}

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
		Emitter.remove(this.ttConst.TT_STOPCALL_NAME, self.removeEmitter, self);

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
			this.navCtrl.push(ChildDevicePage, {
				deviceInfo: this.userInfo
			});

		} else if (item.index == 2) {
			this.navCtrl.push(AlarmPage, {
				deviceInfo: this.userInfo
			});

		} else if (item.index == 3) {
			this.navCtrl.push(HistoryPage, {
				deviceInfo: this.userInfo
			});
		} else if (item.index == 4) {
			this.changeAddress();
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
						this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, this.serve.getServeId(), dat);
					}
				},
				{
					text: '只删除一级设备',
					handler: () => {
						this.common.showLoading("正在删除...");
						var dat = this.common.MakeHeader(this.ttConst.CLIENT_DEL_FIRST_DEVICE) +
							this.common.MakeParam(this.ttConst.CLIENT_DEL_FIRST_DEVICE_ID, deviceId) +
							this.common.MakeParam(this.ttConst.CLIENT_DEL_SECOND_DEVICE_WHETHER, '0');
						this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, this.serve.getServeId(), dat);
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
				}
			}
			this.navCtrl.pop();
		} else {
			this.codeMessage(msg)
		}

	}
	onChangeRemarkResponse(name, flag, msg) {
		this.common.hideLoading();
		if (flag == '1') {
			this.userInfo.title = this.title;
			this.userInfo.address = this.address;
		} else {
			this.codeMessage(msg)
		}

	}
	//修改备注
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
							this.common.MakeParam(this.ttConst.CLIENT_SET_DEVICE_NAME, data.title);	
							this.address = this.userInfo.address;
						this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, this.serve.getServeId(), dat);
					}
				}
			}
			]
		});
		prompt.present();
	}
	//修改地址
	changeAddress() {
		let prompt = this.alerCtrl.create({
			title: '修改位置',
			inputs: [{
				name: 'title',
				placeholder: '请输入您要修改的位置!'
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
						this.address = data.title;
						this.common.showLoading("正在修改...");
						var dat = this.common.MakeHeader(this.ttConst.CLIENT_SET) +
							this.common.MakeParam(this.ttConst.CLIENT_SET_DEVICE_ID, this.userInfo.deviceId) +
							this.common.MakeParam(this.ttConst.CLIENT_SET_DEVICE_AREA, data.title)		;
						this.title = this.userInfo.title;
						this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, this.serve.getServeId(), dat);
					}
				}
			}
			]
		});
		prompt.present();
	}
	stopCall() {
		this.common.showLoading("正在停止拨打电话");
		var dat = this.common.MakeHeader(this.ttConst.CLIENT_STOP_CALL) +
			this.common.MakeParam(this.ttConst.CLIENT_STOP_CALL_DEVICEID, this.userInfo.deviceId); this.title = this.userInfo.title;
		this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, this.serve.getServeId(), dat);
	}
	onStopCallResponse(name, flag, msg) {
		if (flag == '1') {
			this.codeMessage(msg);
		} else {
			this.codeMessage('停止拨打电话失败');
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
	config(item){
		this.navCtrl.push(WifiDevicePage);
	}
}