import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import './Dashboard.css';

const Dashboard = () => {
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

            {/* Budget Section */}
            <div className="overview-container">
                <h2>Set Budgets</h2>
                {['Credit', 'Debit', 'Savings'].map((acc) => (
                    <div key={acc}>
                        <label>{acc} Budget:</label>
                        <input
                            type="number"
                            value={budgets[acc]}
                            onChange={(e) =>
                                setBudgets({ ...budgets, [acc]: parseFloat(e.target.value) || 0 })
                            }
                        />
                        <p>
                            <strong>Spent:</strong> ₹{(spent[acc] || 0).toLocaleString('en-IN')} | 
                            <strong> Left:</strong> ₹{(budgets[acc] - (spent[acc] || 0)).toLocaleString('en-IN')}
                        </p>
                        {spent[acc] > budgets[acc] && (
                            <p style={{ color: 'red' }}>⚠️ Budget exceeded for {acc}!</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Add/Edit Expense Form */}
            <div className="add-expense-container">
                <h3>{editIndex !== null ? 'Edit Expense' : 'Add Expense'}</h3>
                <label>Category:</label>
                <select value={category} onChange={handleCategoryChange}>
                    <option value="">Select</option>
                    {Object.keys(categoryToSubcategories).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <label>Subcategory:</label>
                <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)}>
                    <option value="">Select</option>
                    {availableSubcategories.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                    ))}
                </select>

                <label>Amount:</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />

                <label>Date:</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

                <label>Account Type:</label>
                <select value={account} onChange={(e) => setAccount(e.target.value)}>
                    <option value="">Select</option>
                    <option value="Credit">Credit</option>
                    <option value="Debit">Debit</option>
                    <option value="Savings">Savings</option>
                </select>

                <label>Details:</label>
                <input type="text" value={details} onChange={(e) => setDetails(e.target.value)} />

                <button onClick={handleAddOrUpdateTransaction}>
                    {editIndex !== null ? 'Update Expense' : 'Add Expense'}
                </button>
            </div>

            {/* Transactions Table */}
            <div className="transactions-container">
                <h2>Transactions</h2>
                <table className="transactions-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Subcategory</th>
                            <th>Category</th>
                            <th>Account</th>
                            <th>Details</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction, index) => (
                            <tr key={index}>
                                <td>{transaction.date}</td>
                                <td>₹{transaction.amount.toLocaleString('en-IN')}</td>
                                <td>{transaction.subcategory}</td>
                                <td>{transaction.category}</td>
                                <td>{transaction.account}</td>
                                <td>{transaction.details}</td>
                                <td>
                                    <button onClick={() => handleEditTransaction(index)}>✏️ Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Spending Breakdown Chart */}
            <div className="chart-box">
                <h3>Spending Breakdown</h3>
                <Doughnut data={chartData} />
            </div>
        </div>
    );
};

export default Dashboard;
