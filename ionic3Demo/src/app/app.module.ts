import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { DevicePage } from '../pages/device/device';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { RegisteredPage } from '../pages/registered/registered';
import { SettingPage } from '../pages/setting/setting';
import { PersonPage } from '../pages/person/person';
import { ChangePswPage } from '../pages/change-psw/change-psw';
import { ResetPswPage } from '../pages/reset-psw/reset-psw';
import {Camera} from "@ionic-native/camera";
import {ImagePicker} from "@ionic-native/image-picker";
import {AboutPage} from '../pages/about/about';
import {DeviceInfoPage} from '../pages/device-info/device-info';
import {AlarmPage} from '../pages/alarm/alarm';
import {HistoryPage} from '../pages/history/history';
import {AddDevicePage} from '../pages/add-device/add-device';
import {AlarmNumberPage} from '../pages/alarm-number/alarm-number';
import { Tomato } from '../lib/tomato'
import { Common } from '../lib/Common'
import { TTConst } from '../lib/TTConst'
import { DataModule } from '../other/DataModule'
import { BackButtonProvider } from '../other/back-button-provider'
import { NormalDevicePage } from '../pages/normal-device/normal-device'
import { WifiDevicePage } from '../pages/wifi-device/wifi-device'
@NgModule({
	
  declarations: [
    MyApp,
    LoginPage,
    AlarmNumberPage,
    AboutPage,
    ResetPswPage,
    RegisteredPage,
    AlarmPage,
    SettingPage,
    ChangePswPage,
    DeviceInfoPage,
    DevicePage,
    TabsPage,
    PersonPage,
    HistoryPage,
    AddDevicePage,
    NormalDevicePage,
    WifiDevicePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{
    tabsHideOnSubPages: 'true',
    backButtonText: '',//按钮内容
    backButtonIcon: 'arrow-dropleft-circle',//按钮图标样式
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AlarmNumberPage,
    DeviceInfoPage,
    LoginPage,
    AlarmPage,
    AboutPage,
    ResetPswPage,
    RegisteredPage,
    SettingPage,
    ChangePswPage,
    DevicePage,
    TabsPage,
    PersonPage,
    HistoryPage,
    AddDevicePage,
    NormalDevicePage,
    WifiDevicePage
  ],
  providers: [
    StatusBar,
    Camera,
    ImagePicker,
    SplashScreen,
    Tomato,
    Common,
    DataModule,
    BackButtonProvider,
    TTConst,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
 
}
