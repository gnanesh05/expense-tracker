import axios from '../helper/data'
import React ,{useEffect,createContext, ReactNode, useContext, useReducer} from 'react'

type User={
    id:string;
    username : string;
    email:string;
    budget:string;
}

type AuthState={
    user: User|null;
    token:string|null;
    isAuthenticated:boolean;
    loading: boolean;
}

type Action= {type:'LOGIN', payload:{token:string, user:User}} | {type:'SET_USER',payload:{user:User}}|
 {type:'LOGOUT'} | {type:'UPDATE_BUDGET', payload:{budget:string}}| { type: 'SET_LOADING', payload: boolean };

const intitalState:AuthState = {
    user : null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: false,
    loading: true, 
}

const authReducer = (state:AuthState, action:Action): AuthState =>{
    switch(action.type){
        case 'LOGIN':
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                loading: false,
            }
        case 'SET_USER':
            return {
                ...state,
                user: action.payload.user,
                isAuthenticated: true,
            }
        case 'LOGOUT':
            localStorage.removeItem('token')
            return intitalState;
        case 'UPDATE_BUDGET':
            if (!state.user) return state;
            return {
                ...state,
                user: {
                ...state.user,
                budget: action.payload.budget,
                },
            };
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload,
            }
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
            const storedToken = state.token || localStorage.getItem("token");
            if (!storedToken){
                dispatch({ type: 'SET_LOADING', payload: false });
                return;
            }

            try{
                const res = await axios.get('/users/current_user',{
                    headers:{
                        'Authorization':`Bearer ${state.token}`
                    },
                });
                dispatch({type:'SET_USER', payload:{user:res.data.user}});
            }
            catch(error){
                dispatch({type:'LOGOUT'});
            }
            finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        }
        fetchUser();
    },[]);

    return (
        <AuthContext.Provider value={{state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}