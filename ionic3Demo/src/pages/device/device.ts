import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Alert } from 'ionic-angular';
import { DeviceInfoPage } from '../device-info/device-info';
import { NormalDevicePage } from '../normal-device/normal-device';
import { Common } from '../../lib/Common'
import { TTConst } from '../../lib/TTConst'
import { Tomato } from '../../lib/tomato'
import { Base64 } from 'js-base64';
import { Emitter } from '../../other/emitter'
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { RegistCode } from '../../other/registCode'
import { PopoverController } from 'ionic-angular/components/popover/popover-controller';
import { PopoverPage } from '../popover/popover'
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
	@ViewChild('popoverContent', { read: ElementRef }) content: ElementRef;
	@ViewChild('popoverText', { read: ElementRef }) text: ElementRef;
	showGreeting: Boolean = false;
	listData = [];
	onlineData = [];
	offlineData = [];
	testArray: string[] = ['在线设备', '离线设备'];
	testSegment: string = this.testArray[0];
	device;
	deviceOnline: boolean; //判断设备是否在线。
	applicationInterval: any;
	deviceStatu: any
	constructor(public serve: RegistCode, public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public common: Common, public ttConst: TTConst, public tomato: Tomato, public alerCtrl: AlertController, public popoverCtrl: PopoverController) {
		
	}
	ionViewDidLoad() {

		console.log('ionViewDidLoad DevicePage');
		if (this.tomato.connected == true) {
			this.getDeviceList();
		}
	}
	ionViewWillEnter() {
		let self = this;
		Emitter.register(this.ttConst.TT_GETDEVICELIST_NOTIFICATION_NAME, self.onGetDeviceListResponse, self);
		Emitter.register(this.ttConst.TT_REMOVEDEVICE_NOTIFICATION_NAME, self.onRemoveDeviceResponse, self);
		Emitter.register(this.ttConst.TT_ADDALARM_NOTIFICATION_NAME, self.onAddLanrmingDeviceResponse, self);
		Emitter.register(this.ttConst.TT_MQTTCONNET_NOTIFICATION_NAME, self.mqttOnConnet, self);
		Emitter.register(this.ttConst.TT_DEVICEOFFLINE_NOTIFICATION_NAME, self.onDeviceOffLineResponse, self);
		Emitter.register(this.ttConst.TT_HOMEPROTECTION_NOTIFICATION_NAME, self.onHomeProtectionDeviceResponse, self);
		Emitter.register(this.ttConst.TT_AddDeviceNotification, self.addDeviceNotifa, self);
		Emitter.register(this.ttConst.TT_CancelPoliceNotification, self.cancelPoliceNotifa, self);
		this.showAdddDevieButton();
	}
	//y页面将要离开
	ionViewWillLeave() {
		console.log(this + '界面销毁');
		let self = this;
		Emitter.remove(this.ttConst.TT_GETDEVICELIST_NOTIFICATION_NAME, self.removeEmitter, self);
		Emitter.remove(this.ttConst.TT_REMOVEDEVICE_NOTIFICATION_NAME, self.removeEmitter, self);
		Emitter.remove(this.ttConst.TT_HOMEPROTECTION_NOTIFICATION_NAME, self.removeEmitter, self);
		Emitter.remove(this.ttConst.TT_MQTTCONNET_NOTIFICATION_NAME, self.removeEmitter, self);
		Emitter.remove(this.ttConst.TT_ADDALARM_NOTIFICATION_NAME, self.removeEmitter, self);
		Emitter.remove(this.ttConst.TT_DEVICEOFFLINE_NOTIFICATION_NAME, self.removeEmitter, self);
		Emitter.remove(this.ttConst.TT_AddDeviceNotification, self.removeEmitter, self);
		Emitter.remove(this.ttConst.TT_CancelPoliceNotification, self.removeEmitter, self);

	}
	//获取设备列表
	getDeviceList() {
		var dat = this.common.MakeHeader(this.ttConst.CLIENT_GET_FIRST_DEVICE)
		this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, this.serve.getServeId(), dat);
	}

	//搜索添加设备
	addDevice() {
		this.navCtrl.push(NormalDevicePage);
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
			this.common.MakeParam(this.ttConst.SET_DEVICE_DEFENSE, "0");
		this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.device.deviceId, dat);
		this.Timeout(item, "0");
		this.deviceStatu = "撤防";

	}
	//外出布防
	outProtection(event, item) {
		this.common.showLoading("布防中...");
		this.deviceOnline = true;
		this.device = item;
		// var dat = this.common.MakeHeader(this.ttConst.SET_DEVICE) +
		// 	this.common.MakeParam(this.ttConst.SET_DEVICE_DEFENSE, "3");
		// this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.device.deviceId, dat);
		//设备在线
		var dat = this.common.MakeHeader(this.ttConst.SET_DEVICE) +
			this.common.MakeParam(this.ttConst.SET_DEVICE_DEFENSE, "2");
		this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.device.deviceId, dat);
		this.Timeout(item, "2");
		this.deviceStatu = "外出布防";


	}
	//在家布防
	homeProtection(event, item) {
		this.common.showLoading("布防中...");
		this.deviceOnline = true;
		this.device = item;
		// var dat = this.common.MakeHeader(this.ttConst.SET_DEVICE) +
		// 	this.common.MakeParam(this.ttConst.SET_DEVICE_DEFENSE, "3");
		// this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.device.deviceId, dat);
		//设备在线
		var dat = this.common.MakeHeader(this.ttConst.SET_DEVICE) +
			this.common.MakeParam(this.ttConst.SET_DEVICE_DEFENSE, "1");
		this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.device.deviceId, dat);
		this.Timeout(item, "1");
		this.deviceStatu = "在家布防";

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
		deviceNumber, deviceAddress, deviceAlarmStat) {
		if (deviceStat == '1') {
			deviceStat = '在家布防';
		} else if (deviceStat == '0') {
			deviceStat = '撤防';
		} else if (deviceStat == '2') {
			deviceStat = '室外布防';
		} else {
			deviceStat = '紧急报警';
		}
		this.listData.push({
			deviceImg: "./assets/imgs/logo.png",
			electricity: "90%",
			deviceMode:deviceMode,
			title: deviceName,
			deviceId: deviceId,
			count: deviceNumber,
			protectionState: deviceStat,
			onlineState: deviceOnline,
			onlineStype: deviceOnline,
			address: deviceAddress,
			deviceAlarmStat: deviceAlarmStat
		});
		var a;
		var b;
		for (a = 0; a < this.onlineData.length; a++) {
			for (x = b + 1; b < this.onlineData.length; b++) {
				if (this.listData[a].deviceId == this.listData[b].deviceId) {
					this.listData.splice(b, 1)
				}
			}
		}
		if (deviceOnline == "Online") {
			this.onlineData.push({
				deviceImg: "./assets/imgs/logo.png",
				electricity: "90%",
				title: deviceName,
				deviceId: deviceId,
				deviceMode:deviceMode,
				count: deviceNumber,
				protectionState: deviceStat,
				onlineState: deviceOnline,
				onlineStype: deviceOnline,
				address: deviceAddress,
				deviceAlarmStat: deviceAlarmStat
			});
			var i;
			var x;
			for (i = 0; i < this.onlineData.length; i++) {
				for (x = i + 1; x < this.onlineData.length; x++) {
					if (this.onlineData[i].deviceId == this.onlineData[x].deviceId) {
						this.onlineData.splice(x, 1)
					}
				}
			}
		} else {
			this.offlineData.push({
				deviceImg: "./assets/imgs/logo.png",
				electricity: "90%",
				title: deviceName,
				deviceId: deviceId,
				count: deviceNumber,
				deviceMode:deviceMode,
				protectionState: deviceStat,
				onlineState: deviceOnline,
				onlineStype: deviceOnline,
				address: deviceAddress,
				deviceAlarmStat: deviceAlarmStat
			});
			var i;
			var x;
			for (i = 0; i < this.offlineData.length; i++) {
				for (x = i + 1; x < this.offlineData.length; x++) {
					if (this.offlineData[i].deviceId == this.offlineData[x].deviceId) {
						this.offlineData.splice(x, 1)
					}
				}
			}

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
	//设置布防回调
	onHomeProtectionDeviceResponse(name, flag, msg) {
		this.common.hideLoading();
		this.deviceOnline = false;
		//停止定时器
		clearInterval(this.applicationInterval);
		if (flag == '1') {
			this.codeMessage(msg)
			for (let index = 0; index < this.listData.length; index++) {
				var element = this.listData[index];
				if (element.deviceId == this.device.deviceId) {
					this.device.protectionState = this.deviceStatu;
					// this.listData.push(this.device);
				}
			}
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
			this.common.MakeParam(this.ttConst.SET_DEVICE_DEFENSE, "0");
		this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.device.deviceId, dat);
		this.Timeout(item, "0");
	}
	//外出布防
	offlineOutProtection(event, item) {
		this.common.showLoading("布防中...");
		this.deviceOnline = true;
		this.device = item;
		// var dat = this.common.MakeHeader(this.ttConst.SET_DEVICE) +
		// 	this.common.MakeParam(this.ttConst.SET_DEVICE_DEFENSE, "0");
		// this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.device.deviceId, dat);
		//设备在线
		var dat = this.common.MakeHeader(this.ttConst.SET_DEVICE) +
			this.common.MakeParam(this.ttConst.SET_DEVICE_DEFENSE, "2");
		this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.device.deviceId, dat);
		this.Timeout(item, "2");
	}
	//在家布防
	offlineHomeProtection(event, item) {
		this.common.showLoading("布防中...");
		this.deviceOnline = true;
		this.device = item;
		// var dat = this.common.MakeHeader(this.ttConst.SET_DEVICE) +
		// 	this.common.MakeParam(this.ttConst.SET_DEVICE_DEFENSE, "3");
		// this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.device.deviceId, dat);
		//设备在线
		var dat = this.common.MakeHeader(this.ttConst.SET_DEVICE) +
			this.common.MakeParam(this.ttConst.SET_DEVICE_DEFENSE, "1");
		this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.device.deviceId, dat);
		this.Timeout(item, "1");
	}

	//定时器设置链接服务器，通知设备
	Timeout(deviceInfo, count) {
		this.applicationInterval = setInterval(() => {
			this.device = deviceInfo;
			//设备不在线
			var dat = this.common.MakeHeader(this.ttConst.CLIENT_SETNOTIFYALARM) +
				this.common.MakeParam(this.ttConst.CLIENT_SETNOTIFYALARM_DEVICEID, deviceInfo.deviceId) +
				this.common.MakeParam(this.ttConst.CLIENT_SETNOTIFYALARM_DEFENSE, count);
			this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, this.serve.getServeId(), dat);
			clearInterval(this.applicationInterval);
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

	presentPopover(ev) {
		let popover = this.popoverCtrl.create(PopoverPage, {
			contentEle: "this.content.nativeElement",
			textEle: "this.text.nativeElement"
		});

		popover.present({
			ev: ev
		});
	}
	addDeviceNotifa(name) {
		this.addDevice();
	}

	cancelPoliceNotifa(name) {
		if (this.common.deviceid == undefined) {
			this.codeMessage('没有设备报警');
			return;
		}
		//设备在线
		var dat = this.common.MakeHeader(this.ttConst.SET_DEVICE) +
			this.common.MakeParam(this.ttConst.SET_DEVICE_DEFENSE, "10");
			this.common.SendStrByParent(this.tomato.DSTTYPE_DEVCLI, this.common.deviceid, dat);
	}
}
