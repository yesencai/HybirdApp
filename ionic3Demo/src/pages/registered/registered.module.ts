import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisteredPage } from './registered';

@NgModule({
  declarations: [
    RegisteredPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisteredPage),
  ],
})
export class RegisteredPageModule {}
