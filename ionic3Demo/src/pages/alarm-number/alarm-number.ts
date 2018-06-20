import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

/**
 * Generated class for the AlarmNumberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alarm-number',
  templateUrl: 'alarm-number.html',
})

export class AlarmNumberPage {

  listData = [];
  // phoneNumber1;
  // phoneNumber2;
  public callback: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    // this.phoneNumber1 = navParams.get('phoneNumber1')
    // this.phoneNumber2 = navParams.get('phoneNumber2')
    // if (this.phoneNumber1 === '未填写') {
    //   this.phoneNumber1 = '';
    // }
    // if (this.phoneNumber1) {
    //   this.listData.push(this.phoneNumber1);
    // }
    // if (this.phoneNumber2) {
    //   this.listData.push(this.phoneNumber2);
    // }
    this.callback = this.navParams.get("callback")

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AlarmNumberPage');
  }
  saveSetting() {
    this.callback(this.listData).then(() => {
      // pop返回方法
      this.navCtrl.pop();
    });
  }

  //添加电话号码
  addNumber() {
    let prompt = this.alertCtrl.create({
      title: '添加手机号码',
      inputs: [{
        name: 'title',
        placeholder: '请输入您的手机号码!'
      },],
      buttons: [{
        text: '取消',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: '确认',
        handler: data => {
          if (data.title.length > 0) {
            this.listData.push(data.title);
            // this.phoneNumber1 = data.title;
            // this.phoneNumber2 = data.title;
          }
        }
      }
      ]
    });
    prompt.present();
  }

  //删除电话号码
  removeNumber(event, item) {
    event.stopPropagation();
    for (var i = 0; i < this.listData.length; i++) {
      if (item == this.listData[i]) {
        this.listData.splice(i, 1);
      }
    }
  }

}
