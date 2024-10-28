import { ActionReducerMap } from '@ngrx/store';
import { ActualizarPersonaEffects, ActualizarPersonaReducer, ActualizarPersonaState } from './actualizarPersona.store';
import { CrearPersonaEffects, CrearPersonaReducer, CrearPersonaState } from './crearPersona.store';
import { EliminarPersonaEffects, EliminarPersonaReducer, EliminarPersonaState } from './eliminarPersona.store';
import { ObtenerPersonasEffects, ObtenerPersonasReducer, ObtenerPersonasState } from './obtenerPersonas.store';
import { ListaUsuariosEffects, ListaUsuariosReducer, ListaUsuariosState } from './listaUsuarios.store';

export interface AppState {
    crearPersona: CrearPersonaState,
    obtenerPersonas: ObtenerPersonasState,
    actualizarPersona: ActualizarPersonaState,
    eliminarPersona: EliminarPersonaState
    listaUsuarios: ListaUsuariosState
}

export const appReducers: ActionReducerMap<AppState> = {
    crearPersona: CrearPersonaReducer,
    obtenerPersonas: ObtenerPersonasReducer,
    actualizarPersona: ActualizarPersonaReducer,
    eliminarPersona: EliminarPersonaReducer,
    listaUsuarios: ListaUsuariosReducer
}

export const EffectsArray: any[] = [
    CrearPersonaEffects,
    ObtenerPersonasEffects,
    ActualizarPersonaEffects,
    EliminarPersonaEffects,
    ListaUsuariosEffects
];
