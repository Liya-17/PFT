import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            navigate('/login');
        }
    }, [navigate]);

    const [budgets, setBudgets] = useState(() => {
        return localStorage.getItem("budgets") 
            ? JSON.parse(localStorage.getItem("budgets")) 
            : { Credit: 10000, Debit: 10000, Savings: 5000 };
    });

    const [transactions, setTransactions] = useState(() => {
        return localStorage.getItem("transactions") 
            ? JSON.parse(localStorage.getItem("transactions")) 
            : [];
    });

    const calculateSpent = () => {
        const spentAmounts = { Credit: 0, Debit: 0, Savings: 0 };
        transactions.forEach(({ account, amount }) => {
            spentAmounts[account] += parseFloat(amount);
        });
        return spentAmounts;
    };

    const [spent, setSpent] = useState(calculateSpent);
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [account, setAccount] = useState('');
    const [details, setDetails] = useState('');
    const [availableSubcategories, setAvailableSubcategories] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    const categoryToSubcategories = {
        Food: ['Groceries', 'Restaurants', 'Coffee', 'Fast Food'],
        Transport: ['Bus', 'Train', 'Taxi', 'Fuel', 'Parking'],
        Shopping: ['Clothing', 'Electronics', 'Accessories', 'Home Decor'],
        Health: ['Medicine', 'Doctor Visits', 'Gym Membership'],
        Entertainment: ['Movies', 'Music', 'Gaming', 'Events'],
        Utilities: ['Electricity', 'Water', 'Internet', 'Gas'],
        Education: ['Books', 'Tuition', 'Courses', 'Stationery'],
        Others: ['Gifts', 'Donations', 'Miscellaneous']
    };

    useEffect(() => {
        localStorage.setItem("transactions", JSON.stringify(transactions));
        setSpent(calculateSpent());
    }, [transactions]);

    useEffect(() => {
        localStorage.setItem("budgets", JSON.stringify(budgets));
    }, [budgets]);

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setCategory(selectedCategory);
        setAvailableSubcategories(categoryToSubcategories[selectedCategory] || []);
        setSubcategory('');
    };

    const handleAddOrUpdateTransaction = () => {
        if (!amount || !category || !date || !subcategory || !account) {
            alert("Please fill all required fields.");
            return;
        }

        const newTransaction = {
            date,
            amount: parseFloat(amount),
            category,
            subcategory,
            account,
            details
        };

        if (editIndex !== null) {
            const updatedTransactions = [...transactions];
            updatedTransactions[editIndex] = newTransaction;
            setTransactions(updatedTransactions);
            setEditIndex(null);
        } else {
            setTransactions([...transactions, newTransaction]);
        }

        resetForm();
    };

    const resetForm = () => {
        setAmount('');
        setDate('');
        setAccount('');
        setDetails('');
        setCategory('');
        setSubcategory('');
        setEditIndex(null);
    };

    const handleEditTransaction = (index) => {
        const transaction = transactions[index];
        setCategory(transaction.category);
        setSubcategory(transaction.subcategory);
        setAmount(transaction.amount);
        setDate(transaction.date);
        setAccount(transaction.account);
        setDetails(transaction.details);
        setAvailableSubcategories(categoryToSubcategories[transaction.category] || []);
        setEditIndex(index);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Chart Data
    const chartData = {
        labels: transactions.map(t => t.category),
        datasets: [{
            data: transactions.map(t => t.amount),
            backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#8e44ad', '#27ae60', '#f39c12', '#d35400', '#2980b9']
        }]
    };

    return (
        <div className="dashboard-container">
            <h1>Expense Tracker</h1>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
            {/* Existing UI Components Remain Unchanged */}
        </div>
    );
};

export default Dashboard;
