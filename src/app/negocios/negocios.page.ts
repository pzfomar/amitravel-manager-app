import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Store } from '@ngrx/store';
import { AppState } from './store/store';
import { obtenerNegociosLoading, Page } from './store/obtenerNegocios.store';
import { crearNegocioLoading } from './store/crearNegocio.store';
import { actualizarNegocioLoading } from './store/actualizarNegocio.store';
import { eliminarNegocioLoading } from './store/eliminarNegocio.store';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-negocios',
  templateUrl: './negocios.page.html',
  styleUrls: ['./negocios.page.scss'],
})
export class NegociosPage implements OnInit {

  form: FormGroup;
  page: Page;
  id: number;
  busqueda: string = '';
  horarios: any[] = []; 

  constructor(private alertController: AlertController, public formBuilder: FormBuilder, private store: Store<AppState>) { }

  ngOnInit() {
    this.store.select('obtenerNegocios').subscribe(s => {
      this.page = s.pageNegocio;
    });
    this.seleccionarPagina(0);

    this.store.select('crearNegocio').subscribe(s => {
      if (s.loaded) {
        this.limpiar();
        this.seleccionarPagina(0);
      }
    });

    this.store.select('actualizarNegocio').subscribe(s => {
      if (s.loaded) {
        this.limpiar();
        this.seleccionarPagina(0);
      }
    });

    this.store.select('eliminarNegocio').subscribe(s => {
      if (s.loaded) {
        this.seleccionarPagina(0);
      }
    });

    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(1)]],
      estatus: ['', [Validators.required, Validators.minLength(1)]],
      descripcion: ['', []],
      lugar: ['', [Validators.required, Validators.minLength(1)]],
      mapa: ['', [Validators.required, Validators.minLength(1)]],
      imagen: ['', [Validators.required, Validators.minLength(1), Validators.pattern(/^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/\(\)]*)?$/)]]
    });
  }

  guardar() {
    let dato = this.form.value;
    dato.horarios = this.horarios;

    console.log(dato);
    if (this.id) {
      this.store.dispatch(actualizarNegocioLoading({ lang: 'es', id: this.id, request: dato }));
    } else {
      this.store.dispatch(crearNegocioLoading({ lang: 'es', request: dato }));      
    }
  }

  editar(dato: any) {
    this.id = dato.id;
    this.form.controls.nombre.setValue(dato.nombre);
    this.form.controls.estatus.setValue(dato.estatus.toString());
    this.form.controls.descripcion.setValue(dato.descripcion);
    this.form.controls.lugar.setValue(dato.lugar);
    this.form.controls.mapa.setValue(dato.mapa);
    this.form.controls.imagen.setValue(dato.imagen);
    this.horarios = [];
    this.horarios = dato.horarios.map(horario => { return { abre: horario.abre, cierre: horario.cierre, dia: horario.dia }; });
  }

  eliminar(id: number){
    this.store.dispatch(eliminarNegocioLoading({ lang: 'es', id: id }));
  }

  limpiar() {
    this.id = null;
    this.form.reset();
    this.horarios = [];
  }

  buscar(texto: string){
    this.busqueda = texto;
    this.seleccionarPagina(0);
  }

  iArray(size: number): number[] {
    let i: number[] = [];
    for (let index = 0; index < size; index++) {
      i.push(index);
    }
    return i
  }

  seleccionarPagina(pagina: number) {
    this.store.dispatch(obtenerNegociosLoading({ lang: 'es', pagina: pagina, tamanio: 5, busqueda: this.busqueda }));
  }

  tansformarIFrame(event) {
    let mapa: string = event.target.value;
    if (mapa.split('src="').length > 1) {
      event.target.value = mapa.split('src="')[1].split('"')[0]
    }
  }
  
  refrescar(event) {
    this.ngOnInit();
    event.target.complete();
  }

  async nuevoHorario(index: number = undefined) {
    let horario = { abre: '', cierre: '', dia:'' };
    const diaAlert = await this.alertController.create({
      header: 'Dia',
      inputs: [
        {
          label: 'LUNES',
          type: 'radio',
          value: 'LUNES',
          checked: (index != undefined)? this.horarios[index].dia == 'LUNES': false
        },
        {
          label: 'MARTES',
          type: 'radio',
          value: 'MARTES',
          checked: (index != undefined)? this.horarios[index].dia == 'MARTES': false
        },
        {
          label: 'MIERCOLES',
          type: 'radio',
          value: 'MIERCOLES',
          checked: (index != undefined)? this.horarios[index].dia == 'MIERCOLES': false
        },
        {
          label: 'JUEVES',
          type: 'radio',
          value: 'JUEVES',
          checked: (index != undefined)? this.horarios[index].dia == 'JUEVES': false
        },
        {
          label: 'VIERNES',
          type: 'radio',
          value: 'VIERNES',
          checked: (index != undefined)? this.horarios[index].dia == 'VIERNES': false
        },
        {
          label: 'SABADO',
          type: 'radio',
          value: 'SABADO',
          checked: (index != undefined)? this.horarios[index].dia == 'SABADO': false
        },
        {
          label: 'DOMINGO',
          type: 'radio',
          value: 'DOMINGO',
          checked: (index != undefined)? this.horarios[index].dia == 'DOMINGO': false
        },
      ],
      buttons: [
        {
          text: "Cancelar",
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: "Confirmar",
          handler: (value) => {
            if (!value) {
              return false;
            }
            horario.dia = value;
            if (index != undefined) {
              this.horarios = this.horarios.filter(horario => horario != this.horarios[index]);
            }
            this.horarios.push(horario);
          }
        }
      ]
    });

    const horarioAlert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Horario',
      inputs: [
        {
          type: 'text',
          disabled: true,
          placeholder: "Abre"
        },
        {
          name: 'abre',
          id: 'abre',
          type: 'time',
          value: (index != undefined)? this.horarios[index].abre: ''
        },
        {
          type: 'text',
          disabled: true,
          placeholder: "Cierre"
        },
        {
          name: 'cierre',
          id: 'cierre',
          type: 'time',
          value: (index != undefined)? this.horarios[index].cierre: ''
        }
      ],
      buttons: [
        {
          text: "Cancelar",
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: "Confirmar",
          handler: (value) => {
            if (!value.abre || !value.cierre) {
              return false;
            }
            horario.abre = value.abre;
            horario.cierre = value.cierre;
            diaAlert.present();
          }
        }
      ]
    });

    await horarioAlert.present();
  }

  eliminarHorario(index: number) {
    this.horarios = this.horarios.filter(horario => horario != this.horarios[index]);
  }
}
