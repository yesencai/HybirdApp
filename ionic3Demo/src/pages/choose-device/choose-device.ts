import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EditorChildDevicePage } from '../editor-child-device/editor-child-device'
/**
 * Generated class for the ChooseDevicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-choose-device',
  templateUrl: 'choose-device.html',
})
export class ChooseDevicePage {

  deviceType: string[] = ['遥控器', '设备'];
  pageIdentifier;
  deviceList;
  deviceInfo;
  type;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.pageIdentifier = navParams.get("pageIdentifier");
    this.deviceList = navParams.get("deviceList");
    this.deviceInfo = navParams.get("deviceInfo")
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChooseDevicePage');
  }

  // 一般探头为0，遥控器为1
  addRemoteControl() {
    this.navCtrl.push(EditorChildDevicePage, {
      pageIdentifier: "add",
      deviceList: this.deviceList,
      deviceInfo: this.deviceInfo,
      type: '0'
    });
  }
  addCDevice() {
    this.navCtrl.push(EditorChildDevicePage, {
      pageIdentifier: "add",
      deviceList: this.deviceList,
      deviceInfo: this.deviceInfo,
      type: '1'
    });
  }

}
