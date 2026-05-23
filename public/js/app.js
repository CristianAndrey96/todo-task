let tasks = [];
let token = localStorage.getItem('token');
let currentUser = JSON.parse(localStorage.getItem('user'));
let authMode = 'login';
let editingTaskId = null;

// Verificar el estado de autenticación al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

function checkAuth() {
    token = localStorage.getItem('token');
    currentUser = JSON.parse(localStorage.getItem('user'));

    const authApp = document.getElementById('authApp');
    const todoApp = document.getElementById('todoApp');

    if (token && currentUser) {
        authApp.style.display = 'none';
        todoApp.style.display = 'block';
        
        // Mostrar datos del usuario en la interfaz
        document.getElementById('usernameDisplay').innerText = currentUser.Username;
        document.getElementById('userAvatar').innerText = currentUser.Username.charAt(0).toUpperCase();

        loadTasks();
    } else {
        authApp.style.display = 'block';
        todoApp.style.display = 'none';
        
        // Limpiar almacenamiento si el estado es inconsistente
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
}

// Alternar pestañas en el panel de autenticación
function switchAuthTab(mode) {
    authMode = mode;
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const authTitle = document.getElementById('authTitle');
    const authSubtitle = document.getElementById('authSubtitle');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const authForm = document.getElementById('authForm');
    
    hideAlerts();

    if (mode === 'login') {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        authTitle.innerText = 'Iniciar Sesión';
        authSubtitle.innerText = 'Ingresa tus credenciales para acceder a tus tareas';
        authSubmitBtn.innerText = 'Iniciar Sesión';
    } else {
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        authTitle.innerText = 'Registrarse';
        authSubtitle.innerText = 'Crea una cuenta nueva para organizar tus tareas';
        authSubmitBtn.innerText = 'Crear Cuenta';
    }
    authForm.reset();
}

function showAlert(type, message) {
    const errorDiv = document.getElementById('authError');
    const successDiv = document.getElementById('authSuccess');

    hideAlerts();

    if (type === 'error') {
        errorDiv.innerText = message;
        errorDiv.style.display = 'block';
    } else {
        successDiv.innerText = message;
        successDiv.style.display = 'block';
    }
}

function hideAlerts() {
    document.getElementById('authError').style.display = 'none';
    document.getElementById('authSuccess').style.display = 'none';
}

// Manejar el envío de los formularios de autenticación
async function handleAuthSubmit(e) {
    e.preventDefault();
    hideAlerts();

    const usernameInput = document.getElementById('usernameInput').value.trim();
    const passwordInput = document.getElementById('passwordInput').value;

    if (!usernameInput || !passwordInput) {
        showAlert('error', 'Por favor llena todos los campos');
        return;
    }

    const url = authMode === 'login' ? '/api/login' : '/api/register';
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Username: usernameInput,
                Password: passwordInput
            })
        });

        const data = await response.json();

        if (!response.ok) {
            showAlert('error', data.message || 'Credenciales o datos incorrectos');
            return;
        }

        if (authMode === 'login') {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            showAlert('success', 'Sesión iniciada correctamente. Cargando...');
            setTimeout(() => {
                checkAuth();
                document.getElementById('authForm').reset();
                hideAlerts();
            }, 800);
        } else {
            showAlert('success', '¡Registro exitoso! Ya puedes iniciar sesión.');
            setTimeout(() => {
                switchAuthTab('login');
                // Llenar automáticamente el campo de usuario
                document.getElementById('usernameInput').value = usernameInput;
            }, 1200);
        }
    } catch (error) {
        console.error('Error de autenticación:', error);
        showAlert('error', 'Error al conectar con el servidor');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    checkAuth();
}

// --- Funciones originales adaptadas con cabecera de autorización ---

async function loadTasks() {
    try {
        const response = await fetch('/api/all-tasks', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401 || response.status === 403) {
            logout();
            return;
        }

        tasks = await response.json();
        renderTasks();
    } catch (error) {
        console.error('Error cargando tareas:', error);
    }
}

async function addTask() {
    const taskInput = document.getElementById('taskInput');
    const deadlineInput = document.getElementById('deadlineInput');
    const name = taskInput.value.trim();
    const deadline = deadlineInput.value ? new Date(deadlineInput.value) : new Date();

    if (!name) return;

    try {
        const response = await fetch('/api/create-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                TaskId: Date.now(),
                Name: name,
                Deadline: deadline
            })
        });

        if (response.status === 401 || response.status === 403) {
            logout();
            return;
        }

        if (response.ok) {
            taskInput.value = '';
            deadlineInput.value = '';
            loadTasks();
        }
    } catch (error) {
        console.error('Error agregando tarea:', error);
    }
}

async function deleteTask(taskId) {
    try {
        const response = await fetch('/api/delete-task', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ TaskId: taskId })
        });

        if (response.status === 401 || response.status === 403) {
            logout();
            return;
        }

        loadTasks();
    } catch (error) {
        console.error('Error eliminando tarea:', error);
    }
}

function startEdit(taskId) {
    editingTaskId = taskId;
    renderTasks();
}

function cancelEdit() {
    editingTaskId = null;
    renderTasks();
}

async function saveTask(taskId) {
    const editNameInput = document.getElementById(`editNameInput-${taskId}`);
    const editDeadlineInput = document.getElementById(`editDeadlineInput-${taskId}`);
    const name = editNameInput.value.trim();
    const deadline = editDeadlineInput.value ? new Date(editDeadlineInput.value) : new Date();

    if (!name) return;

    try {
        const response = await fetch('/api/update-task', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                TaskId: taskId,
                Name: name,
                Deadline: deadline
            })
        });

        if (response.status === 401 || response.status === 403) {
            logout();
            return;
        }

        if (response.ok) {
            editingTaskId = null;
            loadTasks();
        }
    } catch (error) {
        console.error('Error actualizando tarea:', error);
    }
}

function renderTasks() {
    const taskList = document.getElementById('taskList');

    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <p>No hay tareas. ¡Agrega una nueva!</p>
            </div>
        `;
        return;
    }

    taskList.innerHTML = tasks.map(task => {
        const isEditing = editingTaskId === task.TaskId;
        if (isEditing) {
            const deadlineVal = task.Deadline ? new Date(task.Deadline).toISOString().split('T')[0] : '';
            return `
                <li class="task-item editing">
                    <div class="task-content">
                        <input type="text" id="editNameInput-${task.TaskId}" class="task-edit-input" value="${task.Name}">
                        <input type="date" id="editDeadlineInput-${task.TaskId}" class="task-edit-date" value="${deadlineVal}">
                    </div>
                    <div class="task-actions">
                        <button class="btn-save" onclick="saveTask(${task.TaskId})">Guardar</button>
                        <button class="btn-cancel" onclick="cancelEdit()">Cancelar</button>
                    </div>
                </li>
            `;
        } else {
            return `
                <li class="task-item">
                    <div class="task-content">
                        <div class="task-title">${task.Name}</div>
                        ${task.Deadline ? `<div class="task-description">${new Date(task.Deadline).toLocaleDateString()}</div>` : ''}
                    </div>
                    <div class="task-actions">
                        <button class="btn-edit" onclick="startEdit(${task.TaskId})">Editar</button>
                        <button class="btn-delete" onclick="deleteTask(${task.TaskId})">Eliminar</button>
                    </div>
                </li>
            `;
        }
    }).join('');
}

// Enter key para agregar tarea
document.getElementById('taskInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});
