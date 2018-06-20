import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Common } from '../../lib/Common'
import { TTConst } from '../../lib/TTConst'
import { Tomato } from '../../lib/tomato'
import { Base64 } from 'js-base64';
import { Emitter } from '../../other/emitter'
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
  itemData = [];
  listData = [];
  // itemData: Object = [
  //   {
  //     source: "App 客户端",
  //     operation: "外出布防",
  //     time: "2018-05-22 16:41:41",
  //   },
  //   {
  //     source: "App 客户端",
  //     operation: "外出布防",
  //     time: "2018-05-22 13:41:41",
  //   },
  //   {
  //     source: "App 客户端",
  //     operation: "外出布防",
  //     time: "2018-05-22 12:41:41",
  //   }];

  // listData: Object = [{
  //   title: "2018-05-22",
  //   content: this.itemData,
  // },
  // {
  //   title: "2018-05-22",
  //   content: this.itemData,
  // },
  // {
  //   title: "2018-05-22",
  //   content: this.itemData,
  // }];
  deviceInfo;
  constructor(public navCtrl: NavController, public navParams: NavParams, public common: Common, public tomato: Tomato, public ttConst: TTConst) {
    this.deviceInfo = navParams.get('deviceInfo')
    let self = this;
    Emitter.register(this.ttConst.TT_GETDEVICEHISTORYLIST_NOTIFICATION_NAME, self.onHistoryDeviceResponse, self);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoryPage');

    //获取布防历史记录
    this.getDeviceHistoryList();
  }

  //y页面将要离开
  ionViewWillUnload() {
    console.log(this + '界面销毁');
    let self = this;
    Emitter.remove(this.ttConst.TT_GETDEVICEHISTORYLIST_NOTIFICATION_NAME, self.removeEmitter, self);

  }

  //获取设备布防历史记录列表
  getDeviceHistoryList() {
    var dat = this.common.MakeHeader(this.ttConst.CLIENT_GET_HISTOR_FIRST_DEVICE) +
      this.common.MakeParam(this.ttConst.CLIENT_GET_HISTOR_FIRST_DEVICEID, this.deviceInfo.deviceId) +
      this.common.MakeParam(this.ttConst.CLIENT_GET_HISTOR_FIRST_DEVICETIME, '20180615');
    this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, "", dat);
  }

  //获取历史记录列表
  onHistoryDeviceResponse(name, deviceId, historyTime, historyData) {
    var date = new Date(historyTime); //时间对象  
    var timeStamep = date.getTime();
    var time = this.common.transDate(timeStamep);
    this.itemData.push({
      source: "App 客户端",
      operation: historyData,
      time: historyTime,
    })
    this.itemData.sort(function(a,b){
      return Date.parse(a.time) - Date.parse(b.time);//时间正序
    });
    this.listData = this.mapLoction(this.itemData);

  }

  removeEmitter() {

  }
  mapLoction(arr) {
    var newArray = [];
    arr.forEach(function (oldData, i) {
      var index = -1;
      var createTime = oldData.time.substring(0, 10);
      var alreadyExists = newArray.some(function (newData, j) {
        if (oldData.time.substring(0, 10) === newData.title.substring(
          0, 10)) {
          index = j;
          return true;
        }
      });
      if (!alreadyExists) {
        newArray.push({
          title: oldData.time.substring(0, 10),
          content: [{
            "time": oldData.time,
            "source": oldData.source,
            "operation": oldData.operation,
          }]
        });
      } else {
        newArray[index].content.push({
          "time": oldData.time,
          "source": oldData.source,
          "operation": oldData.operation,
        });
      }
    });
    return newArray;
  };
}
