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
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AlarmNumberPage');
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
          }
        }
      }
      ]
    });
    prompt.present();
  }

  //删除电话号码
  removeNumber(event,item) {
    event.stopPropagation();
		for(var i = 0; i < this.listData.length; i++) {
			if(item == this.listData[i]) {
				this.listData.splice(i, 1);
			}
		}
  }

}
