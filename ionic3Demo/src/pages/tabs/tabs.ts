import { Component ,ViewChild} from '@angular/core';
import { NavController, Events ,Platform,Tabs} from 'ionic-angular';
import { SettingPage } from '../setting/setting';
import { DevicePage } from '../device/device';
import { LoginPage } from '../login/login';
import { BackButtonProvider } from '../../other/back-button-provider'
@Component({
	templateUrl: 'tabs.html'
})
export class TabsPage {
	tabRoots: Object[];
	@ViewChild('myTabs') tabRef: Tabs;
	constructor(private nav: NavController, private events: Events,public backButtonService: BackButtonProvider,
		private platform: Platform) {
		this.tabRoots = [{
				root: DevicePage,
				tabTitle: 'device',
				tabIcon: 'home'
		},
			{
				root: SettingPage,
				tabTitle: 'setting',
				tabIcon: 'person'
			}
		];
		this.platform.ready().then(() => {
			this.backButtonService.registerBackButtonAction(this.tabRef);
		  });
	}
	ionViewDidLoad() {
		this.listenEvents();
		// console.log('界面创建');
	}

	ionViewWillUnload() {
		console.log(this+'界面销毁');
	}

	listenEvents() {
		this.events.subscribe('toLogin', () => {
			this.nav.setRoot(LoginPage);
			this.events.unsubscribe('toLogin');
			// this.nav.pop(); 使用这种方式也可以，但是会在登录框中默认填上值
			// console.log('返回登录');
		});
	}
}