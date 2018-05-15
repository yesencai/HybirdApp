import { Component } from '@angular/core';
import { IonicPage,NavController, NavParams,Events,AlertController} from 'ionic-angular';
import { PersonPage } from '../person/person';
import { ChangePswPage } from '../change-psw/change-psw';
import { ResetPswPage } from '../reset-psw/reset-psw';


/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-setting',
	templateUrl: 'setting.html',
})
export class SettingPage {

	
	headimage : string  = "/Users/Dylan/Desktop/HybirdApp-master/ionic3Demo/src/assets/imgs/tomato.png";
	name :string = "未填写";
	mobile : string = "未填写";

	constructor(public navCtrl: NavController, public navParams: NavParams,public events: Events,public alerCtrl: AlertController) {}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SettingPage');
	}
	
	logOut() {
		this.doConfirm();
	}
	seleteItem(index) {
		if(index == 1) {
			this.navCtrl.push(PersonPage,{
				headimage:"/Users/Dylan/Desktop/HybirdApp-master/ionic3Demo/src/assets/imgs/tomato.png",
					name:"未填写",
					mobile:"未填写"
				
			});
		} else if(index == 2) {
			this.navCtrl.push(ChangePswPage);
		} else if(index == 3) {
			this.navCtrl.push(ResetPswPage);
		} else if(index == 4) {

		} else if(index == 5) {

		} else {

		}
	}
	doConfirm() {
    let confirm = this.alerCtrl.create({
      title: '退出登录',
      message: '确定退出登录?',
      buttons: [
        {
          text: '取消',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: '同意',
          handler: () => {
	  this.events.publish('toLogin');
          }
        }
      ]
    });
    confirm.present()
  }

}
