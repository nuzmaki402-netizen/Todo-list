class TodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
        this.updateStats();
    }

    bindEvents() {
        const addBtn = document.getElementById('add-btn');
        const taskInput = document.getElementById('task-input');
        const clearCompletedBtn = document.getElementById('clear-completed');
        const clearAllBtn = document.getElementById('clear-all');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const tasktime = document.getElementById('task-input-time');
const taskdate = document.getElementById('task-input-date');


        addBtn.addEventListener('click', () => this.addTask());
tasktime.addEventListener('keypress', (e)=>{
     if (e.key === 'Enter') this.addTask();
})

        taskdate.addEventListener('keypress', (e) =>{
             if (e.key === 'Enter') this.addTask();
        });
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        clearAllBtn.addEventListener('click', () => this.clearAll());

        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });
    }
addTask() {
    const input = document.getElementById('task-input');
    const timeInput = document.getElementById('task-input-time');
    const dateInput = document.getElementById('task-input-date');

    const text = input.value.trim();
    const time = timeInput.value;
    const date = dateInput.value;

    if (!text) {
        alert("Please enter task!");
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        time: time,
        date: date,
        completed: false,
        createdAt: new Date().toISOString()
    };

    this.tasks.unshift(task);
    this.saveToStorage();
    this.render();
    this.updateStats();

    input.value = '';
    timeInput.value = '';
    dateInput.value = '';
}


    toggleTask(id) {
        this.tasks = this.tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        this.saveToStorage();
        this.render();
        this.updateStats();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveToStorage();
        this.render();
        this.updateStats();
        
        // Add animation for deletion
        const taskElement = document.querySelector(`[data-id="${id}"]`);
        if (taskElement) {
            taskElement.style.transform = 'translateX(-100%)';
            taskElement.style.opacity = '0';
            setTimeout(() => {
                this.render();
            }, 300);
        }
    }
setFilter(filter) {
    this.currentFilter = filter;

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');

        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });

    this.render();
}


    getFilteredTasks() {
        switch (this.currentFilter) {            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    render() {
        const container = document.getElementById('tasks-container');
        const filteredTasks = this.getFilteredTasks();

        if (filteredTasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state" id="empty-state">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#00ADB5" stroke-width="1.5">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p>${this.currentFilter === 'all' ? 'No tasks yet. Add your first task!' : 
                       this.currentFilter === 'active' ? 'No active tasks. Great job!' : 
                       'No completed tasks yet.'}</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredTasks.map(task => `
            <div class="task-card ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="todoApp.toggleTask(${task.id})"></div>
                <div class="task-content">
    <strong>${this.escapeHtml(task.text)}</strong><br>
    <small>📅 ${task.date || 'No Date'} ⏰ ${task.time || 'No Time'}</small>
</div>

                <div class="task-actions">
                    <button class="delete-btn" onclick="todoApp.deleteTask(${task.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        
        document.getElementById('total-count').textContent = total;
        document.getElementById('completed-count').textContent = completed;
    }
    clearCompleted() {
        if (!confirm('Are you sure you want to clear all completed tasks?')) return;
        
        this.tasks = this.tasks.filter(task => !task.completed);
        this.saveToStorage();
        this.render();
        this.updateStats();
    }

    clearAll() {
        if (!confirm('Are you sure you want to clear all tasks?')) return;
        
        this.tasks = [];
        this.saveToStorage();
        this.render();
        this.updateStats();
    }

    saveToStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showError(message) {
        // Create temporary error element
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #FF6B6B;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 1000;
            animation: slideInDown 0.3s ease-out;
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
});

// Add smooth scrolling for better UX
document.addEventListener('click', (e) => {
    if (e.target.closest('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

