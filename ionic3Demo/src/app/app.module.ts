import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { RegisteredPage } from '../pages/registered/registered';
import { SettingPage } from '../pages/setting/setting';
import { PersonPage } from '../pages/person/person';
import { ChangePswPage } from '../pages/change-psw/change-psw';
import { ResetPswPage } from '../pages/reset-psw/reset-psw';

@NgModule({
	
  declarations: [
    MyApp,
    LoginPage,
    ResetPswPage,
    RegisteredPage,
    SettingPage,
    ChangePswPage,
    ContactPage,
    HomePage,
    TabsPage,
    PersonPage
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
    LoginPage,
    ResetPswPage,
    RegisteredPage,
    SettingPage,
    ChangePswPage,
    ContactPage,
    HomePage,
    TabsPage,
    PersonPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
