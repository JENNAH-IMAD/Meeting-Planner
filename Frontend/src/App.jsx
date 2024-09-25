import { useState } from 'react'
import './App.css'

import HeaderComponent from './components/Page/HeaderComponent'

import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'



import { isUserLoggedIn } from './services/AuthService'
import ListRooms from './components/room/ListRoom'
import AddRoom from './components/room/AddRoom'
import Login from './components/Login'
import Register from './components/Register'
import HomePage from './components/Page/HomePage'

import AddUser from './components/User/AddUser'
import Scheduler from './components/Page/Scheduler '
import ListUser from './components/user/ListUser'

import ListReservation from './components/reservation/ListReservation'
import AddReservation from './components/reservation/AddReservation'


function App() {

  function AuthenticatedRoute({children}){

    const isAuth = isUserLoggedIn();

    if(isAuth) {
      return children;
    }

    return <Navigate to="/" />

  }

  return (
    <>
    <BrowserRouter>
        <HeaderComponent />
          <Routes>
              {/* http://localhost:8080 */}
              <Route path='/' element = { <HomePage /> }></Route>
               {/* http://localhost:8080/todos */}

              {/* http://localhost:8080/add-todo */}




              <Route path='/Login' element = { <Login /> }></Route>
              <Route path='/Register' element = { <Register /> }></Route>
              

              <Route path='/ListRooms' element = {
                <AuthenticatedRoute>
                <ListRooms/>
                </AuthenticatedRoute>
              }></Route>
                <Route path='/Scheduler' element = {
                <AuthenticatedRoute>
                <Scheduler/>
                </AuthenticatedRoute>
              }></Route>
              <Route path='/ListUser' element = {
                <AuthenticatedRoute>
                <ListUser/>
                </AuthenticatedRoute>
              }></Route>
                <Route path='/ListReservation' element = {
                <AuthenticatedRoute>
                <ListReservation/>
                </AuthenticatedRoute>
              }></Route>
                <Route path='/AddReservation' element = {
                <AuthenticatedRoute>
                <AddReservation/>
                </AuthenticatedRoute>
              }></Route>

              <Route path='/AddRoom' element = {
                <AuthenticatedRoute>
                <AddRoom/>
                </AuthenticatedRoute>
              }></Route>
              <Route path='/AddUser' element = {
                <AuthenticatedRoute>
                <AddUser/>
                </AuthenticatedRoute>
              }></Route>

          </Routes>
        
        </BrowserRouter>
    </>
  )
}

export default App
