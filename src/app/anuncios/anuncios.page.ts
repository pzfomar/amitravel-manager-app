import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Store } from '@ngrx/store';
import { AppState } from './store/store';
import { obtenerAnunciosLoading, Page } from './store/obtenerAnuncios.store';
import { crearAnuncioLoading } from './store/crearAnuncio.store';
import { actualizarAnuncioLoading } from './store/actualizarAnuncio.store';
import { eliminarAnuncioLoading } from './store/eliminarAnuncio.store';
import { listaNegociosLoading } from './store/listaNegocios.store';
import { listaUsuariosLoading } from './store/listaUsuarios.store';

@Component({
  selector: 'app-anuncios',
  templateUrl: './anuncios.page.html',
  styleUrls: ['./anuncios.page.scss'],
})
export class AnunciosPage implements OnInit {

  form: FormGroup;
  page: Page;
  id: number;
  busqueda: string = '';
  negocios;
  usuarios;

  constructor(public formBuilder: FormBuilder, private store: Store<AppState>) { }

  ngOnInit() {
    this.store.select('listaNegocios').subscribe(s => {
      this.negocios = s.negocios;
    });
    this.store.dispatch(listaNegociosLoading({ lang: 'es' }));

    this.store.select('listaUsuarios').subscribe(s => {
      this.usuarios = s.usuarios;
    });
    this.store.dispatch(listaUsuariosLoading({ lang: 'es' }));

    this.store.select('obtenerAnuncios').subscribe(s => {
      this.page = s.pageAnuncio;
    });
    this.seleccionarPagina(0);

    this.store.select('crearAnuncio').subscribe(s => {
      if (s.loaded) {
        this.limpiar();
        this.seleccionarPagina(0);
      }
    });

    this.store.select('actualizarAnuncio').subscribe(s => {
      if (s.loaded) {
        this.limpiar();
        this.seleccionarPagina(0);
      }
    });

    this.store.select('eliminarAnuncio').subscribe(s => {
      if (s.loaded) {
        this.seleccionarPagina(0);
      }
    });

    this.form = this.formBuilder.group({
      negocioId: ['', [Validators.required, Validators.minLength(1)]],
      usuarioIds: [],
      url: ['', [Validators.required, Validators.minLength(1), Validators.pattern(/^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/\(\)]*)?$/)]],
      nombre: ['', [Validators.required, Validators.minLength(1)]],
      estatus: ['', [Validators.required, Validators.minLength(1)]],
      descripcion: ['', []],
      imagen: ['', [Validators.required, Validators.minLength(1), Validators.pattern(/^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/\(\)]*)?$/)]]
    });
  }

  guardar() {
    console.log(this.form.value);
    if (this.id) {
      this.store.dispatch(actualizarAnuncioLoading({ lang: 'es', id: this.id, request: this.form.value }));
    } else {
      this.store.dispatch(crearAnuncioLoading({ lang: 'es', request: this.form.value }));      
    }
  }

  editar(dato: any) {
    this.id = dato.id;
    this.form.controls.negocioId.setValue(dato.negocio.id.toString());
    this.form.controls.usuarioIds.setValue(dato.usuarios.map(usuario => usuario.id.toString()));
    this.form.controls.url.setValue(dato.url);
    this.form.controls.nombre.setValue(dato.nombre);
    this.form.controls.estatus.setValue(dato.estatus);
    this.form.controls.descripcion.setValue(dato.descripcion);
    this.form.controls.imagen.setValue(dato.imagen);
  }

  eliminar(id: number){
    this.store.dispatch(eliminarAnuncioLoading({ lang: 'es', id: id }));
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
    this.store.dispatch(obtenerAnunciosLoading({ lang: 'es', pagina: pagina, tamanio: 5, busqueda: this.busqueda }));
  }
  
  refrescar(event) {
    this.ngOnInit();
    event.target.complete();
  }
}
