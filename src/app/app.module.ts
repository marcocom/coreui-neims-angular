import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from '@app/app.component';
import { AppRoutingModule } from '@app/app-routing.module';
import { CoreModule } from '@core/core.module';
import { LayoutModule } from '@layout/layout.module';
import { UserService } from '@data/user.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    LayoutModule,
  ],
  bootstrap: [AppComponent],
  providers: [UserService],
})
export class AppModule {}
