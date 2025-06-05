import React,{useState} from 'react'
import axios from '../../helper/data'
import { useAuth } from '../../contexts/authContext';

function Register() {
    const[form, setForm] = useState({username:'',email:'', password:''});
    const [error, setError] = useState('');
    const{dispatch} = useAuth();

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setForm((prev)=>({...prev,[e.target.name]: e.target.value}));
    }
    
    const handleSubmit = async(e:React.FormEvent)=>{
        e.preventDefault();
        try {
            const res = await axios.post("/users/register", form);
            dispatch({type:'LOGIN',payload:{token:res.data.token}})
            alert('register success');
        } catch (error:any) {
            setError(error.response.data.error)
        }
    }
    return (
        <form className="form-group" onSubmit={handleSubmit}>
                <h2 className='form-header'>Register </h2>
                {error.length>0 && <p className='error'>{error}</p>}
                <label htmlFor='username'>
                    User Name
                </label>
                <input name='username' type='text' id='email' className='form-input' onChange={handleChange}  />
                <label htmlFor="email">
                    Email
                </label>
                <input name='email' type='email' id='email' className='form-input' onChange={handleChange} />
                <label htmlFor="password">
                    Password
                </label>
                <input name='password' type='password' id='password' className='form-input' onChange={handleChange} />
                <button className='login-btn'>Go!</button>
        </form>
    )
}

export default Register