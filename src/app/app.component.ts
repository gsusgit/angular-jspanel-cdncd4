import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { TesteComponent } from './components/teste.component'
// import { jsPanel } from 'jspanel4';

declare var jsPanel: any;
declare var self: any;
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {


  master: any;
  htb: Array<any>;
  @ViewChild(TesteComponent) testeContext: TesteComponent;

  constructor(private el: ElementRef) {
    this.htb = [
      '<span id="btn-bus3" style="cursor: pointer"><i class="fa fa-bus"></i></span>',
      '<span id="btn-train3" style="cursor: pointer"><i class="fa fa-train"></i></span>',
      '<span id="btn-car3" style="cursor: pointer"><i class="fa fa-car"></i></span>',
      '<span id="htb-drag-handle" style="flex: 1 1 auto;cursor: move;">&nbsp;</span>'
    ];
  }

  ngOnInit() {
    self = this;
    // console.log(this.selector)
    this.master = jsPanel.create({
      theme: 'primary',
      headerToolbar: this.htb,
      dragit: { handles: '.jsPanel-headerlogo, .jsPanel-titlebar, .jsPanel-ftr, #htb-drag-handle' },
      headerTitle: 'TESTE JSPANEL',
      headerLogo: '<span id="three" class="fa fa-bars" style="margin-left:8px;cursor:pointer;"> </span>',
      position: 'center-top 0 58',
      contentSize: '450 250',
      content: '<p>Example panel ...</p>',
      // callback: this.contextmenuDemo('#two'),
      onbeforeclose: function () {
        return confirm('Do you really want to close the panel?');
      }
    });
    //  const name = this.el;
    // console.log(self);
  }

  openNewPanel() {
    self = this;
    // console.log(this.selector)
    this.master = jsPanel.create({
      theme: 'primary',
      headerToolbar: this.htb,
      dragit: { handles: '.jsPanel-headerlogo, .jsPanel-titlebar, .jsPanel-ftr, #htb-drag-handle' },
      headerTitle: 'TESTE JSPANEL 2',
      headerLogo: '<span id="three" class="fa fa-bars" style="margin-left:8px;cursor:pointer;"> </span>',
      position: 'center-top 0 58',
      contentSize: '450 250',
      content: '<p>Example panel 2...</p>',
      // callback: this.contextmenuDemo('#two'),
      onbeforeclose: function () {
        return confirm('Do you really want to close the panel?');
      }
    });
    //  const name = this.el;
    // console.log(self);
  }

  ngAfterViewInit() {
    debugger
    self = this;
    const seletor = '#panel-my-app';
  }

  chamaModal() {
    // this.testeContext.exibir().then((retorno) => {
    //     if (retorno) {
    //       const teste = retorno;
    //     }
    //   });
  }

  contextmenuDemo(tgt) {
    jsPanel.contextmenu.create({
      target: tgt,
      contentSize: 'auto auto',
      contentAjax: {
        url: '/components/contextmenu/contextmenu1.html',
        done: function (panel) {
          panel.content.innerHTML = this.responseText;
          Array.prototype.slice.call(panel.querySelectorAll('.contextmenu1 a')).forEach(function (item) {
            // item.addEventListener('click', function (e) {
            //   e.preventDefault();
            //   console.log(item.textContent);
            // });
          });
        }
      },
      callback: function () {
        this.content.style.padding = '0';
      }
    });
  }

}


