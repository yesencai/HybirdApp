import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Common } from '../../lib/Common'
import { TTConst } from '../../lib/TTConst'
import { Tomato } from '../../lib/tomato'
import { Base64 } from 'js-base64';
import { Emitter } from '../../other/emitter'
import { CalendarModal, CalendarModalOptions, DayConfig, CalendarResult ,CalendarComponentOptions} from "ion2-calendar";

import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { RegistCode } from '../../other/registCode'


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
  deviceInfo;
  constructor(public serve : RegistCode, public navCtrl: NavController, public navParams: NavParams, public common: Common, public tomato: Tomato, public ttConst: TTConst, public modalCtrl: ModalController) {
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
      this.common.MakeParam(this.ttConst.CLIENT_GET_HISTOR_FIRST_DEVICENUM, "1");
    this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, this.serve.getServeId(), dat);
  }

  //获取历史记录列表
  onHistoryDeviceResponse(name, deviceId, historyTime, historyData) {
    var date = new Date(historyTime); //时间对象  
    var timeStamep = date.getTime();
    this.itemData.push({
      source: "App 客户端",
      operation: historyData,
      time: historyTime,
    })
    this.itemData.sort(function (a, b) {
      return Date.parse(b.time) - Date.parse(a.time);//时间正序
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

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      var dat = this.common.MakeHeader(this.ttConst.CLIENT_GET_HISTOR_FIRST_DEVICE) +
        this.common.MakeParam(this.ttConst.CLIENT_GET_HISTOR_FIRST_DEVICEID, this.deviceInfo.deviceId) +
        this.common.MakeParam(this.ttConst.CLIENT_GET_HISTOR_FIRST_DEVICENUM, (this.itemData.length + 1).toString());
      this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, this.serve.getServeId(), dat);
      infiniteScroll.complete();
    }, 500);
  }
  optionsMulti: CalendarComponentOptions = {
    monthPickerFormat : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
  };
  showCalendar() {
    const options: CalendarModalOptions = {
      monthFormat: 'YYYY 年 MM 月 ',
      title: '选择日期',
      closeLabel: '取消',
      doneLabel: '确定',
      canBackwardsSelected: true,
      weekdays : ['日','一','二','三','四','五','六']
    };
    let myCalendar = this.modalCtrl.create(CalendarModal, {
      options: options
    });

    myCalendar.present();
    myCalendar.onDidDismiss((date: CalendarResult, type: string) => {
      if (type==='cancel') {
        return false;
      }
      this.listData.splice(0,this.listData.length);
      this.itemData.splice(0,this.itemData.length);
      var time = this.common.formatDate(date.dateObj, "YYMMDD")
      var dat = this.common.MakeHeader(this.ttConst.CLIENT_GET_HISTOR_FIRST_DEVICE) +
        this.common.MakeParam(this.ttConst.CLIENT_GET_HISTOR_FIRST_DEVICEID, this.deviceInfo.deviceId) +
        this.common.MakeParam(this.ttConst.CLIENT_GET_HISTOR_FIRST_DEVICETIME, time);
      this.common.SendStrByParent(this.tomato.DSTTYPE_SERVER, this.serve.getServeId(), dat);
    })
  }


}
