import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {AmOdsModule} from './modules/am-ods/am-ods.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AmOdsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
