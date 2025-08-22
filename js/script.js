// JavaScript Todo List Application
console.log("Todo List App Initialized");

// Global variables
let listTodo = [];

// DOM Elements
let taskInput, dueDateInput, addTaskBtn, deleteAllBtn, searchInput, filterSelect, taskList, noTasks;
let totalTasksEl, completedTasksEl, pendingTasksEl, progressEl;

// Initialize the app
function init() {
    console.log("Initializing Todo App...");
    
    // Get DOM elements
    getDOMElements();
    
    // Setup event listeners
    setupEventListeners();
    
    // Update initial statistics
    updateStatistics();
    
    // Render initial todo list
    renderTodoList();
    
    console.log("Todo App Ready!");
}

// Get all DOM elements
function getDOMElements() {
    // Form elements
    taskInput = document.getElementById('task-input');
    dueDateInput = document.getElementById('due-date-input');
    addTaskBtn = document.getElementById('add-task-btn');
    deleteAllBtn = document.getElementById('delete-all-btn');
    
    // Filter elements
    searchInput = document.getElementById('search-input');
    filterSelect = document.getElementById('filter-select');
    
    // Display elements
    taskList = document.getElementById('task-list');
    noTasks = document.getElementById('no-tasks');
    
    // Statistics elements
    totalTasksEl = document.getElementById('total-tasks');
    completedTasksEl = document.getElementById('completed-tasks');
    pendingTasksEl = document.getElementById('pending-tasks');
    progressEl = document.getElementById('progress-percent');
    
    console.log("DOM elements loaded");
}

// Setup all event listeners
function setupEventListeners() {
    if (!addTaskBtn || !deleteAllBtn || !searchInput || !filterSelect || !taskInput) {
        console.error("Some DOM elements not found!");
        return;
    }
    
    // Add task button
    addTaskBtn.addEventListener('click', function(e) {
        e.preventDefault();
        validateForm();
    });
    
    // Delete all button
    deleteAllBtn.addEventListener('click', function(e) {
        e.preventDefault();
        deleteAll();
    });
    
    // Search input
    searchInput.addEventListener('input', function() {
        filterTasks();
    });
    
    // Filter select
    filterSelect.addEventListener('change', function() {
        filterTasks();
    });
    
    // Enter key support for task input
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            validateForm();
        }
    });
    
    // Form submit prevention
    const form = document.getElementById('todo-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            validateForm();
        });
    }
    
    console.log("Event listeners setup complete");
}

// Validate Form Inputs
function validateForm() {
    console.log("Validating form...");
    
    if (!taskInput || !dueDateInput) {
        console.error("Form elements not found!");
        return;
    }
    
    const taskValue = taskInput.value.trim();
    const dateValue = dueDateInput.value;
    
    if (taskValue === '' || dateValue === '') {
        alert("Please enter a task and due date.");
        return;
    }
    
    console.log("Form valid, adding task:", taskValue, dateValue);
    addTodo(taskValue, dateValue);
    
    // Clear form
    taskInput.value = '';
    dueDateInput.value = '';
    taskInput.focus();
}

