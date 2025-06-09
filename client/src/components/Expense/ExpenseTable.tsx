import {useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/authContext'
import { useExpense } from '../../contexts/expenseContext'
import { useToast } from '../../contexts/toastContext'
import { useSortedExpenses } from '../../custom-hooks/useSortedExpenses'
import axios from '../../helper/data'
import editIcon from '../../assets/edit.png'
import deleteIcon from '../../assets/delete.png'
import './ExpenseTable.css'

function ExpenseTable() {
    const {state:userState, dispatch:userDispatch} = useAuth();
    const {state: expenseState, dispatch} = useExpense();
    const [budget, setBudget] = useState(userState.user?.budget)
    const [sortField, setSortField] = useState<'category'|'amount'|'timestamp'|null>(null);
    const [sortOrder, setSortOrder] = useState<'asc'|'desc'>('asc');
    const navigate = useNavigate();
    const {showToast} = useToast();

    const sortedExpenses = useSortedExpenses(expenseState.expenses, sortField, sortOrder);

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

    const handleSort = (field:'category'|'amount'|'timestamp'|null)=>{
        if(sortField == field){
            setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
        }
        else{
            setSortField(field);
            setSortOrder('asc')
        }
    }

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
            showToast('Removed selected transaction!','success')
        }  catch (error:any) {
            console.log(error.response.data.error)
            if(error.response.status ==401){
                navigate('/auth')
            }
            showToast('Unable to remove transaction','error')

        }
    }

  if (expenseState.expenses.length === 0) {
    return <p className="empty-text">No transactions to show yet.</p>;
  }

  const isOverBudget = expenseState.total > parseFloat(userState?.user?.budget??'0')
  const updateBudget = async()=>{
    if(parseFloat(budget ?? '0') <1){
        showToast('Budget cannot be zero','error')
        return;
    }
    try {
            await axios.put(`/users/update_budget`,{'budget': budget}, {
                    headers:{
                        'Authorization' : `Bearer ${userState.token}`
                    }
            });
            userDispatch({type:'UPDATE_BUDGET', payload:{budget:budget as string}})
            showToast('Updated Budget!','success')

    } catch (error:any) {
        console.log(error.response.data.error)
        if(error.response.status ==401){
                navigate('/auth');
            }
        showToast('Unable to update budget','error')

    }
  }
  return (
    <div className="transaction-list">
        <div className="budget-details">
            <h3>Latest Transactions</h3>
            <p className={isOverBudget? 'negative' : ''}>Spent - Rs. {expenseState.total}/ {userState?.user?.budget}</p>
            <div className="budget-update">
                <label htmlFor="budget"> Budget (Rs.)</label>
                <div className="budget-controls">
                    <input
                    type="number"
                    min="1"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    name="budget"
                    placeholder="Enter amount in Rs"
                    />
                    <button onClick={updateBudget}>Update</button>
                </div>
            </div>
        </div>
     
      <div className="expense-table-wrapper">
            <table className="expense-table">
                <thead>
                <tr>
                    <th className='expense-table-header' onClick={()=>handleSort('category')}>Category</th>
                    <th >Description</th>
                    <th className='expense-table-header' onClick={()=>handleSort('amount')}>Amount</th>
                    <th className='expense-table-header' onClick={()=>handleSort('timestamp')}>Time</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {sortedExpenses.map((expense) => (
                    <tr key={expense.id}>
                    <td>{expense.category}</td>
                    <td>{expense.description}</td>
                    <td className='negative'>
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
    </div>
  );
}

export default ExpenseTable