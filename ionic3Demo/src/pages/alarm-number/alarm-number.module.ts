import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AlarmNumberPage } from './alarm-number';

@NgModule({
  declarations: [
    AlarmNumberPage,
  ],
  imports: [
    IonicPageModule.forChild(AlarmNumberPage),
  ],
})
export class AlarmNumberPageModule {}
