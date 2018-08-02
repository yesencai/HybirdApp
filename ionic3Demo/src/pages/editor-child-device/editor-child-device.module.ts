import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditorChildDevicePage } from './editor-child-device';

@NgModule({
  declarations: [
    EditorChildDevicePage,
  ],
  imports: [
    IonicPageModule.forChild(EditorChildDevicePage),
  ],
})
export class EditorChildDevicePageModule {}
