document.addEventListener('DOMContentLoaded', () => {
    const todoList = document.getElementById('todo-list');
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const completedCounter = document.getElementById('completed-counter');
  
    // Fetch all todos
    const fetchTodos = async () => {
      try {
        const response = await fetch('http://localhost:3000/todos');
        const todos = await response.json();
        displayTodos(todos);
        updateCompletedCounter(todos);
      } catch (error) {
        console.log('Error fetching todos:', error);
      }
    };
  
    // Display todos on the page
    const displayTodos = (todos) => {
      todoList.innerHTML = '';
      todos.forEach(todo => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="updateTodoStatus('${todo._id}', this)">
          <span>${todo.text}</span>
          <button class = "delete-btn" onclick="deleteTodo('${todo._id}')">Delete</button>
        `;
        todoList.appendChild(listItem);
      });
    };
  
    // Update the completed counter
    const updateCompletedCounter = (todos) => {
      const completedTodos = todos.filter(todo => todo.completed);
      completedCounter.textContent = `${completedTodos.length}/${todos.length}`;
    };
  
    // Add a new todo
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = input.value.trim();
  
      if (text) {
        try {
          await fetch('http://localhost:3000/todos', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text, completed: false })
          });
          input.value = '';
          fetchTodos();
        } catch (error) {
          console.log('Error creating todo:', error);
        }
      }
    });
  
    // Update todo status
    window.updateTodoStatus = async (id, checkbox) => {
      const completed = checkbox.checked;
  
      try {
        await fetch(`http://localhost:3000/todos/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ completed })
        });
        fetchTodos();
      } catch (error) {
        console.log('Error updating todo:', error);
      }
    };
  
    // Delete a todo
    window.deleteTodo = async (id) => {
      try {
        await fetch(`http://localhost:3000/todos/${id}`, {
          method: 'DELETE'
        });
        fetchTodos();
      } catch (error) {
        console.log('Error deleting todo:', error);
      }
    };
  
  
    fetchTodos();
  });
  