import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { SettingPage } from '../setting/setting';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
@Component({
	templateUrl: 'tabs.html'
})
export class TabsPage {
	tabRoots: Object[];

	constructor(private nav: NavController, private events: Events) {
		this.tabRoots = [{
				root: HomePage,
				tabTitle: 'home',
				tabIcon: 'home'
			},
			{
				root: ContactPage,
				tabTitle: 'news',
				tabIcon: 'notifications'
			},
			{
				root: SettingPage,
				tabTitle: 'setting',
				tabIcon: 'person'
			}
		];
	}
	ionViewDidLoad() {
		this.listenEvents();
		// console.log('界面创建');
	}

	ionViewWillUnload() {
		this.events.unsubscribe('toLogin');
		// console.log('界面销毁');
	}

	listenEvents() {
		this.events.subscribe('toLogin', () => {
			this.nav.setRoot(LoginPage);
			// this.nav.pop(); 使用这种方式也可以，但是会在登录框中默认填上值
			// console.log('返回登录');
		});
	}
}