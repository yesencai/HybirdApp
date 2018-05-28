import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,LoadingController} from 'ionic-angular';

/**
 * Generated class for the AddDevicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-device',
  templateUrl: 'add-device.html',
})
export class AddDevicePage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl:LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddDevicePage');
  }
  nextButton(wifipassword){
      let loading = this.loadingCtrl.create({
			content: "正在连接设备,请等待...",
			duration: 2000,
	  	});
		  loading.present(loading);
  }

}
