import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChildDevicePage } from './child-device';

@NgModule({
  declarations: [
    ChildDevicePage,
  ],
  imports: [
    IonicPageModule.forChild(ChildDevicePage),
  ],
})
export class ChildDevicePageModule {}
