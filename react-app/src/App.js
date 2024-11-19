import React, { useState, useEffect } from 'react';
import './App.css';

const BACKEND_URL = 'http://localhost:8080';

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    // Fetch tasks from the backend
    useEffect(() => {
        fetch('http://localhost:8080/api/tasks')
            .then((res) => res.json())
            .then((data) => setTasks(data))
            .catch((err) => console.error(err));
    }, []);

    // Add a new task
    const addTask = () => {
        if (newTask.trim()) {
            fetch('http://localhost:8080/api/tasks', {
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
        fetch(`http://localhost:8080/api/tasks/${id}`, { method: 'DELETE' })
            .then(() => setTasks(tasks.filter((task) => task._id !== id)))
            .catch((err) => console.error(err));
    };

    return (
        <div className="app">
            <h1>TODO List</h1>
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
        </div>
    );
}

export default App;