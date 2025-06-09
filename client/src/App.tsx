
import React,{lazy, Suspense} from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'

import Navbar from './components/navbar/NavBar'
import Footer from './components/footer/Footer'
import PrivateRoute from './components/PrivateRoute/PrivateRoute'
import { useAuth } from './contexts/authContext'

const Auth = lazy(()=>import('./pages/auth/Auth'));
const Dashboard = lazy(()=>import('./pages/Dashboard/Dashboard'))

function App() {
  const {state} = useAuth();
  return (
    <Router>
        <Navbar/>
        <div className='app-container'>
          <Suspense fallback={<>Loading</>}>
            <Routes>
              <Route path='/auth' element={<Auth/>} />
              
              <Route path='/' element = {
                <PrivateRoute isAuthenticated={state.isAuthenticated} loading={state.loading}>
                    <Dashboard/>
                </PrivateRoute>
              } />
            </Routes>
          </Suspense>
        </div>
        <Footer/>
    </Router>
   
  )
}

export default App
