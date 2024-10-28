import { ActionReducerMap } from '@ngrx/store';
import { ActualizarUsuarioEffects, ActualizarUsuarioReducer, ActualizarUsuarioState } from './actualizarUsuario.store';
import { CrearUsuarioEffects, CrearUsuarioReducer, CrearUsuarioState } from './crearUsuario.store';
import { EliminarUsuarioEffects, EliminarUsuarioReducer, EliminarUsuarioState } from './eliminarUsuario.store';
import { ObtenerUsuariosEffects, ObtenerUsuariosReducer, ObtenerUsuariosState } from './obtenerUsuarios.store';
import { ListaNegociosEffects, ListaNegociosReducer, ListaNegociosState } from './listaNegocios.store';

export interface AppState {
    crearUsuario: CrearUsuarioState,
    obtenerUsuarios: ObtenerUsuariosState,
    actualizarUsuario: ActualizarUsuarioState,
    eliminarUsuario: EliminarUsuarioState,
    listaNegocios: ListaNegociosState,
}

export const appReducers: ActionReducerMap<AppState> = {
    crearUsuario: CrearUsuarioReducer,
    obtenerUsuarios: ObtenerUsuariosReducer,
    actualizarUsuario: ActualizarUsuarioReducer,
    eliminarUsuario: EliminarUsuarioReducer,
    listaNegocios: ListaNegociosReducer,
}

export const EffectsArray: any[] = [
    CrearUsuarioEffects,
    ObtenerUsuariosEffects,
    ActualizarUsuarioEffects,
    EliminarUsuarioEffects,
    ListaNegociosEffects,
];
