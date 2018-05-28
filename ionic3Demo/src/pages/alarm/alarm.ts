import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,AlertController} from 'ionic-angular';
import { AlarmNumberPage } from '../alarm-number/alarm-number';

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
	phoneNumber = "未填写";
	constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl : AlertController) {}

	ionViewDidLoad() {
		console.log('ionViewDidLoad AlarmPage');
	}
	
	//填写多个电话
	chooseNumber(){
		this.navCtrl.push(AlarmNumberPage);
		
	}
	//保存设置信息
	saveSetting(){
		
	}

}