// Add a new Todo
function addTodo(task, dueDate) {
    console.log("Adding new todo:", task, dueDate);
    
    const newTodo = {
        id: Date.now(),
        task: task,
        dueDate: dueDate,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    listTodo.push(newTodo);
    console.log("Todo added, total tasks:", listTodo.length);
    
    updateStatistics();
    renderTodoList();
}

// Toggle task completion
function toggleTask(id) {
    console.log("Toggling task:", id);
    
    const todo = listTodo.find(item => item.id === parseInt(id));
    if (todo) {
        todo.completed = !todo.completed;
        console.log("Task toggled:", todo.completed);
        updateStatistics();
        renderTodoList();
    }
}

// Delete a single task
function deleteTask(id) {
    console.log("Deleting task:", id);
    
    const initialLength = listTodo.length;
    listTodo = listTodo.filter(item => item.id !== parseInt(id));
    
    if (listTodo.length < initialLength) {
        console.log("Task deleted, remaining tasks:", listTodo.length);
        updateStatistics();
        renderTodoList();
    }
}

// Delete all Todos
function deleteAll() {
    console.log("Delete all requested");
    
    if (listTodo.length === 0) {
        alert("No tasks to delete.");
        return;
    }
    
    if (confirm("Are you sure you want to delete all tasks?")) {
        listTodo = [];
        console.log("All tasks deleted");
        updateStatistics();
        renderTodoList();
    }
}

// Update statistics
function updateStatistics() {
    const total = listTodo.length;
    const completed = listTodo.filter(item => item.completed).length;
    const pending = total - completed;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    if (totalTasksEl) totalTasksEl.textContent = total;
    if (completedTasksEl) completedTasksEl.textContent = completed;
    if (pendingTasksEl) pendingTasksEl.textContent = pending;
    if (progressEl) progressEl.textContent = progress + '%';
    
    console.log("Statistics updated:", { total, completed, pending, progress });
}

// Filter tasks based on search and status
function filterTasks() {
    if (!searchInput || !filterSelect) {
        console.error("Filter elements not found!");
        return;
    }
    
    const searchTerm = searchInput.value.toLowerCase();
    const filterStatus = filterSelect.value;
    
    let filteredTodos = [...listTodo];
    
    // Filter by search term
    if (searchTerm) {
        filteredTodos = filteredTodos.filter(todo => 
            todo.task.toLowerCase().includes(searchTerm)
        );
    }
    
    // Filter by status
    if (filterStatus === 'completed') {
        filteredTodos = filteredTodos.filter(todo => todo.completed);
    } else if (filterStatus === 'pending') {
        filteredTodos = filteredTodos.filter(todo => !todo.completed);
    }
    
    console.log("Filtered tasks:", filteredTodos.length);
    renderFilteredTodoList(filteredTodos);
}

// Render filtered todo list
function renderFilteredTodoList(todos) {
    if (!taskList || !noTasks) {
        console.error("Display elements not found!");
        return;
    }
    
    if (todos.length === 0) {
        taskList.style.display = 'none';
        noTasks.style.display = 'block';
        return;
    }
    
    taskList.style.display = 'block';
    noTasks.style.display = 'none';
    taskList.innerHTML = '';
    
    todos.forEach(function(todo) {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item glass rounded-lg p-4 flex items-center justify-between' + 
                            (todo.completed ? ' completed' : '');
        
        taskItem.innerHTML = 
            '<div class="flex items-center gap-3 flex-1">' +
                '<input type="checkbox" ' + (todo.completed ? 'checked' : '') + 
                       ' data-task-id="' + todo.id + '"' +
                       ' class="task-checkbox w-5 h-5 rounded border-2 cursor-pointer">' +
                '<div class="flex-1">' +
                    '<div class="text-white font-medium' + (todo.completed ? ' line-through opacity-70' : '') + '">' + 
                        escapeHtml(todo.task) + '</div>' +
                    '<div class="text-white opacity-50 text-sm">Due: ' + formatDate(todo.dueDate) + '</div>' +
                '</div>' +
            '</div>' +
            '<div class="flex items-center gap-2">' +
                '<span class="px-3 py-1 rounded-full text-xs font-medium ' + 
                    (todo.completed ? 'bg-green-500 bg-opacity-20 text-green-400' : 'bg-yellow-500 bg-opacity-20 text-yellow-400') + '">' +
                    (todo.completed ? 'Completed' : 'Pending') + '</span>' +
                '<button data-task-id="' + todo.id + '" class="delete-task-btn text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500 hover:bg-opacity-10 transition-colors">' +
                    '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
                        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>' +
                    '</svg>' +
                '</button>' +
            '</div>';
        
        taskList.appendChild(taskItem);
    });
    
    // Add event listeners for dynamically created elements
    addTaskEventListeners();
}

// Add event listeners for task items (checkboxes and delete buttons)
function addTaskEventListeners() {
    // Checkbox event listeners
    const checkboxes = document.querySelectorAll('.task-checkbox');
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            const taskId = this.getAttribute('data-task-id');
            toggleTask(taskId);
        });
    });
    
    // Delete button event listeners
    const deleteButtons = document.querySelectorAll('.delete-task-btn');
    deleteButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const taskId = this.getAttribute('data-task-id');
            deleteTask(taskId);
        });
    });
}

// Render the complete Todo List
function renderTodoList() {
    renderFilteredTodoList(listTodo);
}

// Format date for display
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    } catch (error) {
        console.error("Error formatting date:", error);
        return dateString;
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing app...");
    init();
});

// Handle page errors
window.addEventListener('error', function(e) {
    console.error("JavaScript Error:", e.error);
});