import { render, screen } from '@testing-library/react';
import { test, expect, describe } from 'vitest'
import { BrowserRouter as Router } from 'react-router-dom';
import Auth from './Auth';


describe('Renders Auth component',async()=>{
    test('renders header on left',async()=>{
        render(
            <Router>
                 <Auth/>
            </Router>)
        expect(screen.getByText('Take control of your expenses')).toBeInTheDocument();
    })

     test('renders Form on the right',async()=>{
        render(
            <Router>
                 <Auth/>
            </Router>)
        expect(screen.getByTestId('form-container')).toBeInTheDocument();
    })
})