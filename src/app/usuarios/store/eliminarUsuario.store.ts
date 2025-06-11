import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export interface EliminarUsuarioState {
	lang: string,
	id: number,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const EliminarUsuarioInitialState: EliminarUsuarioState = {
	lang: 'es',
	id: 0,
	loaded: false,
	loading: false,
    error: null
}

export const eliminarUsuarioLoading = createAction('[eliminarUsuario] eliminar usuario loading', props<{ lang: string, id: number }>());
export const eliminarUsuarioSuccess = createAction('[eliminarUsuario] eliminar usuario success', props<any>());
export const eliminarUsuarioFail = createAction('[eliminarUsuario] eliminar usuario fail', props<{ payload: any }>());

export const EliminarUsuarioReducer = createReducer(
    EliminarUsuarioInitialState,
    on(eliminarUsuarioLoading, (state, { lang, id }) => ({ ...state, loading: true, loaded: false, lang: lang, id: id }) ),
    on(eliminarUsuarioSuccess, (state, { }) => ({ ...state, loading: false, loaded: true })),
    on(eliminarUsuarioFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class EliminarUsuarioEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadEliminarUsuario$ = createEffect(() => this.actions$.pipe(
        ofType(eliminarUsuarioLoading),
        mergeMap((action) => this.http.delete(environment.apiUrl + action.lang + '/usuario/' + action.id)
            .pipe(
                map((response: any) => eliminarUsuarioSuccess({ response: response })),
                catchError(err => of(eliminarUsuarioFail({ payload: err })))
            )
        )
    ));
}
