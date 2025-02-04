import React, { useContext, useState, useEffect } from 'react';
import './App.css';
import { KeycloakContext } from './KeycloakContext';

const BACKEND_URL = process.env.BACKEND_URL || "https://backend-demo-rhbk.apps.i7mvwf9w.eastus.aroapp.io"

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const { keycloak, isAuthenticated } = useContext(KeycloakContext);
    
    // Fetch tasks from the backend
    useEffect(() => {
        fetch(BACKEND_URL + '/api/tasks')
            .then((res) => res.json())
            .then((data) => setTasks(data))
            .catch((err) => console.error(err));
    }, [isAuthenticated]);

    // Add a new task
    const addTask = () => {
        if (newTask.trim()) {
            fetch(BACKEND_URL + '/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: newTask }),
            })
                .then((res) => res.json())
                .then((task) => setTasks([...tasks, task]))
                .catch((err) => console.error(err));
            setNewTask('');
        }
    };

    // Remove a task
    const removeTask = (id) => {
        fetch(BACKEND_URL + '/${id}', { method: 'DELETE' })
            .then(() => setTasks(tasks.filter((task) => task._id !== id)))
            .catch((err) => console.error(err));
    };

    return (
        <div className="app">
            <h1>TODO List - Secured with Keycloak</h1>
            <div className="task-input">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Enter a new task"
                />
                <button onClick={addTask}>Add</button>
            </div>
            <ul className="task-list">
                {tasks.map((task) => (
                    <li key={task._id}>
                        {task.text}
                        <button onClick={() => removeTask(task._id)}>Remove</button>
                    </li>
                ))}
            </ul>
            
            <hr></hr>
            <div>
                <button onClick={() => keycloak.logout()}>Logout</button>
            </div>
        </div>
    );
};

export default App;