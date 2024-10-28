import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { actualizarPersonaLoading } from './store/actualizarPersona.store';
import { crearPersonaLoading } from './store/crearPersona.store';
import { eliminarPersonaLoading } from './store/eliminarPersona.store';
import { obtenerPersonasLoading, Page } from './store/obtenerPersonas.store';
import { AppState } from './store/store';
import { listaUsuariosLoading } from './store/listaUsuarios.store';

@Component({
  selector: 'app-personas',
  templateUrl: './personas.page.html',
  styleUrls: ['./personas.page.scss'],
})
export class PersonasPage implements OnInit {

  form: FormGroup;
  page: Page;
  id: number;
  busqueda: string = '';
  usuarios;

  constructor(public formBuilder: FormBuilder, private store: Store<AppState>) { }

  ngOnInit() {
    this.store.select('listaUsuarios').subscribe(s => {
      this.usuarios = s.usuarios;
    });
    this.store.dispatch(listaUsuariosLoading({ lang: 'es' }));

    this.store.select('obtenerPersonas').subscribe(s => {
      this.page = s.pagePersona;
    });
    this.seleccionarPagina(0);

    this.store.select('crearPersona').subscribe(s => {
      if (s.loaded) {
        this.limpiar();
        this.seleccionarPagina(0);
      }
    });

    this.store.select('actualizarPersona').subscribe(s => {
      if (s.loaded) {
        this.limpiar();
        this.seleccionarPagina(0);
      }
    });

    this.store.select('eliminarPersona').subscribe(s => {
      if (s.loaded) {
        this.seleccionarPagina(0);
      }
    });

    this.form = this.formBuilder.group({
      usuarioId: ['', [Validators.required, Validators.minLength(1)]],
      correo: ['', [Validators.required, Validators.minLength(1)]],
      nombre: ['', [Validators.required, Validators.minLength(1)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(1)]],
      apellidoMaterno: ['', [Validators.required, Validators.minLength(1)]],
      edad: ['', [Validators.required, Validators.minLength(1)]],
      telefono: ['', [Validators.required, Validators.minLength(1)]],
      estatus: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  guardar() {
    console.log(this.form.value);
    if (this.id) {
      this.store.dispatch(actualizarPersonaLoading({ lang: 'es', id: this.id, request: this.form.value }));
    } else {
      this.store.dispatch(crearPersonaLoading({ lang: 'es', request: this.form.value }));      
    }
  }

  editar(dato: any) {
    this.id = dato.id;
    this.form.controls.usuarioId.setValue(dato.usuario.id.toString());
    this.form.controls.correo.setValue(dato.correo);
    this.form.controls.nombre.setValue(dato.nombre);
    this.form.controls.apellidoPaterno.setValue(dato.apellidoPaterno);
    this.form.controls.apellidoMaterno.setValue(dato.apellidoMaterno);
    this.form.controls.edad.setValue(dato.edad);
    this.form.controls.telefono.setValue(dato.telefono);
    this.form.controls.estatus.setValue(dato.estatus.toString());
  }

  eliminar(id: number){
    this.store.dispatch(eliminarPersonaLoading({ lang: 'es', id: id }));
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
    this.store.dispatch(obtenerPersonasLoading({ lang: 'es', pagina: pagina, tamanio: 5, busqueda: this.busqueda }));
  }
  
  refrescar(event) {
    this.ngOnInit();
    event.target.complete();
  }
}
