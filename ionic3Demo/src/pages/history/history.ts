import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the HistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {

  itemData : Object= [
    {
      source: "App 客户端",
      operation: "外出布防",
      time: "2018-05-22 16:41:41",
    },
    {
      source: "App 客户端",
      operation: "外出布防",
      time: "2018-05-22 13:41:41",
    },
    {
      source: "App 客户端",
      operation: "外出布防",
      time: "2018-05-22 12:41:41",
    }];
  
  listData : Object= [{
    title: "2018-05-22",
    content: this.itemData,
    }, 
    {
    title: "2018-05-22",
    content: this.itemData,
    }, 
    {
    title: "2018-05-22",
    content: this.itemData,
    }];
constructor(public navCtrl: NavController, public navParams: NavParams) {

}

ionViewDidLoad() {
  console.log('ionViewDidLoad HistoryPage');
}


}
