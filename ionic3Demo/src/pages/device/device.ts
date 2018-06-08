import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Alert } from 'ionic-angular';
import { DeviceInfoPage } from '../device-info/device-info';
import { AddDevicePage } from '../add-device/add-device';
import { Common } from '../../lib/Common'
import { TTConst } from '../../lib/TTConst'
import { Tomato } from '../../lib/tomato'
import { Base64 } from 'js-base64';
import { Emitter } from '../../other/emitter'
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
	testArray: string[] = ['在线设备', '离线设备'];
	testSegment: string = this.testArray[0];
	constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public common: Common, public ttConst: TTConst, public tomato: Tomato) {
		let self = this;
		Emitter.register(this.ttConst.TT_GETDEVICELIST_NOTIFICATION_NAME, self.onGetDeviceListResponse, self);
	}
	ionViewDidLoad() {
		console.log('ionViewDidLoad DevicePage');
		//获取设备列表
		this.getDeviceList();
		this.showAdddDevieButton();

	}
	//y页面将要离开
	ionViewWillUnload() {
		console.log(this + '界面销毁');
		let self = this;
		Emitter.remove(this.ttConst.TT_GETDEVICELIST_NOTIFICATION_NAME, self.removeEmitter, self);
	}
	//获取设备列表
	getDeviceList() {
		this.common.showLoading("正在获取设备列表...");
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
			deviceInfo: item
		});
	}

	//删除设备
	removeItem(event, item) {
		event.stopPropagation();
		for (var i = 0; i < this.listData.length; i++) {
			if (item == this.listData[i]) {
				this.listData.splice(i, 1);
			}
		}
		this.showAdddDevieButton();
	}
	//判断是否显示添加设备按钮
	showAdddDevieButton() {
		this.showGreeting = this.listData.length == 0
	}
	//撤防
	removal(item) {
		alert("removal");
		// item.protectionState = !item.protectionState;
	}
	//外出布防
	outProtection(item) {
		alert("outProtection");

	}
	//在家布防
	homeProtection(item) {
		alert("home");

	}

	//下来刷新界面
	doRefresh(refresher) {
		refresher.complete();
		setTimeout(() => {
			console.log('加载完成后，关闭刷新');
			refresher.complete();

			//toast提示
		}, 5000);
	}

	//下拉加载数据
	doInfinite(infiniteScroll) {
		infiniteScroll.enable(false);
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
		deviceNumber){
		this.common.hideLoading();
		this.listData = [{
			deviceImg: "./assets/imgs/logo.png",
			electricity: "90%",
			title: deviceName,
			deviceId: deviceId,
			count:deviceNumber ,
			protectionState: deviceStat,
			onlineState: deviceOnline,
			onlineStype: deviceOnline
		}];
		
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