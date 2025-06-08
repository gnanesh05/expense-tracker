import React,{useState} from 'react';
import axios from '../../helper/data';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';

function Login({setLoading}:{setLoading: React.Dispatch<React.SetStateAction<boolean>>}) {
    const[form, setForm] = useState({email:'', password:''});
    const [error, setError] = useState('');
    const {dispatch}  = useAuth();
    const navigate = useNavigate();

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setForm((prev)=>({...prev,[e.target.name]: e.target.value}));
    }

    const handleSubmit = async(e:React.FormEvent)=>{
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post("/users/login", form);
            dispatch({type:'LOGIN',payload:{token:res.data.token, user: res.data.user}})
            navigate('/')
            setError('')
        } catch (error:any) {
            setError(error.response.data.error)
        }
        finally{
            setLoading(false);
        }
    }
    return (
        <form className="form-group" onSubmit={handleSubmit}>
            <h2 className='form-header'>Login </h2>
            {error.length>0 && <p className='error'>{error}</p>}
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

export default Login