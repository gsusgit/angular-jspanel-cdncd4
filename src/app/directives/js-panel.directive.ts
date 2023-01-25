import { Directive, ElementRef, Input, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

declare var jsPanel: any;

@Directive({
  selector: '[appJsPanel]'
})

export class JsPanelDirective implements OnInit {

  @Input() title: String;
  @Input() theme: String;
  @Input() onFronted: Function;
  @Input() onBeforeClose: Function;
  @Input() onClosed: Function;
  @Input() onMinimized: Function;
  @Input() onNormalized: Function;
  @Input() contentSize: string;
  @Input() componentRef: any;
  @Input() maximizedMargin: Array<Number>;
  @Input() container: String;


  @Input() isModal;

  private element: ElementRef;
  private janela: any;
  private _activeComponents: Array<any> = new Array<any>();

  constructor(el: ElementRef,
    @Inject(DOCUMENT) private document: Document) {
    this.element = el;
  }


  restauraTemaJanelas() {
    for (const panel of jsPanel.getPanels()) {
      panel.setTheme('default');
    }
  }

  _onMaximized(panel) {
    AjustaTamanhoGrid(panel);
    return true;
  }

  _onNormalized(panel) {
    AjustaTamanhoGrid(panel);
    return true;
  }

  ngOnInit(): void {
    const heightPanel = this.element.nativeElement.offsetHeight;

  debugger
    if (!this.isModal) {
      this.janela = jsPanel.create({
        id: 'panel-' + this.componentRef.selector,
        style: 'overflow:hidden!important;',
        iconfont: 'fa',
        container: this.document.body,
        content: this.element.nativeElement,
        headerTitle: this.title,
        theme: this.theme ? this.theme : '#e05206',
        onfronted: () => {
          this.restauraTemaJanelas();
          this.janela.setTheme('#e05206');


          if (this.onFronted) {
            this.onFronted();
          }
        },
        onbeforeclose: this.onBeforeClose,
        onclosed: () => {
          this.removeComponentFromBody();
          if (this.onClosed) { this.onClosed(); }
        },
        onminimized: this.onMinimized,
        onmaximized: this._onMaximized,
        onbeforeminimize: () => {
          this.restauraTemaJanelas();


          return true;
        },
        onnormalized: this.onNormalized ? this.onNormalized : this._onNormalized,
        contentSize: this.contentSize ? this.contentSize : {
          width: function () {
            return window.innerWidth / 2;
          },
          height: function () {
            return '500px';
          }
        },

        maximizedMargin: this.maximizedMargin ? this.maximizedMargin : [68, 1, 28, 1],
        syncMargins: true,
        dragit: {
          snap: {
            sensitivity: [0, 0, 0, 0, 70, 5, 5, 0],
            repositionOnSnap: true,
            resizeToPreSnap: true,
            callback: function () {
              // callback resizes panel depending on position it snapped to
              let pos = this.snappableTo,
                margins = jsPanel.pOcontainment(this.options.dragit.containment),
                width, height;
              // calculate desired dimensions ...
              if (pos.startsWith('center')) { // fullsize for panels snapped to center-top or center-bottom
                width = `calc(100vw - ${margins[3]}px - ${margins[1]}px)`;
                height = `calc(100vh - ${margins[0]}px - ${margins[2]}px)`;
              } else if (pos.endsWith('center')) { // halfsize for panels snapped to left-center or right-center
                width = `calc(50vw -  ${margins[1]}px - ${margins[3]}px)`;
                height = `calc(100vh - ${margins[0]}px - ${margins[2]}px)`;
              } else { // quartersize for panels snapped to a corner
                width = `calc(50vw - ${margins[3]}px)`;
                height = `calc(50vh - ${margins[0]}px)`;
              }
              // resize panel
              this.resize({
                width: width,
                height: height
              });

              AjustaTamanhoGrid(this);
            },
          },
          stop: function (panel) {
            AjustaTamanhoGrid(panel);
          }
        },
        resizeit: {
          stop: function (panel, size) {
            AjustaTamanhoGrid(panel, size);
          }
        }
      });

      // Scrollbar.init(document.querySelector('.teste'), {alwaysShowTracks: true});
      // document.querySelector('.teste')['style']['max-height'] = '100%';

      this.restauraTemaJanelas();
      this.janela.setTheme('#e05206');
    }
  }
  public removeComponentFromBody() {
    const index = this._activeComponents.findIndex(i => i.instance.selector === this.componentRef.selector);
    this._activeComponents[index].destroy();
    this._activeComponents.splice(index, 1);
  }
}



function Dimension(elm) {
  let elmHeight = '0';
  let elmMargin = '0';
  // const elm = document.querySelector(elmID);
  if (elm) {
    if (document.all) {
      elmHeight = elm.currentStyle.height;
      elmMargin = parseInt(elm.currentStyle.marginTop, 10) + parseInt(elm.currentStyle.marginBottom, 10) + 'px';
    } else {// Mozilla
      elmHeight = document.defaultView.getComputedStyle(elm, '').getPropertyValue('height');
      elmMargin = parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-top')) +
        parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-bottom')) + 'px';
    }
  }

  return (Number(elmHeight.replace('px', '')) + Number(elmMargin.replace('px', '')));
}
function AjustaTamanhoGrid(panel?: any, size?: any) {
  panel = panel ? panel : document;
  const dimensaoBarraHeader = Dimension(panel.querySelector('.jsPanel-title')); // pega as dimensões do panel
  const dimensaoBarraFooter = Dimension(panel.querySelector('.barra-botoes'));
  const dimensaoPanel = Dimension(panel.querySelector('.jsPanel-content'));
  const elGrid = panel.querySelector('ag-grid-angular');
  // altera a altura da barra de scroll
  panel.querySelector('perfect-scrollbar')['style']['max-height'] = (dimensaoPanel - dimensaoBarraHeader - dimensaoBarraFooter) + 'px';

  // pega todos os cards da tela
  const cardsTotal = panel.querySelectorAll('.card');
  const cardsPrincipais = [];
  cardsTotal.forEach(element => { // só um filtro para pegar os cards principais do panel, caso tenha outro card na tela ele recusa
    if (element.offsetParent === panel.querySelector('perfect-scrollbar')) {
      cardsPrincipais.push(element);
    }
  });
  // pega o card da grid
  const card = panel.querySelector('ag-grid-angular').parentElement.parentElement.parentElement;
  let igual: any;
  let contador = 0;
  cardsPrincipais.forEach(element => {
    contador += element.clientHeight; // contador de px para saber qual a altura que está sobrando no panel
    if (element === card) { // um dos cards vai ser o da grid, então esse nao precisa somar a altura
      igual = element;
      contador -= element.clientHeight;
    }
  });
  if (panel.querySelector('ag-grid-angular').parentElement) {
    // caso a soma seja menor que 160px foi colocado 160px como valor mínimo, caso contrário a grid aumenta
    panel.querySelector('ag-grid-angular').parentElement['style']['height'] =
      (panel.querySelector('perfect-scrollbar').clientHeight - contador - 100) < 160 ? 160 + 'px' :
        (panel.querySelector('perfect-scrollbar').clientHeight - contador - 100) + 'px';
  }
  if (igual) {
    // o card da grid também deve aumentar
    igual['style']['height'] = panel.querySelector('ag-grid-angular').parentElement.clientHeight + 60 + 'px';
  }
  // falta testar mais
}
