import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChooseDevicePage } from './choose-device';

@NgModule({
  declarations: [
    ChooseDevicePage,
  ],
  imports: [
    IonicPageModule.forChild(ChooseDevicePage),
  ],
})
export class ChooseDevicePageModule {}
