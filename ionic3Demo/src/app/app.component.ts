
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { HistoryPage } from '../pages/history/history'
import { DataModule } from '../other/DataModule'
import { Storage } from '@ionic/storage'
import { TabsPage  } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,module : DataModule,public storage : Storage) {
    platform.ready().then(() => {
      module.onConnectClick();
      statusBar.styleDefault();
      splashScreen.hide();
      //链接服务器
      document.addEventListener("resume", () => {
        statusBar.styleDefault();
        splashScreen.hide();
        module.onConnectClick();
        alert("进入，前台展示"); //进入，前台展示
      }, false);
      document.addEventListener("pause", () => {
        alert("退出，后台运行"); //退出，后台运行
      }, false);
    });  
    this.storage.get('loginname').then((value1) => {
      this.storage.get('password').then((value2) => {
        if (value1&&value2) {
          this.rootPage = TabsPage;
        }else{
          this.rootPage = LoginPage;
        }
      });
    });   
  }
}
