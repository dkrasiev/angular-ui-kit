import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { UiModule } from 'ui';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestComponent } from './components/test/test.component';
import { ChipsTestComponent } from './components/chips-test/chips-test.component';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,

    // Chips
    ChipsTestComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, UiModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
