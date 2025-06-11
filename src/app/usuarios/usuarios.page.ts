import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { actualizarUsuarioLoading } from './store/actualizarUsuario.store';
import { crearUsuarioLoading } from './store/crearUsuario.store';
import { eliminarUsuarioLoading } from './store/eliminarUsuario.store';
import { listaNegociosLoading } from './store/listaNegocios.store';
import { obtenerUsuariosLoading, Page } from './store/obtenerUsuarios.store';
import { AppState } from './store/store';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {

  form: FormGroup;
  page: Page;
  id: number;
  busqueda: string = '';
  negocios;

  constructor(public formBuilder: FormBuilder, private store: Store<AppState>) { }

  ngOnInit() {
    this.store.select('listaNegocios').subscribe(s => {
      this.negocios = s.negocios;
    });
    this.store.dispatch(listaNegociosLoading({ lang: 'es' }));

    this.store.select('obtenerUsuarios').subscribe(s => {
      this.page = s.pageUsuario;
    });
    this.seleccionarPagina(0);

    this.store.select('crearUsuario').subscribe(s => {
      if (s.loaded) {
        this.limpiar();
        this.seleccionarPagina(0);
      }
    });

    this.store.select('actualizarUsuario').subscribe(s => {
      if (s.loaded) {
        this.limpiar();
        this.seleccionarPagina(0);
      }
    });

    this.store.select('eliminarUsuario').subscribe(s => {
      if (s.loaded) {
        this.seleccionarPagina(0);
      }
    });

    this.form = this.formBuilder.group({
      apodo: ['', [Validators.required, Validators.minLength(1)]],
      contrasenia: ['', [Validators.required, Validators.minLength(1)]],
      rol: ['', [Validators.required, Validators.minLength(1)]],
      negocioId: [],
      estatus: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  guardar() {
    let dato = this.form.value;
    if (dato.rol != 'CLIENTE') {
      dato.negocioId = null;
    }

    console.log(dato);
    if (this.id) {
      this.store.dispatch(actualizarUsuarioLoading({ lang: 'es', id: this.id, request: dato }));
    } else {
      this.store.dispatch(crearUsuarioLoading({ lang: 'es', request: dato }));
    }
  }

  editar(dato: any) {
    this.id = dato.id;
    this.form.controls.apodo.setValue(dato.apodo);
    this.form.controls.contrasenia.setValue(dato.contrasenia);
    this.form.controls.rol.setValue(dato.rol);
    this.form.controls.estatus.setValue(dato.estatus.toString());
    if (dato.rol == 'CLIENTE') {
      this.form.controls.negocioId.setValue(dato.negocio.id.toString());
    }
  }

  eliminar(id: number){
    this.store.dispatch(eliminarUsuarioLoading({ lang: 'es', id: id }));
  }

  limpiar() {
    this.id = null;
    this.form.reset();
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
    this.store.dispatch(obtenerUsuariosLoading({ lang: 'es', pagina: pagina, tamanio: 5, busqueda: this.busqueda }));
  }
  
  refrescar(event) {
    this.ngOnInit();
    event.target.complete();
  }
}
