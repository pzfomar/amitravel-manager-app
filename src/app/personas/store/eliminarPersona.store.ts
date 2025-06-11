import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export interface EliminarPersonaState {
	lang: string,
	id: number,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const EliminarPersonaInitialState: EliminarPersonaState = {
	lang: 'es',
	id: 0,
	loaded: false,
	loading: false,
    error: null
}

export const eliminarPersonaLoading = createAction('[eliminarPersona] eliminar persona loading', props<{ lang: string, id: number }>());
export const eliminarPersonaSuccess = createAction('[eliminarPersona] eliminar persona success', props<any>());
export const eliminarPersonaFail = createAction('[eliminarPersona] eliminar persona fail', props<{ payload: any }>());

export const EliminarPersonaReducer = createReducer(
    EliminarPersonaInitialState,
    on(eliminarPersonaLoading, (state, { lang, id }) => ({ ...state, loading: true, loaded: false, lang: lang, id: id }) ),
    on(eliminarPersonaSuccess, (state, { }) => ({ ...state, loading: false, loaded: true })),
    on(eliminarPersonaFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class EliminarPersonaEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadEliminarPersona$ = createEffect(() => this.actions$.pipe(
        ofType(eliminarPersonaLoading),
        mergeMap((action) => this.http.delete(environment.apiUrl + action.lang + '/persona/' + action.id)
            .pipe(
                map((response: any) => eliminarPersonaSuccess({ response: response })),
                catchError(err => of(eliminarPersonaFail({ payload: err })))
            )
        )
    ));
}
