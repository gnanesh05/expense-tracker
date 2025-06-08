import { Link } from 'react-router-dom'
import './index.css'

function Navbar() {
  return (
    <div className='navbar'>
      <Link to='/'>Home</Link>
    </div>
  )
}

export default Navbar