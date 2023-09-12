//app-reducer.tsx

// если status === loading показываем крутилку
// если status === 'idle'| 'succeeded' | 'failed' не показываем крутилку

import {Dispatch} from "redux";
import {authAPI} from "../api/todolists-api";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'


const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as null | string,
    isInitialized: false
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/SET-INITIALIZED' :
            return {...state, isInitialized: action.isInitialized}
        default:
            return state
    }

}
export type setAppStatusACType = ReturnType<typeof setAppStatusAC>
export const setAppStatusAC=(status:RequestStatusType)=>({
    type:'APP/SET-STATUS',
    status
} as const)
export type setAppErrorACType = ReturnType<typeof setAppErrorAC>
export const setAppErrorAC = (error: null | string)=>({
    type: 'APP/SET-ERROR',
    error
} as const)
export const setIsInitializedAC = (isInitialized: boolean) =>({
    type:'APP/SET-INITIALIZED',
    isInitialized
} as const)
export type setIsInitializedACType = ReturnType<typeof setIsInitializedAC>

 export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me()
        .then(res => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true));
        } else {
            handleServerAppError(res.data, dispatch)
        }
    })
        .catch(err=>{
            handleServerNetworkError(err.message, dispatch)
        })
        .finally(()=>{
            dispatch(setIsInitializedAC(true))
        })
}


export type AppActionsType = setAppStatusACType
                      | setAppErrorACType
                      | setIsInitializedACType
