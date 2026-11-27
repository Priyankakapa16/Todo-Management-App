
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [activePage, setActivePage] = useState('Dashboard')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tasks, setTasks] = useState([])

  const menuItems = ['Dashboard', 'My Tasks', 'Upcoming', 'Completed']

  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  // GET - Fetch tasks from Spring Boot backend
  useEffect(() => {
    fetch('http://localhost:8080/api/todos')
      .then(response => response.json())
      .then(data => {
        setTasks(data)
      })
      .catch(error => {
        console.error('Error fetching tasks:', error)
      })
  }, [])

  // POST - Add task to Spring Boot backend and MySQL
  async function addTask() {
    if (title.trim() === '') {
      alert('Please enter a task title')
      return
    }

    const newTask = {
      title: title,
      description: description,
      completed: false
    }

    try {
      const response = await fetch('http://localhost:8080/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
      })

      if (!response.ok) {
        throw new Error('Failed to create task')
      }

      const savedTask = await response.json()

      setTasks(prevTasks => [...prevTasks, savedTask])

      setTitle('')
      setDescription('')

      alert('Task saved successfully!')

    } catch (error) {
      console.error('Error adding task:', error)
      alert('Unable to save task')
    }
  }

  // DELETE - Remove task from Spring Boot backend and MySQL
  async function deleteTask(id) {
    try {
      const response = await fetch(`http://localhost:8080/api/todos/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      setTasks(prevTasks =>
        prevTasks.filter(task => task.id !== id)
      )

      alert('Task deleted successfully!')

    } catch (error) {
      console.error('Error deleting task:', error)
      alert('Unable to delete task')
    }
  }

  // PUT - Update task in Spring Boot backend and MySQL
  async function updateTask(id) {
    if (editTitle.trim() === '') {
      alert('Task title cannot be empty')
      return
    }

    const updatedTask = tasks.find(task => task.id === id)

    if (!updatedTask) {
      alert('Task not found')
      return
    }

    try {
      const response = await fetch(`http://localhost:8080/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: editTitle,
          description: updatedTask.description,
          completed: updatedTask.completed
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      const savedTask = await response.json()

      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? savedTask : task
        )
      )

      setEditingTaskId(null)
      setEditTitle('')

      alert('Task updated successfully!')

    } catch (error) {
      console.error('Error updating task:', error)
      alert('Unable to update task')
    }
  }

// Toggle - Change task completion status
async function toggleTaskStatus(id) {
  const task = tasks.find(task => task.id === id)

  if (!task) {
    return
  }

  try {
    const response = await fetch(`http://localhost:8080/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        completed: !task.completed
      })
    })

    if (!response.ok) {
      throw new Error('Failed to update task status')
    }

    const savedTask = await response.json()

    setTasks(prevTasks =>
      prevTasks.map(item =>
        item.id === id ? savedTask : item
      )
    )

  } catch (error) {
    console.error('Error updating task status:', error)
    alert('Unable to update task status')
  }
}


  return (
    <div className="app-container">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Todo App</h2>

        <nav>
          {menuItems.map((item) => (
            <a
              key={item}
              href="#"
              className={activePage === item ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault()
                setActivePage(item)
              }}
            >
              {item}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">

        <header>
          <h1>{activePage}</h1>
          <p>Welcome back! Manage your tasks here.</p>
        </header>

        {/* Dashboard */}
        {activePage === 'Dashboard' && (
          <section className="summary-cards">

            <div className="card">
              <h3>Total Tasks</h3>
              <h2>{tasks.length}</h2>
            </div>

            <div className="card">
              <h3>Upcoming</h3>
              <h2>{tasks.filter(task => !task.completed).length}</h2>
            </div>

            <div className="card">
              <h3>Completed</h3>
              <h2>{tasks.filter(task => task.completed).length}</h2>
            </div>

          </section>
        )}

        {/* My Tasks */}
        {activePage === 'My Tasks' && (
          <section className="task-section">

            <h2>Add New Task</h2>

            <input
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button onClick={addTask}>Add Task</button>

            <h2>My Tasks</h2>

            {tasks.length === 0 ? (
              <p>No tasks found.</p>
            ) : (
              tasks.map(task => (
                <div className="card" key={task.id}>

                  {editingTaskId === task.id ? (
                    <>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />

                      <button onClick={() => updateTask(task.id)}>
                        Save
                      </button>

                      <button onClick={() => {
                        setEditingTaskId(null)
                        setEditTitle('')
                      }}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <h3>{task.title}</h3>
                      <p>{task.description}</p>

                      <button onClick={() => {
                        setEditingTaskId(task.id)
                        setEditTitle(task.title)
                      }}>
                        Edit
                      </button>

                      <button onClick={() => toggleTaskStatus(task.id)}>
                        {task.completed ? 'Mark as Pending' : 'Mark as Completed'}
                      </button>
                      <button onClick={() => deleteTask(task.id)}>
                        Delete
                      </button>
                    </>
                  )}

                </div>
              ))
            )}

          </section>
        )}

        {/* Upcoming */}
        {activePage === 'Upcoming' && (
          <section className="task-section">

            <h2>Upcoming Tasks</h2>

            {tasks.filter(task => !task.completed).length === 0 ? (
              <p>No upcoming tasks.</p>
            ) : (
              tasks
                .filter(task => !task.completed)
                .map(task => (
                  <div className="card" key={task.id}>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                  </div>
                ))
            )}

          </section>
        )}

        {/* Completed */}
        {activePage === 'Completed' && (
          <section className="task-section">

            <h2>Completed Tasks</h2>

            {tasks.filter(task => task.completed).length === 0 ? (
              <p>No completed tasks.</p>
            ) : (
              tasks
                .filter(task => task.completed)
                .map(task => (
                  <div className="card" key={task.id}>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                  </div>
                ))
            )}

          </section>
        )}

      </main>
    </div>
  )
}

export default App
