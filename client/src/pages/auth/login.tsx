import React,{useState} from 'react';
import axios from '../../helper/data';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/toastContext';

function Login({setLoading}:{setLoading: React.Dispatch<React.SetStateAction<boolean>>}) {
    const[form, setForm] = useState({email:'', password:''});
    const {dispatch}  = useAuth();
    const {showToast} = useToast();
    const navigate = useNavigate();

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setForm((prev)=>({...prev,[e.target.name]: e.target.value}));
    }

    const handleSubmit = async(e:React.FormEvent)=>{
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post("/users/login", form);
            showToast('Login Successful!','success')
            dispatch({type:'LOGIN',payload:{token:res.data.token, user: res.data.user}})
            navigate('/')
        } catch (error:any) {
            showToast(error.response.data.error,'error')
        }
        finally{
            setLoading(false);
        }
    }
    return (
        <form className="form-group" onSubmit={handleSubmit}>
            <h2 className='form-header'>Login </h2>
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