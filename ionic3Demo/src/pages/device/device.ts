import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Alert } from 'ionic-angular';
import { DeviceInfoPage } from '../device-info/device-info';
import { AddDevicePage } from '../add-device/add-device';
import { Common } from '../../lib/Common'
import { TTConst } from '../../lib/TTConst'
import { Tomato } from '../../lib/tomato'
import { Base64 } from 'js-base64';
import { Emitter } from '../../other/emitter'
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
/**
 * Generated class for the DevicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-device',
	templateUrl: 'device.html',
})
export class DevicePage {
	showGreeting: Boolean = false;
	listData = [];
	onlineData = [];
	offlineData = [];
	testArray: string[] = ['在线设备', '离线设备'];
	testSegment: string = this.testArray[0];
	device;
	deviceOnline: boolean; //判断设备是否在线。
	constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public common: Common, public ttConst: TTConst, public tomato: Tomato, public alerCtrl: AlertController) {
		let self = this;
		Emitter.register(this.ttConst.TT_GETDEVICELIST_NOTIFICATION_NAME, self.onGetDeviceListResponse, self);
		Emitter.register(this.ttConst.TT_REMOVEDEVICE_NOTIFICATION_NAME, self.onRemoveDeviceResponse, self);
		Emitter.register(this.ttConst.TT_ADDALARM_NOTIFICATION_NAME, self.onAddLanrmingDeviceResponse, self);
		Emitter.register(this.ttConst.TT_MQTTCONNET_NOTIFICATION_NAME, self.mqttOnConnet, self);
		Emitter.register(this.ttConst.TT_DEVICEOFFLINE_NOTIFICATION_NAME, self.onDeviceOffLineResponse, self);
		Emitter.register(this.ttConst.TT_HOMEPROTECTION_NOTIFICATION_NAME, self.onHomeProtectionDeviceResponse, self);

	}
	ionViewDidLoad() {
		console.log('ionViewDidLoad DevicePage');
		if (this.tomato.connected == true) {
			this.getDeviceList();
		}
	}
	ionViewWillEnter() {
		this.showAdddDevieButton();
	}
	//y页面将要离开
	ionViewWillUnload() {
		console.log(this + '界面销毁');
		let self = this;
		Emitter.remove(this.ttConst.TT_GETDEVICELIST_NOTIFICATION_NAME, self.removeEmitter, self);
		Emitter.remove(this.ttConst.TT_REMOVEDEVICE_NOTIFICATION_NAME, self.removeEmitter, self);
		Emitter.remove(this.ttConst.TT_HOMEPROTECTION_NOTIFICATION_NAME, self.removeEmitter, self);
		Emitter.remove(this.ttConst.TT_MQTTCONNET_NOTIFICATION_NAME, self.removeEmitter, self);
		Emitter.remove(this.ttConst.TT_OUTPROTECTION_NOTIFICATION_NAME, self.removeEmitter, self);
		Emitter.remove(this.ttConst.TT_REMOAVAL_NOTIFICATION_NAME, self.removeEmitter, self);
		Emitter.remove(this.ttConst.TT_DEVICEOFFLINE_NOTIFICATION_NAME, self.removeEmitter, self);

	}
	//获取设备列表
	getDeviceList() {
		var dat = this.common.MakeHeader(this.ttConst.CLIENT_GET_FIRST_DEVICE)
		this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, "", dat);
	}

	//搜索添加设备
	addDevice() {
		this.navCtrl.push(AddDevicePage);
		this.showAdddDevieButton();

	}

	//跳转设备详情页面
	deviceInfo(item) {
		this.navCtrl.push(DeviceInfoPage, {
			deviceInfo: item,
			deviceList: this.onlineData
		});
	}

	//删除设备
	removeItem(event, item) {
		this.device = item;
		this.doConfirm(this.device.deviceId);
		event.stopPropagation();
		
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
	//判断是否显示添加设备按钮
	showAdddDevieButton() {
		this.showGreeting = this.onlineData.length == 0 && this.offlineData.length == 0;
	}
	//撤防
	removal(event, item) {
		this.common.showLoading("撤防中...");
		this.deviceOnline = true;
		this.device = item;
		//设备在线
		var dat = this.common.MakeHeader(this.ttConst.SET_DEVICE) +
			this.common.MakeParam(this.ttConst.SET_DEVICE_DEFENSE, "3");
		this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.device.deviceId, dat);
		this.Timeout(item, "0");

	}
	//外出布防
	outProtection(event, item) {
		this.common.showLoading("布防中...");
		this.deviceOnline = true;
		this.device = item;
		//设备在线
		var dat = this.common.MakeHeader(this.ttConst.SET_DEVICE) +
			this.common.MakeParam(this.ttConst.SET_DEVICE_DEFENSE, "2");
		this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.device.deviceId, dat);
		this.Timeout(item, "2");

	}
	//在家布防
	homeProtection(event, item) {
		this.common.showLoading("布防中...");
		this.deviceOnline = true;
		this.device = item;
		//设备在线
		var dat = this.common.MakeHeader(this.ttConst.SET_DEVICE) +
			this.common.MakeParam(this.ttConst.SET_DEVICE_DEFENSE, "1");
		this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.device.deviceId, dat);
		this.Timeout(item, "1");

	}

	//获取设备列表
	onGetDeviceListResponse(name,
		deviceId,
		deviceMode,
		deviceOnline,
		deviceStat,
		deviceName,
		deviceNotifyalarmPhone1,
		deviceNotifyalarmPhone2,
		deviceNotifyalarmMode,
		deviceNotifyalarm,
		deviceNumber) {
		if (deviceStat == '1') {
			deviceStat = '在家布防';
		} else if (deviceStat == '0') {
			deviceStat = '撤防';
		} else if (deviceStat == '2') {
			deviceStat = '室外布防';
		} else {
			deviceStat = '其他布防';
		}
		this.listData.push({
			deviceImg: "./assets/imgs/logo.png",
			electricity: "90%",
			title: deviceName,
			deviceId: deviceId,
			count: deviceNumber,
			protectionState: deviceStat,
			onlineState: deviceOnline,
			onlineStype: deviceOnline
		});
		if (deviceOnline == "Online") {
			this.onlineData.push({
				deviceImg: "./assets/imgs/logo.png",
				electricity: "90%",
				title: deviceName,
				deviceId: deviceId,
				count: deviceNumber,
				protectionState: deviceStat,
				onlineState: deviceOnline,
				onlineStype: deviceOnline
			});
		} else {
			this.offlineData.push({
				deviceImg: "./assets/imgs/logo.png",
				electricity: "90%",
				title: deviceName,
				deviceId: deviceId,
				count: deviceNumber,
				protectionState: deviceStat,
				onlineState: deviceOnline,
				onlineStype: deviceOnline
			});
		}
		this.showAdddDevieButton();

	}

	//分离在线设备和离线设备
	SeparationDevice() {
		for (let index = 0; index < this.listData.length; index++) {
			var element = this.listData[index];
			if (element.onlineState == "Online") {
				this.onlineData.push(element);
			} else {
				this.offlineData.push(element);
			}
		}
	}
	//删除设备成功之后的回调
	onRemoveDeviceResponse(name, flag, msg) {
		this.common.hideLoading();
		if (flag == '1') {
			for (var i = 0; i < this.offlineData.length; i++) {
				if (this.device == this.offlineData[i]) {
					this.offlineData.splice(i, 1);
				}
			}
		} else {
			this.codeMessage(msg)
		}
	}
	//在家布防
	onHomeProtectionDeviceResponse(name, flag, msg) {
		this.common.hideLoading();
		this.deviceOnline = false;
		if (flag == '1') {
			// this.codeMessage(msg)
			// for (let index = 0; index < this.listData.length; index++) {
			// 	var element = this.listData[index];
			// 	if (element.deviceId == this.device.deviceId) {
			// 		this.device.protectionState = "在家布防";
			// 		this.listData.push(this.device);
			// 	}
			// }
			this.getDeviceList();
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
	//mqtt链接成功
	mqttOnConnet() {
		//获取设备列表
		this.getDeviceList();
	}
	removeEmitter(dd) {

	}

	doRefresh(refresher) {
		// this.getDeviceList();
		setTimeout(() => {
			console.log('加载完成后，关闭刷新');
			refresher.complete();
		}, 2000);
	}

	//撤防
	offlineRemoval(event, item) {
		this.common.showLoading("撤防中...");
		this.deviceOnline = true;
		this.device = item;
		
		//设备在线
		var dat = this.common.MakeHeader(this.ttConst.SET_DEVICE) +
			this.common.MakeParam(this.ttConst.SET_DEVICE_DEFENSE, "1");
		this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.device.deviceId, dat);
		this.Timeout(item, "0");
	}
	//外出布防
	offlineOutProtection(event, item) {
		this.common.showLoading("布防中...");
		this.deviceOnline = true;
		this.device = item;
		//设备在线
		var dat = this.common.MakeHeader(this.ttConst.SET_DEVICE) +
			this.common.MakeParam(this.ttConst.SET_DEVICE_DEFENSE, "1");
		this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.device.deviceId, dat);
		this.Timeout(item, "2");
	}
	//在家布防
	offlineHomeProtection(event, item) {
		this.common.showLoading("布防中...");
		this.deviceOnline = true;
		this.device = item;
		
		//设备在线
		var dat = this.common.MakeHeader(this.ttConst.SET_DEVICE) +
			this.common.MakeParam(this.ttConst.SET_DEVICE_DEFENSE, "1");
		this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.device.deviceId, dat);
		this.Timeout(item, "1");
	}

	//定时器设置链接服务器，通知设备
	Timeout(deviceInfo, count) {
		setTimeout(() => { //最长显示10秒
			if (this.deviceOnline) {
				this.device = deviceInfo;
				//设备在线
				var dat = this.common.MakeHeader(this.ttConst.CLIENT_SETNOTIFYALARM) +
					this.common.MakeParam(this.ttConst.CLIENT_SETNOTIFYALARM_DEVICEID, deviceInfo.deviceId) +
					this.common.MakeParam(this.ttConst.CLIENT_SETNOTIFYALARM_DEFENSE, count);
				this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, "", dat);
			}

		}, 10000);
	}
	onAddLanrmingDeviceResponse(name, flag, msg) {
		if (flag == '1') {
			this.codeMessage("设置成功")

		} else {
			this.codeMessage(msg)
		}
	}
	//设备离线的时候预警
	onDeviceOffLineResponse(name, flag, msg) {
		if (flag == '1') {
			this.codeMessage(msg)

		} else {
			this.codeMessage(msg)
		}
		if (this.device.onlineState === 'offLine') {
			return;
		}
		for (let index = 0; index < this.onlineData.length; index++) {
			var element = this.onlineData[index];
			if (element.deviceId == this.device.deviceId) {
				this.onlineData.splice(index, 1);
				this.offlineData.push(element);
			}
		}
	}

}