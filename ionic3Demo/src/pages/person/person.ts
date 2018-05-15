import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController, ToastController, LoadingController } from 'ionic-angular';
import { ImagePicker, ImagePickerOptions } from "@ionic-native/image-picker";
import { Camera, CameraOptions } from "@ionic-native/camera";
/**
 * Generated class for the PersonPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-person',
	templateUrl: 'person.html',
})
export class PersonPage {

	avatar: string = "/src/assets/imgs/tomato.png";
	name: string = "未填写";
	username :string = "未填写";
	
	constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController, public imagePicker: ImagePicker, public camera: Camera, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
		this.avatar = navParams.get('headimage');
		this.name = navParams.get('name');
		this.username = navParams.get('mobile');

	}
	
	ionViewDidLoad() {
		console.log('ionViewDidLoad PersonPage');
	}

	selectIndex(index) {
		if(index == 0) {
			this.presentActionSheet();
		} else if(index == 1) {
			let prompt = this.alertCtrl.create({
				title: '修改姓名',
				inputs: [{
					name: 'title',
					placeholder: '请输入您的姓名!'
				}, ],
				buttons: [{
						text: '取消',
						handler: data => {
							console.log('Cancel clicked');
						}
					},
					{
						text: '确认',
						handler: data => {
							this.name = data.title;
						}
					}
				]
			});
			prompt.present();
		}
	}

	save() {
		let loading = this.loadingCtrl.create({
			content: "保存中...",
			duration: 2000,
		});
		loading.present(loading);
		setTimeout(() => {
				let toast = this.toastCtrl.create({
					message: "保存成功",
					duration: 2000,
					position: "top"

				});
				toast.present();
	}, 2000);
}
presentActionSheet() {
	let actionSheet = this.actionSheetCtrl.create({
		buttons: [{
			text: '拍照',
			role: 'takePhoto',
			handler: () => {
				this.takePhoto();
			}
		}, {
			text: '从相册选择',
			role: 'chooseFromAlbum',
			handler: () => {
				this.chooseFromAlbum();
			}
		}, {
			text: '取消',
			role: 'cancel',
			handler: () => {
				console.log("cancel");
			}
		}]
	});

	actionSheet.present().then(value => {
		return value;
	});
}
takePhoto() {
	const options: CameraOptions = {
		quality: 100,
		allowEdit: true,
		targetWidth: 200,
		targetHeight: 200,
		saveToPhotoAlbum: true,
	};

	this.camera.getPicture(options).then(image => {
		console.log('Image URI: ' + image);
		this.avatar = image.slice(7);
	}, error => {
		console.log('Error: ' + error);
	});
}

chooseFromAlbum() {
	const options: ImagePickerOptions = {
		maximumImagesCount: 1,
		width: 200,
		height: 200
	};
	this.imagePicker.getPictures(options).then(images => {
		if(images.length > 1) {
			this.presentAlert();
		} else if(images.length === 1) {
			console.log('Image URI: ' + images[0]);
			this.avatar = images[0].slice(7);
		}
	}, error => {
		console.log('Error: ' + error);
	});
}

presentAlert() {
	let toast = this.toastCtrl.create({
		message: "上传图片失败",
		duration: 2000,
		position: "top"

	});
	toast.present();
}
}