import { ActionReducerMap } from '@ngrx/store';
import { ActualizarNegocioEffects, ActualizarNegocioReducer, ActualizarNegocioState } from './actualizarNegocio.store';
import { CrearNegocioEffects, CrearNegocioReducer, CrearNegocioState } from './crearNegocio.store';
import { EliminarNegocioEffects, EliminarNegocioReducer, EliminarNegocioState } from './eliminarNegocio.store';
import { ObtenerNegociosEffects, ObtenerNegociosReducer, ObtenerNegociosState } from './obtenerNegocios.store';
 
export interface AppState {
    crearNegocio: CrearNegocioState,
    obtenerNegocios: ObtenerNegociosState,
    actualizarNegocio: ActualizarNegocioState,
    eliminarNegocio: EliminarNegocioState
}

export const appReducers: ActionReducerMap<AppState> = {
    crearNegocio: CrearNegocioReducer,
    obtenerNegocios: ObtenerNegociosReducer,
    actualizarNegocio: ActualizarNegocioReducer,
    eliminarNegocio: EliminarNegocioReducer
}

export const EffectsArray: any[] = [
    CrearNegocioEffects,
    ObtenerNegociosEffects,
    ActualizarNegocioEffects,
    EliminarNegocioEffects
];
