import { useMemo } from 'react';

type Expense = {
  id: string;
  category: string;
  description: string;
  amount: string;
  timestamp: string;
};

type SortField = 'category' | 'amount' | 'timestamp' | null;
type SortOrder = 'asc' | 'desc';

export function useSortedExpenses(expenses: Expense[], sortField:SortField, sortOrder:SortOrder){
    return useMemo(()=>{
        if(!sortField){
            return expenses;
        }

        return [...expenses].sort((a,b)=>{
            const valueA = a[sortField];
            const valueB = b[sortField];

            if(sortField == 'timestamp'){
                return sortOrder == 'asc' ? new Date(valueA).getTime() - new Date(valueB).getTime() 
                : new Date(valueB).getTime() - new Date(valueA).getTime();
            }
            if(sortField == 'amount'){
                return sortOrder == 'asc' ? parseFloat(valueA) - parseFloat(valueB) : parseFloat(valueB) - parseFloat(valueA);
            }

            return sortOrder =='asc' ? String(valueA).localeCompare(String(valueB)) : String(valueB).localeCompare(String(valueA));
        });

    },[expenses, sortField, sortOrder]);
}