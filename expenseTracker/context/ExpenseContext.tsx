import { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Expense = {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
};

type State = {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
};

const initialState: State = {
  expenses: [],
  loading: false,
  error: null,
};

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'SET_ERROR'; payload: string };

const expenseReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload, error: null };
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload, loading: false, error: null };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload], error: null };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload),
        error: null
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const ExpenseContext = createContext<{
  state: State;
  loadExpenses: () => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
} | null>(null);

export function ExpenseProvider({ children }) {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  const loadExpenses = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const storedExpenses = await AsyncStorage.getItem('expenses');
      if (storedExpenses) {
        const expenses = JSON.parse(storedExpenses);
        dispatch({ type: 'SET_EXPENSES', payload: expenses });
      } else {
        dispatch({ type: 'SET_EXPENSES', payload: [] });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load expenses' });
    }
  };

  const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
    try {
      const newExpense: Expense = {
        ...expenseData,
        id: Date.now().toString(),
      };
      dispatch({ type: 'ADD_EXPENSE', payload: newExpense });
      const updatedExpenses = [...state.expenses, newExpense];
      await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add expense' });
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
      const updatedExpenses = state.expenses.filter(expense => expense.id !== id);
      await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete expense' });
    }
  };

  // Load expenses when the provider mounts
  useEffect(() => {
    loadExpenses();
  }, []);

  return (
    <ExpenseContext.Provider value={{ state, loadExpenses, addExpense, deleteExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
}