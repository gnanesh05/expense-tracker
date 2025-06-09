import React ,{createContext, ReactNode, useContext, useReducer} from 'react'

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
    selectedExpense: Expense | null,
}

type Action = {type:'FETCH_EXPENSES', payload:{expenses:[]}} | {type:'ADD_EXPENSE', payload:{expense:Expense}} 
| {type:'UPDATE_EXPENSE',payload:{expense:Expense}} | {type:'REMOVE_EXPENSE',payload:{id:string}} | {type:'SET_SELECTED_EXPENSE', payload:{expense:Expense|null}}

const initialState: ExpenseState = {
    expenses : [],
    total : 0,
    selectedExpense: null,
}

const calculateTotal = (expenses:Expense[]):number=>{
    return expenses.reduce((acc:number, item:Expense) : number=>{
        acc+=parseFloat(item.amount);
        return acc;
    },0)
}
const expenseReducer = (state: ExpenseState,action:Action): ExpenseState =>{
    let newExpenses = []
    switch(action.type){
        case 'FETCH_EXPENSES':
            return {
                ...state,
                expenses : action.payload.expenses,
                total : calculateTotal(action.payload.expenses),
            }
        case 'ADD_EXPENSE':
            newExpenses = [...state.expenses, action.payload.expense]
            return{
                ...state,
                expenses : newExpenses,
                total : calculateTotal(newExpenses)
            }
        case 'UPDATE_EXPENSE':
            newExpenses = state.expenses.map((item)=>{
                    if(item.id === action.payload.expense.id){
                        return action.payload.expense
                    }
                    return item
                });
            return {
                ...state,
                expenses: newExpenses,
                total : calculateTotal(newExpenses)
            }
        case 'REMOVE_EXPENSE':
            newExpenses = state.expenses.filter((item)=>item.id !== action.payload.id);
            return {
                ...state,
                expenses : newExpenses,
                total: calculateTotal(newExpenses)
            }
        case 'SET_SELECTED_EXPENSE':
            return{
                ...state,
                selectedExpense : action.payload.expense
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
