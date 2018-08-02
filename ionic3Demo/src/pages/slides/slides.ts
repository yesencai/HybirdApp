import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform,} from 'ionic-angular';
import { TabsPage } from '../tabs/tabs'
import { LoginPage } from '..//login/login'


/**
 * Generated class for the SlidesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-slides',
  templateUrl: 'slides.html',
})

export class SlidesPage {
  rootPage: any = SlidesPage;

  slides : any = [
    {
      title: "Welcome to the Docs!",
      description: "The <b>Ionic Component Documentation</b> showcases a number of useful components that are included out of the box with Ionic.",
      image: "./assets/imgs/ica-slidebox-img-1.png",
    },
    {
      title: "What is Ionic?",
      description: "<b>Ionic Framework</b> is an open source SDK that enables developers to build high quality mobile apps with web technologies like HTML, CSS, and JavaScript.",
      image: "./assets/imgs/ica-slidebox-img-2.png",
    },
    {
      title: "What is Ionic Cloud?",
      description: "The <b>Ionic Cloud</b> is a cloud platform for managing and scaling Ionic apps with integrated services like push notifications, native builds, user auth, and live updating.",
      image: "./assets/imgs/ica-slidebox-img-3.png",
    }
  ];
  constructor(public Platform : Platform ,public navCtrl: NavController, public navParams: NavParams,public storage :Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SlidesPage');
  }
}
