import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlarmPage } from '../alarm/alarm';
import { HistoryPage } from '../history/history';
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
	deviceImg: string = "./assets/imgs/logo.png"
	listData: Object = [{
		title: "设置报警",
		index: 0
	}, {
		title: "历史记录",
		index: 1
	}];

	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.userInfo = navParams.get('deviceInfo')
	}

	ionViewDidLoad() {
		console.log(this.userInfo);
	}

	clickItem() {

	}
	seleteItem(item) {
		if (item.index == 0) {
			this.navCtrl.push(AlarmPage);

		} else {
			this.navCtrl.push(HistoryPage);
		}
	}
}