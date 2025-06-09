import { render, screen } from '@testing-library/react';
import { test, expect, describe } from 'vitest'
import { BrowserRouter as Router } from 'react-router-dom';
import { ExpenseProvider } from '../../contexts/expenseContext';
import Dashboard from './Dashboard';


describe('Renders Auth component',async()=>{
    const app = (
        <ExpenseProvider>
            <Router>
                <Dashboard/>
            </Router>
        </ExpenseProvider>
    )
    test('renders AddExpense on left',async()=>{
        render(app)
        expect(screen.getByTestId('AddExpense')).toBeInTheDocument();
    })

     test('renders ExpenseTable on the right',async()=>{
        render(app)
        expect(screen.getByTestId('ExpenseTable')).toBeInTheDocument();
    })
})