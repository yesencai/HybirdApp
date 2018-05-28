import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeviceInfoPage } from './device-info';

@NgModule({
  declarations: [
    DeviceInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(DeviceInfoPage),
  ],
})
export class DeviceInfoPageModule {}
