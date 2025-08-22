// Aplikasi Daftar Tugas JavaScript
console.log("Todo List App Initialized");

// Variabel global
let listTodo = [];

// Elemen DOM
let taskInput, dueDateInput, addTaskBtn, deleteAllBtn, searchInput, filterSelect, taskList, noTasks;
let totalTasksEl, completedTasksEl, pendingTasksEl, progressEl;

// Inisialisasi aplikasi
function init() {
    console.log("Initializing Todo App...");
    
    // Mendapatkan elemen DOM
    getDOMElements();
    
    // Mengatur pendengar acara
    setupEventListeners();
    
    // Perbarui statistik awal
    updateStatistics();
    
    // Render daftar tugas awal
    renderTodoList();
    
    console.log("Todo App Ready!");
}

// Mendapatkan semua elemen DOM
function getDOMElements() {
    // Elemen formulir
    taskInput = document.getElementById('task-input');
    dueDateInput = document.getElementById('due-date-input');
    addTaskBtn = document.getElementById('add-task-btn');
    deleteAllBtn = document.getElementById('delete-all-btn');
    
    // Elemen filter
    searchInput = document.getElementById('search-input');
    filterSelect = document.getElementById('filter-select');
    
    // Elemen tampilan
    taskList = document.getElementById('task-list');
    noTasks = document.getElementById('no-tasks');
    
    // Elemen statistik
    totalTasksEl = document.getElementById('total-tasks');
    completedTasksEl = document.getElementById('completed-tasks');
    pendingTasksEl = document.getElementById('pending-tasks');
    progressEl = document.getElementById('progress-percent');
    
    console.log("DOM elements loaded");
}

// Konfigurasikan semua pendengar acara
function setupEventListeners() {
    if (!addTaskBtn || !deleteAllBtn || !searchInput || !filterSelect || !taskInput) {
        console.error("Some DOM elements not found!");
        return;
    }
    
    // Tombol Tambah Tugas
    addTaskBtn.addEventListener('click', function(e) {
        e.preventDefault();
        validateForm();
    });
    
    // Hapus Semua Tombol
    deleteAllBtn.addEventListener('click', function(e) {
        e.preventDefault();
        deleteAll();
    });
    
    // Kontak Pencarian
    searchInput.addEventListener('input', function() {
        filterTasks();
    });
    
    // Pilih Filter
    filterSelect.addEventListener('change', function() {
        filterTasks();
    });
    
    // Dukungan tombol Enter untuk masukan tugas
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            validateForm();
        }
    });
    
    // Pencegahan pengiriman formulir
    const form = document.getElementById('todo-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            validateForm();
        });
    }
    
    console.log("Event listeners setup complete");
}

// Validasi Masukan Formulir
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
    
    // Bersihkan formulir setelah menambahkan tugas
    taskInput.value = '';
    dueDateInput.value = '';
    taskInput.focus();
}

// Tambahkan tugas baru
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

// Aktifkan/nonaktifkan penyelesaian tugas
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

// Hapus satu tugas
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

// Hapus semua tugas
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

// Perbarui statistik
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

// Filter tugas berdasarkan pencarian dan status
function filterTasks() {
    if (!searchInput || !filterSelect) {
        console.error("Filter elements not found!");
        return;
    }
    
    const searchTerm = searchInput.value.toLowerCase();
    const filterStatus = filterSelect.value;
    
    let filteredTodos = [...listTodo];
    
    // Filter berdasarkan kata kunci pencarian
    if (searchTerm) {
        filteredTodos = filteredTodos.filter(todo => 
            todo.task.toLowerCase().includes(searchTerm)
        );
    }
    
    // Filter berdasarkan status
    if (filterStatus === 'completed') {
        filteredTodos = filteredTodos.filter(todo => todo.completed);
    } else if (filterStatus === 'pending') {
        filteredTodos = filteredTodos.filter(todo => !todo.completed);
    }
    
    console.log("Filtered tasks:", filteredTodos.length);
    renderFilteredTodoList(filteredTodos);
}

// Render daftar tugas yang difilter
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
    
    // Tambahkan pendengar acara (event listeners) untuk elemen yang dibuat secara dinamis.
    addTaskEventListeners();
}

// Tambahkan pendengar acara (event listeners) untuk item tugas (kotak centang dan tombol hapus)
function addTaskEventListeners() {
    // Pendengar acara kotak centang
    const checkboxes = document.querySelectorAll('.task-checkbox');
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            const taskId = this.getAttribute('data-task-id');
            toggleTask(taskId);
        });
    });
    
    // Pencatat peristiwa tombol Hapus
    const deleteButtons = document.querySelectorAll('.delete-task-btn');
    deleteButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const taskId = this.getAttribute('data-task-id');
            deleteTask(taskId);
        });
    });
}

// Render daftar tugas lengkap
function renderTodoList() {
    renderFilteredTodoList(listTodo);
}

// Format tanggal untuk tampilan
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

// Mengenkode HTML untuk mencegah serangan XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Inisialisasi aplikasi saat DOM dimuat
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing app...");
    init();
});

// Tangani kesalahan halaman
window.addEventListener('error', function(e) {
    console.error("JavaScript Error:", e.error);
});