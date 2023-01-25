import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

// Components
import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { TesteComponent } from './components/teste.component'

// Directives
import { JsPanelDirective } from './directives/js-panel.directive';

// import main js
// import { jsPanel } from 'jspanel4';


@NgModule({
  imports: [BrowserModule, FormsModule, AngularFontAwesomeModule],
  declarations: [AppComponent, HelloComponent, TesteComponent, JsPanelDirective],
  exports: [JsPanelDirective],
  bootstrap: [AppComponent]
})
export class AppModule { }
