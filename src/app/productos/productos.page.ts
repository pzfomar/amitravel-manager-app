import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { actualizarProductoLoading } from './store/actualizarProducto.store';
import { crearProductoLoading } from './store/crearProducto.store';
import { eliminarProductoLoading } from './store/eliminarProducto.store';
import { obtenerProductosLoading, Page } from './store/obtenerProductos.store';
import { AppState } from './store/store';
import { listaNegociosLoading } from './store/listaNegocios.store';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {

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

    this.store.select('obtenerProductos').subscribe(s => {
      this.page = s.pageProducto;
    });
    this.seleccionarPagina(0);

    this.store.select('crearProducto').subscribe(s => {
      if (s.loaded) {
        this.limpiar();
        this.seleccionarPagina(0);
      }
    });

    this.store.select('actualizarProducto').subscribe(s => {
      if (s.loaded) {
        this.limpiar();
        this.seleccionarPagina(0);
      }
    });

    this.store.select('eliminarProducto').subscribe(s => {
      if (s.loaded) {
        this.seleccionarPagina(0);
      }
    });

    this.form = this.formBuilder.group({
      negocioId: ['', [Validators.required, Validators.minLength(1)]],
      nombre: ['', [Validators.required, Validators.minLength(1)]],
      tipo: ['', [Validators.required, Validators.minLength(1)]],
      descripcion: ['', []],
      imagen: ['', [Validators.required, Validators.minLength(1), Validators.pattern(/^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/\(\)]*)?$/)]],
      caducidad: ['', [Validators.required, Validators.minLength(1)]],
      cantidad: ['', [Validators.required, Validators.minLength(1)]],
      estatus: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  guardar() {
    console.log(this.form.value);
    if (this.id) {
      this.store.dispatch(actualizarProductoLoading({ lang: 'es', id: this.id, request: this.form.value }));
    } else {
      this.store.dispatch(crearProductoLoading({ lang: 'es', request: this.form.value }));      
    }
  }

  editar(dato: any) {
    this.id = dato.id;
    this.form.controls.negocioId.setValue(dato.negocio.id.toString());
    this.form.controls.nombre.setValue(dato.nombre);
    this.form.controls.tipo.setValue(dato.tipo);
    this.form.controls.descripcion.setValue(dato.descripcion);
    this.form.controls.imagen.setValue(dato.imagen);
    this.form.controls.caducidad.setValue(dato.caducidad);
    this.form.controls.cantidad.setValue(dato.cantidad);
    this.form.controls.estatus.setValue(dato.estatus.toString());
  }

  eliminar(id: number){
    this.store.dispatch(eliminarProductoLoading({ lang: 'es', id: id }));
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
    this.store.dispatch(obtenerProductosLoading({ lang: 'es', pagina: pagina, tamanio: 5, busqueda: this.busqueda }));
  }
  
  refrescar(event) {
    this.ngOnInit();
    event.target.complete();
  }
}
