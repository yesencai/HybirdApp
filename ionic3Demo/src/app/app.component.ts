
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { HistoryPage } from '../pages/history/history'
import { DataModule } from '../other/DataModule'
import { Storage } from '@ionic/storage'
import { TabsPage } from '../pages/tabs/tabs';
import { SlidesPage } from '../pages/slides/slides';
import { AppVersion } from '@ionic-native/app-version'
import { ContactPage } from '../pages/contact/contact'
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, module: DataModule, public storage: Storage, appVersion: AppVersion) {
    platform.ready().then(() => {
      module.onConnectClick();
      statusBar.styleDefault();
      splashScreen.hide();
      
      //链接服务器
      document.addEventListener("resume", () => {
        statusBar.styleDefault();
        splashScreen.hide();
        module.onConnectClick();
        console.log("进入，前台展示"); //进入，前台展示
      }, false);
      document.addEventListener("pause", () => {
        console.log("退出，后台运行"); //退出，后台运行
      }, false);

      if (platform.is('cordova')) {
        appVersion.getAppName().then((versionCode) => {
          this.storage.get('versionCode').then((value1) => {
            if (versionCode != value1) {
              this.rootPage = SlidesPage;
              this.storage.set("versionCode", versionCode);
            } else {
              this.storage.get('loginname').then((value1) => {
                this.storage.get('password').then((value2) => {
                  if (value1 && value2) {
                    this.rootPage = TabsPage;
                  } else {
                    this.rootPage = LoginPage;
                  }
                });
              });
            }
          });
        });
      } else {
        this.storage.get('loginname').then((value1) => {
          this.storage.get('password').then((value2) => {
            if (value1 && value2) {
              this.rootPage = TabsPage;
            } else {
              this.rootPage = LoginPage;
            }
          });
        });
      }
      setTimeout(() => {
        splashScreen.hide();
      }, 1000)
    });

  }

}
