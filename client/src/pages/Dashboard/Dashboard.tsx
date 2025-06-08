import React from 'react'
import './Dashboard.css'
import UserProfile from '../../components/userProfile'
import ExpenseTable from '../../components/Expense/ExpenseTable'
import { ExpenseProvider } from '../../contexts/expenseContext'
import AddExpense from '../../components/Expense/AddExpense'

function Dashboard() {
  return (
    <ExpenseProvider>
        <div className="expense-dashboard">
          <div className="form-section">
            <AddExpense/>
          </div>
          <div className="transactions-section">
            <ExpenseTable/>
          </div>
      </div>
    </ExpenseProvider>

  )
}

export default Dashboard