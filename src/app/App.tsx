import React, {useEffect} from 'react'
import './App.css'
import { TodolistsList } from '../features/TodolistsList/TodolistsList'

// You can learn about the difference by reading this guide on minimizing bundle size.
// https://mui.com/guides/minimizing-bundle-size/
// import { AppBar, Button, Container, IconButton, Toolbar, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { Menu } from '@mui/icons-material';
import {CircularProgress, LinearProgress} from "@mui/material";
import {useAppDispatch, useAppSelector} from "./store";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {Navigate, Route, Routes } from 'react-router-dom';
import { Login } from '../features/Login/Login';
import {initializeAppTC} from "./app-reducer";
import {logoutTC} from "../features/Login/auth-reducer";


function App() {
    const dispatch= useAppDispatch()
    const status = useAppSelector(state=>state.app.status)
    const isInitialized = useAppSelector(state=>state.app.isInitialized)
    const isLoggedIn = useAppSelector(state=>state.auth.isLoggedIn)
    useEffect(()=>{
        dispatch(initializeAppTC())
    })
    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

   const logoutHandler = ()=>{
        dispatch(logoutTC())
   }
    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>

                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        TODO
                    </Typography>
                    {isLoggedIn &&
                    <Button color="inherit" onClick={logoutHandler}>Logout</Button>}
                </Toolbar>
            </AppBar>
            {status==='loading' &&  <LinearProgress color="secondary" /> }
            <Container fixed>
                <Routes>
                    <Route path = '/' element = {<TodolistsList/>}/>
                    <Route path = '/login' element = {<Login/>}/>
                    <Route path='/404' element={<h1>404: PAGE NOT FOUND</h1>}/>
                    <Route path='*' element={<Navigate to={'/404'}/>}/>
                </Routes>
            </Container>
            <ErrorSnackbar/>
        </div>
    )
}

export default App
