import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Auth from './pages/auth'
import Dashboard from './pages/Dashboard'
import Navbar from './components/navbar'
import Footer from './components/footer'

function App() {
  return (
    <Router>
        <div className='app-container'>
          {/* <Navbar/> */}
          <Routes>
            <Route path='/' element={<Dashboard/>} />
            <Route path='/auth' element={<Auth/>} />
          </Routes>
          <Footer/>
        </div>
    </Router>
   
  )
}

export default App
