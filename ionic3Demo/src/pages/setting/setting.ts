import { Component } from '@angular/core';
import { IonicPage,NavController, NavParams,Events} from 'ionic-angular';
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

	constructor(public navCtrl: NavController, public navParams: NavParams,public events: Events) {}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SettingPage');
	}
	
	logOut() {
	  this.events.publish('toLogin');
	}
	seleteItem(index) {
		if(index == 1) {
			this.navCtrl.push(PersonPage);
		} else if(index == 2) {
			this.navCtrl.push(ChangePswPage);
		} else if(index == 3) {
			this.navCtrl.push(ResetPswPage);
		} else if(index == 4) {

		} else if(index == 5) {

		} else {

		}
	}

}
