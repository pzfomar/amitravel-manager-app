import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export interface EliminarNegocioState {
	lang: string,
	id: number,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const EliminarNegocioInitialState: EliminarNegocioState = {
	lang: 'es',
	id: 0,
	loaded: false,
	loading: false,
    error: null
}

export const eliminarNegocioLoading = createAction('[eliminarNegocio] eliminar negocio loading', props<{ lang: string, id: number }>());
export const eliminarNegocioSuccess = createAction('[eliminarNegocio] eliminar negocio success', props<any>());
export const eliminarNegocioFail = createAction('[eliminarNegocio] eliminar negocio fail', props<{ payload: any }>());

export const EliminarNegocioReducer = createReducer(
    EliminarNegocioInitialState,
    on(eliminarNegocioLoading, (state, { lang, id }) => ({ ...state, loading: true, loaded: false, lang: lang, id: id }) ),
    on(eliminarNegocioSuccess, (state, { }) => ({ ...state, loading: false, loaded: true })),
    on(eliminarNegocioFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class EliminarNegocioEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadEliminarNegocio$ = createEffect(() => this.actions$.pipe(
        ofType(eliminarNegocioLoading),
        mergeMap((action) => this.http.delete(environment.apiUrl + action.lang + '/negocio/' + action.id)
            .pipe(
                map((response: any) => eliminarNegocioSuccess({ response: response })),
                catchError(err => of(eliminarNegocioFail({ payload: err })))
            )
        )
    ));
}
