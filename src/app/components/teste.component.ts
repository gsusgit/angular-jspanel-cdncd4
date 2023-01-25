import { Component, OnInit, ElementRef, Output, EventEmitter } from '@angular/core';

declare var jsPanel: any;

@Component({
  selector: 'app-teste',
  templateUrl: './teste.component.html',
  styleUrls: ['./teste.component.scss']
})
export class TesteComponent implements OnInit {

  @Output() onClose = new EventEmitter();

  public panel: any;
  public Codigo: any;
  public config: any;
  public configPanel = {
    titulo: 'Teste Context menu',
    dimensao: '800 600',
  };

  constructor(private el: ElementRef) {
    this.resetDados();
  }

  ngOnInit() {
    var master = jsPanel.contextmenu.create({
        target: '#cm-sample-1',
        contentSize: 'auto auto',
        contentAjax: {
            url: '../docs/sample-content/contextmenu1.html',
            done: function (panel) {
                panel.content.innerHTML = this.responseText;
                // Array.prototype.slice.call(panel.querySelectorAll('.contextmenu1 a')).forEach(function (item) {
                //     item.addEventListener('click', function (e) {
                //         e.preventDefault();
                //         console.log(item.textContent);
                //     });
                // });
            }
        },
        callback: function () {
            this.content.style.padding = '0';
        }
    });
  }

  public teste() {
    
  }

  public exibir(): Promise<any> {

    return new Promise<any>(resolve => {
      this.resetDados();
      this.panel = jsPanel.modal.create({
        dragit: true,
        resizeit: true,
        contentSize: '300 300',
        theme: '#e05206',
        headerTitle: 'Teste Context menu',
        content: this.el.nativeElement,
        onclosed: () => {
          console.log(this.Codigo);
          this.modalFechada();
          resolve(this.Codigo);
        }
      });
    });
  }

  modalFechada() {
    this.resetDados();
    this.onClose.emit(true);
  }

  resetDados() {
    this.Codigo = {
      Codigo: '',
      Descricao: ''
    }
  }

}