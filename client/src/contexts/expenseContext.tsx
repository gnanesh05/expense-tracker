import axios from '../helper/data'
import React ,{useEffect,createContext, ReactNode, useContext, useReducer} from 'react'

type Expense = {
    id:string,
    user_id: string,
    category : string,
    description: string,
    amount: string,
    timestamp: string
}

type ExpenseState = {
    expenses : Expense[],
    total : number,
}

type Action = {type:'FETCH_EXPENSES', payload:{expenses:[]}} | {type:'ADD_EXPENSE', payload:{expense:Expense}} 
| {type:'UPDATE_EXPENSE',payload:{expense:Expense}} | {type:'REMOVE_EXPENSE',payload:{id:string}}

const initialState: ExpenseState = {
    expenses : [],
    total : 0,
}

const calculateTotal = (expenses:Expense[]):number=>{
    return expenses.reduce((acc:number, item:Expense) : number=>{
        acc+=parseFloat(item.amount);
        return acc;
    },0)
}
const expenseReducer = (state: ExpenseState,action:Action): ExpenseState =>{
    switch(action.type){
        case 'FETCH_EXPENSES':
            return {
                ...state,
                expenses : action.payload.expenses,
                total : calculateTotal(action.payload.expenses),
            }
        case 'ADD_EXPENSE':
            return{
                ...state,
                expenses : [...state.expenses, action.payload.expense],
                total : state.total + parseFloat(action.payload.expense.amount)
            }
        case 'UPDATE_EXPENSE':
            return {
                ...state,
                expenses: state.expenses.map((item)=>{
                    if(item.id === action.payload.expense.id){
                        return action.payload.expense
                    }
                    return item
                })
            }
        case 'REMOVE_EXPENSE':
            return {
                ...state,
                expenses : state.expenses.filter((item)=>item.id !== action.payload.id)
            }
        default:
            return state
    }
}

const ExpenseContext =  createContext<{
    state: ExpenseState,
    dispatch: React.Dispatch<Action>;
}>({state:initialState,dispatch:()=>{}});


export const useExpense = ()=>useContext(ExpenseContext);

export const ExpenseProvider = ({children}:{children: ReactNode})=>{
    const [state, dispatch] = useReducer(expenseReducer, initialState);

    return <ExpenseContext.Provider  value={{state, dispatch}}>{children}</ExpenseContext.Provider>
}
