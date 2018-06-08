import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NormalDevicePage } from './normal-device';

@NgModule({
  declarations: [
    NormalDevicePage,
  ],
  imports: [
    IonicPageModule.forChild(NormalDevicePage),
  ],
})
export class NormalDevicePageModule {}
