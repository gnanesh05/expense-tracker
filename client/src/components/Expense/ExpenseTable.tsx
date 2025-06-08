import React, {useEffect} from 'react'
import { useAuth } from '../../contexts/authContext'
import { useExpense } from '../../contexts/expenseContext'
import axios from '../../helper/data'
import editIcon from '../../assets/edit.png'
import deleteIcon from '../../assets/delete.png'
import './ExpenseTable.css'

function ExpenseTable() {
    const {state:userState} = useAuth();
    const {state: expenseState, dispatch} = useExpense();
    useEffect(()=>{
        const fetchExpenses = async()=>{
            const res = await axios.get('/expenses/', {
                headers:{
                    'Authorization' : `Bearer ${userState.token}`
                }
            });
            dispatch({type:'FETCH_EXPENSES', payload:{expenses:res.data.expenses}});
        }
        fetchExpenses();
    },[]);

    const handleEdit = (id:string)=>{
        const selectedExpense = expenseState.expenses.find((item)=>item.id === id);
        if(selectedExpense){
            dispatch({type:'SET_SELECTED_EXPENSE',payload:{expense:selectedExpense}})
        }
    }

    const handleDelete = async(id:string)=>{
        try {
            await axios.delete(`/expenses/?id=${id}`,{
                headers:{
                    'Authorization' : `Bearer ${userState.token}`
                }
            });
            dispatch({type:'REMOVE_EXPENSE', payload:{id:id}});
        }  catch (error:any) {
            console.log(error.response.data.error)
        }
    }

  if (expenseState.expenses.length === 0) {
    return <p className="empty-text">No transactions to show yet.</p>;
  }

  return (
    <div className="transaction-list">
        <div className="budget-details">
            <h3>Latest Transactions</h3>
            <p>Spent - Rs. {expenseState.total}/ {userState?.user?.budget}</p>
        </div>
     
      <table className="expense-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenseState.expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{expense.category}</td>
              <td>{expense.description}</td>
              <td className={parseFloat(expense.amount) < 0 ? 'negative' : 'positive'}>
                ₹{Math.abs(parseFloat(expense.amount))}
              </td>
              <td>{new Date(expense.timestamp).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
              <td>
                <button className="edit-btn" onClick={()=>handleEdit(expense.id)} ><img src={editIcon} alt='edit'/></button>
                <button className="delete-btn" onClick={()=>handleDelete(expense.id)}><img src={deleteIcon} alt='edit'/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpenseTable