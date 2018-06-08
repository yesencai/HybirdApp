import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WifiDevicePage } from './wifi-device';

@NgModule({
  declarations: [
    WifiDevicePage,
  ],
  imports: [
    IonicPageModule.forChild(WifiDevicePage),
  ],
})
export class WifiDevicePageModule {}
