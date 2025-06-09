import './UserProfile.css'
import { useAuth } from '../../contexts/authContext'
import profile from '../../assets/profile.png'

function UserProfile() {
    const {state} = useAuth();

  return (
    <div className='user-profile'>
        <img className='user-img' src={profile} alt="image" />
        <div className='user-details'>
            <span>{state.user?.username}</span>
            <span>{state.user?.email}</span>
        </div>
        <div className='budget-form'>
            <span>Update your budget</span>
            <input className='budget-input' type="budget" />
            <button className='btn'>Update</button>
        </div>
    </div>
  )
}

export default UserProfile