import React,{useState} from 'react'
import { useAuth } from '../../contexts/authContext';
import { useExpense } from '../../contexts/expenseContext';
import axios from '../../helper/data'
import './AddExpense.css'

const categories = ['Food', 'Travel', 'Bills', 'Entertainment', 'Groceries', 'Other'];

function AddExpense() {
    const [form, setForm] = useState({category:'',description:'',amount:''});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const {state:userState} = useAuth();
    const {dispatch} = useExpense();
    const handleChange = (name:string, value:string)=>{
        console.log(name, value)
        setForm((prev)=>({...prev, [name]:value}));
    }
    const handleSubmit = async(e: React.FormEvent)=>{
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post("/expenses/", form, {
                headers:{
                    'Authorization' : `Bearer ${userState.token}`
                }
            });
            dispatch({type:'ADD_EXPENSE', payload:{expense:res.data.expense}});
            setForm({category:'',description:'',amount:''})
        } 
         catch (error:any) {
            setError(error.response.data.error)
        }
        finally{
            setLoading(false);
        }
        

    }
    return (
    <form className="expense-form" onSubmit={handleSubmit} >
      <h3>Add Transaction</h3>
        {error.length>0 && <p className='error'>{error}</p>}
      <label>Category</label>
      <select name="category"  onChange={(e)=>handleChange(e.target.name, e.target.value)}
        required>
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <label>Description</label>
      <input
        type="text"
        name="description"
        placeholder="e.g. Grocery shopping"
        value={form.description}
        onChange={(e)=>handleChange(e.target.name, e.target.value)}
        required
      />

      <label>Amount</label>
      <input
        type="number"
        name="amount"
        placeholder="e.g. 1500"
        value={form.amount}
        onChange={(e)=>handleChange(e.target.name, e.target.value)}
        required
      />

      <button type="submit">
        {loading ? 'Adding...' : 'Add'}
      </button>
    </form>
  );
}

export default AddExpense