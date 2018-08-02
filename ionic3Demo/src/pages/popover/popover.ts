import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { TTConst } from '../../lib/TTConst';
import { Emitter } from '../../other/emitter'
/**
 * Generated class for the PopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {

  constructor(public navCtrl: NavController, public navParams: NavParams , public ttConst : TTConst,public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverPage');
    var s = document.querySelector('.popover-content');
    s['style'].width = '90px';
    s['style'].height = '100px';
  }
  addDevice() {
    Emitter.fire(this.ttConst.TT_AddDeviceNotification);
    this.viewCtrl.dismiss();
  }
  cancelPolice() {
    Emitter.fire(this.ttConst.TT_CancelPoliceNotification);
    this.viewCtrl.dismiss();
  }

}
