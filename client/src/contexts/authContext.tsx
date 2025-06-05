import axios from '../helper/data'
import React ,{useEffect,createContext, ReactNode, useContext, useReducer} from 'react'

type User={
    id:string;
    username : string;
    email:string;
}

type AuthState={
    user: User|null;
    token:string|null;
    isAuthenticated:boolean;
}

type Action= {type:'LOGIN', payload:{token:string}} | {type:'SET_USER',payload:{user:User}}| {type:'LOGOUT'};

const intitalState:AuthState = {
    user : null,
    token: null,
    isAuthenticated: false
}

const authReducer = (state:AuthState, action:Action): AuthState =>{
    switch(action.type){
        case 'LOGIN':
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                token: action.payload.token,
                isAuthenticated: false,
            }
        case 'SET_USER':
            return {
                ...state,
                user: action.payload.user,
            }
        case 'LOGOUT':
            return intitalState;
        default:
            return state;
    }
}

const AuthContext = createContext<{
    state: AuthState,
    dispatch: React.Dispatch<Action>;
}>({state:intitalState,dispatch:()=>{}});

export const useAuth = ()=>useContext(AuthContext);

export const AuthProvider = ({children}:{children: ReactNode}) =>{
    const [state, dispatch] = useReducer(authReducer, intitalState);

    useEffect(()=>{
        const fetchUser = async()=>{
            if(!state.token){
                return;
            }
            try{
                const res = await axios.get('/users/current_user',{
                    headers:{
                        'Authorization':`Bearer ${state.token}`
                    },
                });
                dispatch({type:'SET_USER', payload:{user:res.data}});
            }
            catch(error){
                dispatch({type:'LOGOUT'});
            }
        }
        fetchUser();
    },[state.token]);

    return (
        <AuthContext.Provider value={{state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}