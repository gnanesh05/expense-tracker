import React,{useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { useExpense } from '../../contexts/expenseContext';
import { useToast } from '../../contexts/toastContext';
import axios from '../../helper/data'
import './AddExpense.css'

const categories = ['Food', 'Travel', 'Bills', 'Entertainment', 'Groceries', 'Other'];

function AddExpense() {
    const [form, setForm] = useState({category:'',description:'',amount:''});
    const [loading, setLoading] = useState(false);
    const {state:userState} = useAuth();
    const {state:expenseState, dispatch} = useExpense();
    const navigate = useNavigate();
    const {showToast} = useToast();
    const isEditing = !!expenseState.selectedExpense;

    useEffect(()=>{
        if(expenseState.selectedExpense){
            setForm(expenseState.selectedExpense)
        }
    },[expenseState.selectedExpense]);

    const handleChange = (name:string, value:string)=>{
        setForm((prev)=>({...prev, [name]:value}));
    }
    const handleSubmit = async(e: React.FormEvent)=>{
        e.preventDefault();
        if(parseFloat(form.amount)<1){
          showToast("Amount must be greater than 0",'error')
          return;
        }
        setLoading(true);
        try {
            if(!isEditing){
                 const res = await axios.post("/expenses/", form, {
                    headers:{
                        'Authorization' : `Bearer ${userState.token}`
                    }
                });
                dispatch({type:'ADD_EXPENSE', payload:{expense:res.data.expense}});
                showToast('Added new transaction!','success');
                setForm({category:'',description:'',amount:''})
            }
            else{
                 const res = await axios.put(`/expenses/?id=${expenseState.selectedExpense?.id}`, form, {
                    headers:{
                        'Authorization' : `Bearer ${userState.token}`
                    }
                });
                dispatch({type:'UPDATE_EXPENSE', payload:{expense:res.data.expense}});
                showToast('Updated transaction!','success');
                setForm({category:'',description:'',amount:''})
                dispatch({type:'SET_SELECTED_EXPENSE', payload:{expense:null}})
            }
           
        } 
         catch (error:any) {
             if(error.response.status ==401){
                navigate('/auth')
            }
            showToast(error.response.data.error,'success');
        }
        finally{
            setLoading(false);
        }
        

    }
    return (
    <form className="expense-form" onSubmit={handleSubmit} >
      <h3>{isEditing ? "Edit": "Add"} Transaction</h3>
      <label>Category</label>
      <select name="category" value={form.category} onChange={(e)=>handleChange(e.target.name, e.target.value)}
        required>
        <option value=''>Select Category</option>
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

      <label>Amount(Rs)</label>
      <input
        type="number"
        name="amount"
        min='1'
        placeholder="e.g. 1500"
        value={form.amount}
        onChange={(e)=>handleChange(e.target.name, e.target.value)}
        required
      />

      <button type="submit">
        {loading ? 'Adding...' : isEditing ? "Update": "Add"}
      </button>
    </form>
  );
}

export default AddExpense