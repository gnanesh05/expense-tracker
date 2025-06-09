import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { useToast } from '../../contexts/toastContext';
import './NavBar.css';

export default function Navbar() {
  const { state, dispatch } = useAuth();
  const {showToast} = useToast();
  const navigate = useNavigate();

  const handleSignOut = () => {
    dispatch({ type: 'LOGOUT' });
    showToast('Logout Successful!','success')
    navigate('/auth');
  };

 return (
  <nav className="navbar">
    <div className="navbar-content">
      <div className="navbar-left">
        <Link to="/" className="logo">Expense Tracker</Link>
      </div>
      <div className="navbar-right">
        {state.isAuthenticated ? (
          <>
            <span className="username">{state.user?.username}</span>
            <button className="signout-btn" onClick={handleSignOut}>Sign Out</button>
          </>
        ) : (
          <Link to="/auth" className="signin-link">Sign In</Link>
        )}
      </div>
    </div>
  </nav>
);

}
