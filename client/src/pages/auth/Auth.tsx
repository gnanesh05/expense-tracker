import React,{useState} from 'react'
import './Auth.css'
import money from '../../assets/money.jpg'
import Login from './login'
import Register from './register';
import Spinner from '../../components/Spinner/Spinner';

function Auth() {
    const [isLogin, setisLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
               { isLogin ?  <Login setLoading={setIsLoading}/> : <Register setLoading={setIsLoading}/>}
                <p className='navigator'>
                    {isLogin ? "Don't have an account yet?" : "Already have an account?"}
                    <a className='navigator-link' onClick={()=>setisLogin(prev=>!prev)}>
                        {isLogin ? "Register" : "Login"}
                    </a>
                </p>
                {isLoading && <Spinner loading={isLoading}/>}
            </div>
        </div>
    )
}

export default Auth