import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { NormalDevicePage } from '../normal-device/normal-device'
import { WifiDevicePage } from '../wifi-device/wifi-device'


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

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) {
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddDevicePage');

  }

  //绑定普通设备
  addNomalDevice(){
    this.navCtrl.push(NormalDevicePage);
  }

  //绑定wifi设备
  addWiFiDevice(){
    this.navCtrl.push(WifiDevicePage);
  }




}
