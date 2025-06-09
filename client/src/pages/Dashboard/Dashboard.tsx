import './Dashboard.css'
import ExpenseTable from '../../components/Expense/ExpenseTable'
import { ExpenseProvider } from '../../contexts/expenseContext'
import AddExpense from '../../components/Expense/AddExpense'

function Dashboard() {
  return (
    <ExpenseProvider>
        <div className="expense-dashboard">
          <div className="form-section" data-testid='AddExpense'>
            <AddExpense/>
          </div>
          <div className="transactions-section" data-testid='ExpenseTable'>
            <ExpenseTable/>
          </div>
      </div>
    </ExpenseProvider>

  )
}

export default Dashboard