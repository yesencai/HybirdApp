import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Alert } from 'ionic-angular';
import { DeviceInfoPage } from '../device-info/device-info';
import {AddDevicePage} from '../add-device/add-device';

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
    testArray:string[]=[ '在线设备','离线设备'];  
    testSegment:string=this.testArray[0];  
	constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {}
	ionViewDidLoad() {
		console.log('ionViewDidLoad DevicePage');

		this.listData = [{
			deviceImg: "./assets/imgs/logo.png",
			electricity: "90%",
			title: "WiFi报警器",
			deviceId: "59731731937198",
			count: "3",
			protectionState: true,
			onlineState: true,
			onlineStype: "CPRS"
		}, {
			deviceImg: "./assets/imgs/logo.png",
			electricity: "90%",
			title: "WiFi报警器",
			deviceId: "59731731937198",
			count: "3",
			protectionState: true,
			onlineState: true,
			onlineStype: "CPRS"
		}];

		this.showAdddDevieButton();

	}

	//搜索添加设备
	addDevice() {
		// let loading = this.loadingCtrl.create({
		// 	content: "正在搜索设备,请等待...",
		// 	duration: 2000,
		// });
		// loading.present(loading);
		// setTimeout(() => {
		// 	this.listData.push({
		// 		deviceImg: "./assets/imgs/logo.png",
		// 		electricity: "90%",
		// 		title: "WiFi报警器",
		// 		count: "3",
		// 		deviceId: "59731731937198",
		// 		protectionState: true,
		// 		onlineState: true,
		// 		onlineStype: "CPRS"
		// 	});
		// 	this.showAdddDevieButton();
		// }, 2500);
		this.navCtrl.push(AddDevicePage);
		this.showAdddDevieButton();

	}

	//跳转设备详情页面
	deviceInfo(item) {
		this.navCtrl.push(DeviceInfoPage,{
			deviceInfo:item
		});
	}

	//删除设备
	removeItem(event,item) {
		event.stopPropagation();
		for(var i = 0; i < this.listData.length; i++) {
			if(item == this.listData[i]) {
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
	removal(item){
		alert("removal");
		// item.protectionState = !item.protectionState;
	}
	//外出布防
	outProtection(item){
		alert("outProtection");

	}
	//在家布防
	homeProtection(item){
		alert("home");

	}

	//下来刷新界面
	doRefresh(refresher){
		refresher.complete();
		setTimeout(() => { 
            console.log('加载完成后，关闭刷新'); 
            refresher.complete();

            //toast提示
        }, 5000);
	}

	//下拉加载数据
	doInfinite(infiniteScroll){
		infiniteScroll.enable(false);
	}

}