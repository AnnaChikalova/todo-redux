import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {
    RequestStatusType,
    setAppErrorAC,
    setAppErrorACType,
    setAppStatusAC,
    setAppStatusACType
} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {fetchTasksTC} from "./tasks-reducer";

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodoActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'all', entityStatus:'idle'}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case 'SET-TODOLISTS':
            return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus:'idle'}))
        case 'CHANGE-TODOLIST-ENTITY-STATUS':
            return state.map(tl=>tl.id===action.id?{...tl, entityStatus:action.entityStatus}:tl)
        case 'CLEAR-TODOS-DATA':
            return []
        default:
            return state
    }
}

// actions
export const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodolistTitleAC = (id: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    id,
    title
} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    id,
    filter
} as const)
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const)
export const  changeTodolistEntityStatusAC = (id:string, entityStatus:RequestStatusType)=>({
    type: 'CHANGE-TODOLIST-ENTITY-STATUS',
    id,
    entityStatus
} as const)
export const  clearTodosDataAC = ()=>({type: 'CLEAR-TODOS-DATA'} as const)

// thunks
export const fetchTodolistsTC = () => {
    return (dispatch: any) => {
        dispatch(setAppStatusAC('loading'))
        todolistsAPI.getTodolists()
            .then((res) => {
                    dispatch(setTodolistsAC(res.data))
                    dispatch(setAppStatusAC('succeeded'))
                return res.data
                }
            )
            .then((todos)=>{
                todos.forEach(tl=> {
                    dispatch(fetchTasksTC(tl.id))
                })
            })
            .catch(err => {
                handleServerNetworkError(err.message, dispatch)
            })
    }
}
export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: Dispatch<TodoActionsType>) => {
        dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
        dispatch(setAppStatusAC('loading'))
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => {
                if (res.data.resultCode ===0){
                    dispatch(removeTodolistAC(todolistId))
                    dispatch(setAppStatusAC('succeeded'))
                } else {
                    handleServerAppError(res.data, dispatch)
                    dispatch(changeTodolistEntityStatusAC(todolistId, 'failed'))
                }
            })
            .catch(err => {
                handleServerNetworkError(err.message, dispatch)
            })
    }
}

export const addTodolistTC = (title: string) => {
    return (dispatch: Dispatch<TodoActionsType>) => {
        dispatch(setAppStatusAC('loading'))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                if (res.data.resultCode ===0) {
                    dispatch(addTodolistAC(res.data.data.item))
                    dispatch(setAppStatusAC('succeeded'))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch(err => {
                handleServerNetworkError(err.message, dispatch)
            })
    }
}

export const changeTodolistTitleTC = (id: string, title: string) => {
    return (dispatch: Dispatch<TodoActionsType>) => {
        dispatch(setAppStatusAC('loading'))
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(changeTodolistTitleAC(id, title))
                    dispatch(setAppStatusAC('succeeded'))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
                })
            .catch(err => {
                handleServerNetworkError(err.message, dispatch)
            })
    }
}

// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
export type ChangeTodolistEntityStatusACType = ReturnType<typeof changeTodolistEntityStatusAC>
export type clearTodosDataACType = ReturnType<typeof clearTodosDataAC>
type TodoActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | SetTodolistsActionType
    |setAppStatusACType
    |setAppErrorACType
    |ChangeTodolistEntityStatusACType
    |clearTodosDataACType
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
