import React,{useState} from 'react'
import './index.css'
import money from '../../assets/money.jpg'
import Login from './login'
import Register from './register';

function Auth() {
    const [isLogin, setisLogin] = useState(false);
    return (
        <div className='auth-container'>
            <div className='img-container'>
                <img className='auth-img' src={money} alt='img'/>
                <section>
                    <h1 className="header">
                    Take control of your expenses
                    </h1>
                    <span className='tagline'>
                        Personal budgeting is the secret to financial freedom.
                        Start your journey today.
                    </span>
                </section>
            
            </div>
            <div className="form-container">
               { isLogin ?  <Login/> : <Register/>}
                <p className='navigator'>
                    {isLogin ? "Don't have an account yet?" : "Already have an account?"}
                    <a className='navigator-link' onClick={()=>setisLogin(prev=>!prev)}>
                        {isLogin ? "Register" : "Login"}
                    </a>
                </p>
            </div>
        </div>
    )
}

export default Auth