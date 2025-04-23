import { API_URLS } from './config.js';

document.getElementById('logoutBtn').addEventListener('click', () => {
    // Eliminar el token del localStorage
    localStorage.removeItem('token');

    // Redireccionar a la página de login (ajusta la ruta según tu estructura)
    window.location.href = '../index.html'; 
});


// Verificación de autenticación
const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('userData')); // Cambiado de 'user' a 'userData'

    console.log("Verificando autenticación admin:", userData);

    // Verificar si existe el token y el usuario es admin
    if (!token || !userData || userData.rol !== 'admin') { // Cambiado de 'role' a 'rol'
        console.log("No autorizado como admin, redirigiendo...");
        window.location.href = '/index.html';
    }
};

// Gestión de Usuarios
class UserManager {
    static async getAllUsers() {
        try {
            const response = await fetch(`${API_URLS.usuarios}/usuarios`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const users = await response.json();
            return users;
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw error;
        }
    }

    static async getUserById(id) {
        try {
            const response = await fetch(`${API_URLS.usuarios}/usuarios/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error(`Error al obtener usuario ${id}:`, error);
            throw error;
        }
    }

    static async createUser(userData) {
        try {
            // Validación mejorada
            const errors = [];
            if (!userData.password) errors.push("La contraseña es requerida");
            if (!userData.email) errors.push("El email es requerido");
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) errors.push("Email inválido");
            if (userData.password.length < 6) errors.push("La contraseña debe tener al menos 6 caracteres");
            
            if (errors.length > 0) {
                throw new Error(errors.join(", "));
            }
    
            // Reestructurar los datos exactamente como el backend los espera
            const requestData = {
                nombre: userData.nombre,
                email: userData.email,
                telefono: userData.telefono,
                contrasena: userData.password,
                rol: userData.rol || 'user'
            };
    
            console.log("Datos enviados al servidor:", requestData);
    
            const response = await fetch(`${API_URLS.usuarios}/usuarios/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(requestData)
            });
    
            const data = await response.json();
            
            if (!response.ok) {
                console.error("Error del servidor:", data);
                throw new Error(data.message || "Error en el servidor");
            }
    
            return data;
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw new Error(error.message || "Error de conexión");
        }
    }

    static async updateUser(id, userData) {
        try {
            // Limpiar y validar datos
            const cleanData = {
                nombre: userData.nombre?.trim() || null,
                email: userData.email?.trim(),
                telefono: userData.telefono ? userData.telefono.trim() : null,
                rol: userData.rol
            };
    
            // Validación básica
            if (!cleanData.email) throw new Error("El email es requerido");
            if (!cleanData.rol) throw new Error("El rol es requerido");
    
            console.log("Enviando datos para actualización:", cleanData);
    
            const response = await fetch(`${API_URLS.usuarios}/usuarios/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(cleanData)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al actualizar usuario");
            }
    
            const responseData = await response.json();
            return responseData;
        } catch (error) {
            console.error(`Error al actualizar usuario ${id}:`, error);
            throw new Error(error.message || "Error de conexión");
        }
    }

    static async deleteUser(id) {
        try {
            const response = await fetch(`${API_URLS.usuarios}/usuarios/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error(`Error al eliminar usuario ${id}:`, error);
            throw error;
        }
    }
}

// Gestión de Vehículos
class VehicleManager {
    static async getAllVehicles() {
        try {
            const response = await fetch(`${API_URLS.vehiculos}/vehiculos`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const vehicles = await response.json();
            return vehicles;
            
        } catch (error) {
            console.error('Error al obtener vehículos:', error);
            throw error;
        }
    }

    static async getVehicleById(id) {
        try {
            console.log(`Obteniendo vehículo con ID: ${id}`);
            const response = await fetch(`${API_URLS.vehiculos}/vehiculos/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al obtener datos del vehículo');
            }
            
            const data = await response.json();
            console.log('Datos recibidos del vehículo:', data);
            return data;
        } catch (error) {
            console.error(`Error al obtener vehículo ${id}:`, error);
            throw error;
        }
    }

    static async updateVehicle(id, vehicleData) {
        try {
            const response = await fetch(`${API_URLS.vehiculos}/vehiculos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    marca: vehicleData.marca,
                    modelo: vehicleData.modelo,
                    año: parseInt(vehicleData.año),
                    precio: parseFloat(vehicleData.precio),
                    kilometraje: parseInt(vehicleData.kilometraje) || 0,
                    estado: vehicleData.estado || 'disponible'
                })
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error en el servidor");
            }
    
            return await response.json();
        } catch (error) {
            console.error(`Error al actualizar vehículo ${id}:`, error);
            throw error;
        }
    }

    // En VehicleManager.js
static async markAsSold(id) {
    try {
        const response = await fetch(`${API_URLS.vehiculos}/vehiculos/${id}/vendido`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al actualizar");
        }

        return await response.json();
    } catch (error) {
        console.error(`Error en markAsSold: ${error.message}`);
        throw error;
    }
}

    // Solución 1: Implementar eliminación real usando método DELETE
static async deleteVehicle(id) {
    try {
        // Validar que el ID existe
        if (!id) {
            throw new Error("ID de vehículo no proporcionado");
        }
        
        // Realizar una solicitud DELETE real
        const response = await fetch(`${API_URLS.vehiculos}/vehiculos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            console.error(`Error al eliminar vehículo ${id}:`, response);
            throw new Error('Error al eliminar vehículo');
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error al eliminar vehículo ${id}:`, error);
        throw error;
    }
}
    
    static async createVehicle(vehicleData) {
        try {
            const response = await fetch(`${API_URLS.vehiculos}/vehiculos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(vehicleData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error al crear vehículo:', error);
            throw error;
        }
    }
}

// Gestión de Compras
class PurchaseManager {
    static async getAllPurchases() {
        try {
            const response = await fetch(`${API_URLS.compras}/compras/all/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error al obtener compras:', error);
            throw error;
        }
    }

    static async getPurchaseById(id) {
        try {
            console.log(`Obteniendo compra con ID: ${id}`);
            const response = await fetch(`${API_URLS.compras}/compras/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al obtener datos de la compra');
            }
            
            const data = await response.json();
            console.log('Datos recibidos de la compra:', data);
            return data.data || data; // Maneja ambas estructuras de respuesta
        } catch (error) {
            console.error(`Error al obtener compra ${id}:`, error);
            throw error;
        }
    }

    static async createPurchase(purchaseData) {
        try {
            // Validaciones básicas
            if (!purchaseData.user_id) throw new Error("El ID de usuario es requerido");
            if (!purchaseData.vehicle_id) throw new Error("El ID de vehículo es requerido");
            if (!purchaseData.precio_total || isNaN(purchaseData.precio_total)) 
                throw new Error("El precio total debe ser un número válido");
                
            console.log('Creando nueva compra:', purchaseData);
            
            const response = await fetch(`${API_URLS.compras}/compras`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    user_id: purchaseData.user_id,
                    vehicle_id: purchaseData.vehicle_id,
                    precio_total: parseFloat(purchaseData.precio_total),
                    fecha: purchaseData.fecha || new Date().toISOString().split('T')[0],
                    metodo_pago: purchaseData.metodo_pago || 'Tarjeta',
                    estado: purchaseData.estado || 'Completado'
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al crear compra");
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error al crear compra:', error);
            throw error;
        }
    }

    static async updatePurchase(id, purchaseData) {
        try {
            console.log(`Actualizando compra ${id}:`, purchaseData);
            
            const response = await fetch(`${API_URLS.compras}/compras/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    metodoPago: purchaseData.metodoPago,  // 
                    estado: purchaseData.estado
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al actualizar compra");
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error al actualizar compra ${id}:`, error);
            throw error;
        }
    }

    static async deletePurchase(id) {
        try {
            const response = await fetch(`${API_URLS.compras}/compras/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error(`Error al eliminar compra ${id}:`, error);
            throw error;
        }
    }
}

// Gestión de Visitas
class VisitManager {

    // En VisitManager
static async deleteVisit(id) {
    try {
        const response = await fetch(`${API_URLS.visitas}/compras/visitas/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al eliminar visita");
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error al eliminar visita ${id}:`, error);
        throw error;
    }
}
    static async getAllVisits() {
        try {
            const response = await fetch(`${API_URLS.visitas}/compras/visitas`, { 
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Error al obtener visitas');
            }
            
            const result = await response.json();
            return result.data || result; // Maneja ambas estructuras de respuesta
        } catch (error) {
            console.error('Error al obtener visitas:', error);
            throw error;
        }
    }

    static async createVisit(visitData) {
        // Construimos el payload que el backend espera
        const payload = {
          userId:    Number(visitData.userId),
          vehicleId: Number(visitData.vehicleId),
          fecha: (visitData.date.length === 10
            ? visitData.date + " 00:00:00"
            : visitData.date.replace("T", " ") + ":00"),
          
            asistio: visitData.status === "si" ? "si" : "no"


        };

        console.log("visitData recibido:", visitData);
        console.log("Payload enviado:", payload);

    
        const response = await fetch(`${API_URLS.compras}/compras/visitas`, {
          method:  "POST",
          headers: {
            "Content-Type":  "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify(payload)
        });
    
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.message || response.statusText);
        }
        return await response.json();
      }
    
}

// Funciones para manejar modales
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    if (modalId === 'purchaseModal' || modalId === 'visitModal' || modalId === 'vehicleModal') {
        loadModalSelects();
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    const form = modal.querySelector('form');
    if (form) {
        form.reset();
        if (form.dataset.userId) delete form.dataset.userId;
        if (form.dataset.vehicleId) delete form.dataset.vehicleId;
        if (form.dataset.purchaseId) delete form.dataset.purchaseId;
    }
}

// Mejorar event listeners para los botones de modal
document.addEventListener('DOMContentLoaded', () => {
    // Cargar datos iniciales
    loadDashboardData();

    // Event listeners para navegación
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const section = e.target.closest('.nav-item').getAttribute('data-section');
            showSection(section);
        });
    });

    // CORREGIDO: Event listeners para botones de modal, incluyendo botones de cierre (X)
    document.querySelectorAll('[data-modal]').forEach(button => {
        button.addEventListener('click', (e) => {
            const modalId = e.target.closest('[data-modal]').getAttribute('data-modal');
            showModal(modalId);
        });
    });

    // CORREGIDO: Event listeners específicos para botones de cierre
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = e.target.closest('.auth-modal, .modal');
            if (modal) {
                hideModal(modal.id);
            }
        });
    });

    // CORREGIDO: Event listeners para botones secundarios (cancelar)
    document.querySelectorAll('.btn-secondary').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.auth-modal, .modal');
            if (modal) {
                hideModal(modal.id);
            }
        });
    });
   
});

// Función para cargar datos del dashboard

async function loadDashboardData() {
    try {
        showNotification('Actualizando datos...', 'info');
        
        // Cargar datos en paralelo
        const [users, vehicles, purchases, visits] = await Promise.all([
            UserManager.getAllUsers(),
            VehicleManager.getAllVehicles(),
            PurchaseManager.getAllPurchases(),
            VisitManager.getAllVisits()
        ]);
        
        // Actualizar tablas
        updateUsersTable(users);
        updateVehiclesTable(vehicles.data || vehicles); // Asegurar compatibilidad con diferentes estructuras de respuesta
        updatePurchasesTable(purchases);
        updateVisitsTable(visits);
        
    } catch (error) {
        console.error('Error al actualizar datos:', error);
        showNotification('Error al actualizar datos', 'error');
    }
}

// Añade esta función (similar a updateVehiclesTable pero para usuarios)
function updateUsersTable(users) {
    const tableBody = document.querySelector('#usersTable tbody');
    
    // Verifica si la respuesta es un objeto con propiedad data
    const usuarios = users.data || users;
    
    if (!Array.isArray(usuarios)) {
        console.error('Datos de usuarios inválidos:', users);
        tableBody.innerHTML = '<tr><td colspan="5">Error al cargar usuarios</td></tr>';
        return;
    }

    tableBody.innerHTML = usuarios.map(user => `
        <tr>
            <td>${user.id || 'N/A'}</td>
            <td>${user.nombre || 'N/A'}</td>
            <td>${user.email || 'N/A'}</td>
            <td>${user.telefono || 'N/A'}</td>
            <td>${user.rol || 'N/A'}</td>
            <td>
                <button class="btn btn-primary btn-edit" data-id="${user.id}">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger btn-delete" data-id="${user.id}">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </td>
        </tr>
    `).join('');

    // Añade event listeners para los botones
    document.querySelectorAll('#usersTable .btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('.btn-edit').dataset.id;
            handleEdit('users', id);
        });
    });
    
    document.querySelectorAll('#usersTable .btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('.btn-delete').dataset.id;
            handleDelete('users', id);
        });
    });
}

// Función mejorada para mostrar notificaciones
function showNotification(message, type = 'success') {
    // Eliminar notificaciones anteriores
    document.querySelectorAll('.notification').forEach(note => note.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Añadir clase para animación de entrada
    setTimeout(() => notification.classList.add('show'), 10);

    setTimeout(() => {
        // Añadir clase para animación de salida
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

 

const vehicleForm = document.getElementById('vehicleForm');

vehicleForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Esto es crítico
    
    const vehicleData = {
        marca: document.getElementById('editMarca').value,
        modelo: document.getElementById('editModelo').value,
        año: document.getElementById('editAño').value,
        precio: document.getElementById('editPrecio').value,
        kilometraje: document.getElementById('editKilometraje').value
    };

    const vehicleId = document.getElementById('editVehicleId').value;

    try {
        showNotification('Actualizando vehículo...', 'info');
        
        const result = await VehicleManager.updateVehicle(vehicleId, vehicleData);
        
        if (result && result.success) {
            showNotification('Vehículo actualizado correctamente', 'success');
            hideModal('vehicleModal');
            await loadDashboardData();
        } else {
            throw new Error(result.message || 'Error al actualizar vehículo');
        }
    } catch (error) {
        console.error('Error en actualización:', error);
        showNotification(`Error: ${error.message}`, 'error');
    }
});

    // Botón para agregar nuevo vehículo
    const addVehicleBtn = document.getElementById('addVehicleBtn');
    if (addVehicleBtn) {
        addVehicleBtn.addEventListener('click', () => {
            const vehicleModal = document.getElementById('vehicleModal');
            const vehicleForm = document.getElementById('vehicleForm');
            const modalTitle = vehicleModal.querySelector('.modal-title');
            
            // Cambiar el título del modal
            modalTitle.textContent = 'Agregar Vehículo';
            
            // Limpiar el formulario y eliminar el ID del vehículo
            vehicleForm.reset();
            delete vehicleForm.dataset.vehicleId;
            
            // Mostrar el modal
            vehicleModal.classList.add('active');
        });
    }
    
    // Botones para cerrar modales
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Llama a esta función cuando cargue el dashboard de admin
    


userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("✅ El formulario se está enviando");
    const userData = {
        nombre: userForm.name.value, // Asegúrate de que coincida con lo que espera el backend
        email: userForm.email.value,
        telefono: userForm.phone.value || null, // Campo opcional
        password: userForm.password.value,
        rol: userForm.role.value
    };

    console.log("📦 Datos del formulario:", userData);

    try {
        const userId = userForm.dataset.userId;
        if (userId) {
            // Actualizar usuario
            const result = await UserManager.updateUser(userId, userData);
            console.log('Resultado de la actualización:', result);
            showNotification('Usuario actualizado exitosamente');
            hideModal('userModal');
            await loadDashboardData();
        } else {
            // Crear usuario
            await UserManager.createUser(userData);
            showNotification('Usuario creado exitosamente');
            hideModal('userModal');
            await loadDashboardData();
        }
    } catch (error) {
        showNotification(`Error: ${error.message}`, 'error');
    }
});

    // Función para marcar vehículo como vendido con actualización de tabla
    window.markVehicleAsSold = async function(id) {
        const confirmModal = document.getElementById('confirmModal');
        const confirmMessage = document.getElementById('confirmMessage');
        const confirmYesBtn = document.getElementById('confirmYes');
        
        confirmMessage.textContent = `¿Está seguro de marcar este vehículo como vendido?`;
        
        confirmYesBtn.onclick = async () => {
            try {
                showNotification('Procesando...', 'info');
                await VehicleManager.markAsSold(id);
                hideModal('confirmModal');
                showNotification('Vehículo marcado como vendido exitosamente');
                loadDashboardData(); // Recargar datos para actualizar la tabla
            } catch (error) {
                console.error(`Error al marcar como vendido:`, error);
                showNotification('Error al marcar como vendido: ' + error.message, 'error');
            }
        };
        
        showModal('confirmModal');
    };

    // Mejorar función de eliminación para actualizar tablas
    window.handleDelete = function(type, id) {
        const confirmModal = document.getElementById('confirmModal');
        const confirmMessage = document.getElementById('confirmMessage');
        const confirmYesBtn = document.getElementById('confirmYes');

        let entityName = '';
        switch(type) {
            case 'users': entityName = 'usuario'; break;
            case 'vehicles': entityName = 'vehículo'; break;
            case 'purchases': entityName = 'compra'; break;
            case 'visits': entityName = 'visita'; break;
        }

        confirmMessage.textContent = `¿Está seguro de eliminar este ${entityName}?`;
        
        confirmYesBtn.onclick = async () => {
            try {
                showNotification('Procesando...', 'info');
                
                switch (type) {
                    case 'users':
                        await UserManager.deleteUser(id);
                        break;
                    case 'vehicles':
                        await VehicleManager.deleteVehicle(id);
                        break;
                    case 'purchases':
                        await PurchaseManager.deletePurchase(id);
                        break;
                    case 'visits':
                        // Si se implementa eliminación de visitas
                        break;
                }
                hideModal('confirmModal');
                showNotification(`${entityName} eliminado exitosamente`);
                loadDashboardData(); // Recargar datos para actualizar la tabla
            } catch (error) {
                console.error(`Error al eliminar ${entityName}:`, error);
                showNotification(`Error al eliminar ${entityName}: ` + error.message, 'error');
            }
        };

        showModal('confirmModal');
    };


// Actualización más robusta de la tabla de vehículos
function updateVehiclesTable(vehicles) {
    const tableBody = document.querySelector('#vehiclesTable tbody');
    
    // Limpiar tabla
    tableBody.innerHTML = '';

    // Verificar estructura de datos
    const vehicleList = vehicles.data || vehicles;
    
    if (!Array.isArray(vehicleList)) {
        tableBody.innerHTML = '<tr><td colspan="7">Error al cargar vehículos</td></tr>';
        return;
    }

    // Llenar tabla
    vehicleList.forEach(vehicle => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${vehicle.id}</td>
            <td>${vehicle.marca}</td>
            <td>${vehicle.modelo}</td>
            <td>${vehicle.año}</td>
            <td>${formatCurrency(vehicle.precio)}</td>
            <td>${vehicle.kilometraje}</td>
            <td>${vehicle.estado || 'disponible'}</td>
            <td>
                <button class="btn btn-primary btn-edit" data-id="${vehicle.id}">
                    <i class="fas fa-edit"></i> Editar
                </button>
                ${vehicle.estado !== 'vendido' ? `
                <button class="btn btn-success btn-sold" data-id="${vehicle.id}">
                    <i class="fas fa-check"></i> Vendido
                </button>` : ''}
                <button class="btn btn-danger btn-delete" data-id="${vehicle.id}">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Añadir event listeners para los botones
    document.querySelectorAll('#vehiclesTable .btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('.btn-edit').dataset.id;
            handleEdit('vehicles', id);
        });
    });
    
    document.querySelectorAll('#vehiclesTable .btn-sold').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('.btn-sold').dataset.id;
            markVehicleAsSold(id);
        });
    });
    
    document.querySelectorAll('#vehiclesTable .btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('.btn-delete').dataset.id;
            handleDelete('vehicles', id);
        });
    });
}

// Formatear moneda
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

// Versión corregida
function updatePurchasesTable(purchases) {
    const tableBody = document.querySelector('#purchasesTable tbody');
    
    // Verificar estructura de datos
    const compras = purchases.data || purchases;
    
    if (!Array.isArray(compras)) {
        console.error('Datos de compras inválidos:', purchases);
        tableBody.innerHTML = '<tr><td colspan="7">Error al cargar compras</td></tr>';
        return;
    }

    tableBody.innerHTML = compras.map(purchase => `
        <tr>
            <td>${purchase.user_id || 'N/A'}</td>
            <td>${purchase.vehicle_id || 'N/A'}</td>
            <td>${new Date(purchase.fecha).toLocaleDateString() || 'N/A'}</td>
            <td>${purchase.metodo_pago || 'N/A'}</td>
            <td>${formatCurrency(purchase.precio_total) || 'N/A'}</td>
            <td><span class="status-badge ${purchase.estado.toLowerCase()}">${purchase.estado}</span></td>
            <td>
                <button class="btn btn-primary btn-edit" data-id="${purchase.id}">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger btn-delete" data-id="${purchase.id}">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </td>
        </tr>
    `).join('');

    // Añadir event listeners para los botones
    document.querySelectorAll('#purchasesTable .btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('.btn-edit').dataset.id;
            handleEdit('purchases', id);
        });
    });
    
    document.querySelectorAll('#purchasesTable .btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('.btn-delete').dataset.id;
            handleDelete('purchases', id);
        });
    });
}

function updateVisitsTable(visits) {
    const tableBody = document.querySelector('#visitsTable tbody');
    tableBody.innerHTML = '';

    // Verificar si visits es un array
    if (!Array.isArray(visits)) {
        console.error('Datos de visitas inválidos:', visits);
        tableBody.innerHTML = '<tr><td colspan="6">Error al cargar visitas</td></tr>';
        return;
    }

    // Llenar la tabla
    tableBody.innerHTML = visits.map(visit => `
        <tr>
            <td>${visit.user_id || 'N/A'}</td>
            <td>${visit.vehicle_id || 'N/A'}</td>
            <td>${new Date(visit.fecha).toLocaleDateString() || 'N/A'}</td>
            <td>${visit.asistio ? 'Sí' : 'No'}</td>
            <td>
                <button class="btn btn-sm btn-danger btn-delete" data-id="${visit.id}">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </td>
        </tr>
    `).join('');

    // Añadir event listeners para eliminar
    // En updateVisitsTable
document.querySelectorAll('#visitsTable .btn-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const id = e.target.closest('.btn-delete').dataset.id;
        handleDelete('visits', id);
    });
});
}

// Función para cambiar entre secciones
function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    document.querySelector(`#${sectionId}`).style.display = 'block';

    // Actualizar navegación activa
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

    
}
// Cargar selects en modales
async function loadModalSelects() {
    try {
        const [users, vehicles] = await Promise.all([
            UserManager.getAllUsers(),
            VehicleManager.getAllVehicles()
        ]);

        // Actualizar selects de usuarios
        const userSelects = document.querySelectorAll('select[name="userId"]');
        const userOptions = users.map(user => 
            `<option value="${user.id}">${user.nombre} (${user.email})</option>`
        ).join('');

        userSelects.forEach(select => {
            select.innerHTML = '<option value="">Seleccione un usuario</option>' + userOptions;
        });

        // Actualizar selects de vehículos
        const vehicleSelects = document.querySelectorAll('select[name="vehicleId"]');
        const vehicleOptions = vehicles.data.map(vehicle => 
            `<option value="${vehicle.id}">${vehicle.marca} ${vehicle.modelo} (${vehicle.año})</option>`
        ).join('');

        vehicleSelects.forEach(select => {
            select.innerHTML = '<option value="">Seleccione un vehículo</option>' + vehicleOptions;
        });
    } catch (error) {
        console.error('Error al cargar datos para los selects:', error);
        showNotification('Error al cargar datos de los formularios', 'error');
    }

    // Formulario de usuario
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // Adaptar nombres de campos según la API
            const userData = {
                nombre: userForm.name.value,
                email: userForm.email.value,
                telefono: userForm.phone.value,
                rol: userForm.role.value
            };

            if (userForm.password.value) {
                userData.password = userForm.password.value;
            }
            if (userForm.phone.value === "undefined" || userForm.phone.value === "") {
                userData.telefono = null;
            } else {
                userData.telefono = userForm.phone.value;
            }

            try {
                const userId = userForm.dataset.userId;
                console.log('ID del usuario a actualizar:', userId);
                console.log('Datos del usuario:', userData);
                
                if (userId) {
                    await UserManager.updateUser(userId, userData);
                    showNotification('Usuario actualizado exitosamente');
                } else {
                    await UserManager.createUser(userData);
                    showNotification('Usuario creado exitosamente');
                }
                hideModal('userModal');
                loadDashboardData();
            } catch (error) {
                console.error('Error al procesar el usuario:', error);
                showNotification('Error al procesar el usuario', 'error');
            }
        });
    }
    // Dentro de loadModalSelects(), modificar el submit handler:
const purchaseForm = document.getElementById('purchaseForm');
if (purchaseForm) {
    purchaseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const purchaseData = {
            metodoPago: purchaseForm.paymentMethod.value,  
            estado: purchaseForm.status.value
        };

        try {
            const purchaseId = purchaseForm.dataset.purchaseId;
            if (purchaseId) {
                await PurchaseManager.updatePurchase(purchaseId, purchaseData);
                showNotification('Compra actualizada exitosamente');
            }
            hideModal('purchaseModal');
            loadDashboardData();
        } catch (error) {
            console.error('Error al procesar la compra:', error);
            showNotification('Error al procesar la compra', 'error');
        }
    });

    }

    // Formulario de visita
const visitForm = document.getElementById("visitForm");
if (visitForm) {
  visitForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Leemos directamente los campos name="userId", name="vehicleId", name="date", name="status"
    const visitData = {
      userId:    visitForm.userId.value,
      vehicleId: visitForm.vehicleId.value,
      date:      visitForm.date.value,    // “YYYY-MM-DD” o con hh:mm:ss si lo permites
      status:    visitForm.status.value   // debe ser "si" o "no"
    };

    try {
      await VisitManager.createVisit(visitData);
      showNotification("Visita registrada exitosamente", "success");
      hideModal("visitModal");
      // y recargamos la tabla:
      const visits = await VisitManager.getAllVisits();
      updateVisitsTable(visits);
    } catch (err) {
      console.error("Error al crear visita:", err);
      showNotification("Error al registrar visita: " + err.message, "error");
    }
  });
}
}
// Manejar edición de elementos
async function handleEdit(type, id) {
    try {
        switch (type) {
            case 'users':
                const user = await UserManager.getUserById(id);
                if (user) {
                    const userForm = document.getElementById('userForm');
                    userForm.dataset.userId = user.id;
                    userForm.name.value = user.nombre || '';
                    userForm.email.value = user.email || '';
                    userForm.phone.value = user.telefono || '';
                    userForm.role.value = user.rol || 'user';
                    userForm.password.value = ''; 
                    showModal('userModal');
                }
                break;
                
                case 'vehicles':
                    const vehicleResponse = await VehicleManager.getVehicleById(id);
                    if (vehicleResponse && vehicleResponse.data) {
                        const vehicle = vehicleResponse.data;
                        const vehicleForm = document.getElementById('vehicleForm');
                        document.getElementById('editVehicleId').value = vehicle.id;
                        document.getElementById('editMarca').value = vehicle.marca || '';
                        document.getElementById('editModelo').value = vehicle.modelo || '';
                        document.getElementById('editAño').value = vehicle.año || '';
                        document.getElementById('editPrecio').value = vehicle.precio || '';
                        document.getElementById('editKilometraje').value = vehicle.kilometraje || '';
                        showModal('vehicleModal');
                    }
                    break;
                
            case 'purchases':
                const data = await PurchaseManager.getPurchaseById(id);
                const modalId = 'purchaseModal';
                await loadModalSelects();
                fillPurchaseForm(data);
                showModal(modalId);
                break;
            case 'visits':
                const visits = await VisitManager.getAllVisits();
                updateVisitsTable(visits.data || visits);
        }
    } catch (error) {
        console.error(`Error al obtener datos para edición:`, error);
        showNotification('Error al cargar datos para edición', 'error');
    }
}

function fillPurchaseForm(purchaseData) {
    const form = document.getElementById('purchaseForm');
    form.dataset.purchaseId = purchaseData.id;
    
    // Solo establecer método de pago y estado
    if (form.paymentMethod) {
        form.paymentMethod.value = purchaseData.metodoPago || 'Tarjeta';
    }
    
    if (form.status) {
        form.status.value = purchaseData.estado || 'Completado';
    }
    
    console.log('Formulario de compra llenado con:', purchaseData);
}

// Manejar eliminación de elementos
async function handleDelete(type, id) {
    const confirmModal = document.getElementById('confirmModal');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmYesBtn = document.getElementById('confirmYes');

    let entityName = '';
    switch(type) {
        case 'users': entityName = 'usuario'; break;
        case 'vehicles': entityName = 'vehículo'; break;
        case 'purchases': entityName = 'compra'; break;
        case 'visits': entityName = 'visita'; break;
    }

    confirmMessage.textContent = `¿Está seguro de eliminar este ${entityName}?`;
    
    confirmYesBtn.onclick = async () => {
        try {
            showNotification('Procesando...', 'info');
            let result;
            
            switch (type) {
                case 'users':
                    result = await UserManager.deleteUser(id);
                    break;
                case 'vehicles':
                    result = await VehicleManager.deleteVehicle(id);
                    break;
                case 'purchases':
                    result = await PurchaseManager.deletePurchase(id);
                    break;
                case 'visits':
                    result =  await VisitManager.deleteVisit(id);
                    break;
            }
            hideModal('confirmModal');
            showNotification(`${entityName} eliminado exitosamente`);
            
            if (type === 'purchases') {
                // Para compras, solo recargamos la tabla de compras
                const purchases = await PurchaseManager.getAllPurchases();
                updatePurchasesTable(purchases.data || purchases);
            } else {
                // Para otros tipos, recargamos todos los datos
                loadDashboardData();
            }
        } catch (error) {
            console.error(`Error al eliminar ${entityName}:`, error);
            showNotification(`Error al eliminar ${entityName}: ${error.message}`, 'error');
        }
    };
    loadDashboardData();
    showModal('confirmModal');
}

// Función para cargar todos los vehículos
async function loadAllVehicles() {
    try {
        const vehicles = await VehicleManager.getAllVehicles();
        displayVehicles(vehicles.data || vehicles);
    } catch (error) {
        showNotification('Error al cargar vehículos: ' + error.message, 'error');
    }
}

// Función para cargar la tabla de compras
function loadPurchasesTable() {
    const purchasesTableBody = document.querySelector('#purchasesTable tbody');
    if (!purchasesTableBody) return;

    purchasesTableBody.innerHTML = '<tr><td colspan="7" class="text-center">Cargando compras...</td></tr>';

    PurchaseManager.getAllPurchases()
        .then(response => {
            console.log('Respuesta de compras:', response);
            const purchases = Array.isArray(response) ? response : (response.data || []);
            
            if (!purchases || purchases.length === 0) {
                purchasesTableBody.innerHTML = '<tr><td colspan="7" class="text-center">No hay compras registradas</td></tr>';
                return;
            }

            displayPurchases(purchases);
        })
        .catch(error => {
            console.error('Error al cargar compras:', error);
            purchasesTableBody.innerHTML = '<tr><td colspan="7" class="text-center">Error al cargar compras</td></tr>';
        });
}

// Función para mostrar los vehículos en la tabla
 function displayVehicles(vehicles) {
    const tableBody = document.querySelector('#vehiclesTable tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    vehicles.forEach(vehicle => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${vehicle.id}</td>
            <td>${vehicle.marca}</td>
            <td>${vehicle.modelo}</td>
            <td>${vehicle.año}</td>
            <td>${vehicle.precio}</td>
            <td>${vehicle.kilometraje}</td>
            <td>${vehicle.estado || 'disponible'}</td>
            <td>
                <button class="btn btn-sm btn-primary edit-vehicle" data-id="${vehicle.id}">Editar</button>
                <button class="btn btn-sm btn-success mark-sold" data-id="${vehicle.id}">Marcar Vendido</button>
                <button class="btn btn-sm btn-danger delete-vehicle" data-id="${vehicle.id}">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Añadir event listeners a los botones de acción
    document.querySelectorAll('.edit-vehicle').forEach(btn => {
        btn.addEventListener('click', () => editVehicle(btn.dataset.id));
    });
    
    document.querySelectorAll('.mark-sold').forEach(btn => {
        btn.addEventListener('click', () => markVehicleAsSold(btn.dataset.id));
    });
    
    document.querySelectorAll('.delete-vehicle').forEach(btn => {
        btn.addEventListener('click', () => deleteVehicle(btn.dataset.id));
    });
}



// Función para marcar un vehículo como vendido
async function markVehicleAsSold(id) {
    if (confirm('¿Está seguro de marcar este vehículo como vendido?')) {
        try {
            await VehicleManager.markAsSold(id);
            showNotification('Vehículo marcado como vendido exitosamente');
            loadAllVehicles();
        } catch (error) {
            showNotification('Error al marcar vehículo como vendido: ' + error.message, 'error');
        }
    }
}

// Función para mostrar las compras en la tabla
function displayPurchases(purchases) {
    const tableBody = document.querySelector('#purchasesTable tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    purchases.forEach(purchase => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${purchase.id}</td>
            <td>${purchase.user_id}</td>
            <td>${purchase.vehicle_id}</td>
            <td>${new Date(purchase.fecha).toLocaleDateString()}</td>
            <td>${purchase.precio_total}</td>
            <td>${purchase.metodo_pago}</td>
            <td>${purchase.estado}</td>
            <td>
                <button class="btn btn-sm btn-primary edit-purchase" data-id="${purchase.id}">Editar</button>
                <button class="btn btn-sm btn-success complete-purchase" data-id="${purchase.id}">Completar</button>
                <button class="btn btn-sm btn-danger delete-purchase" data-id="${purchase.id}">Cancelar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Añadir event listeners a los botones de acción
    document.querySelectorAll('.edit-purchase').forEach(btn => {
        btn.addEventListener('click', () => editPurchase(btn.dataset.id));
    });
    
    document.querySelectorAll('.complete-purchase').forEach(btn => {
        btn.addEventListener('click', () => completePurchase(btn.dataset.id));
    });
    
    document.querySelectorAll('.delete-purchase').forEach(btn => {
        btn.addEventListener('click', () => deletePurchase(btn.dataset.id));
    });
}



// Función para mostrar las visitas en la tabla
function displayVisits(visits) {
    const tableBody = document.querySelector('#visitsTable tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    visits.forEach(visit => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${visit.id}</td>
            <td>${visit.user_id}</td>
            <td>${visit.vehicle_id}</td>
            <td>${new Date(visit.fecha).toLocaleDateString()}</td>
            <td>${visit.asistio ? 'Sí' : 'No'}</td>
            <td>
                <button class="btn btn-sm btn-primary create-purchase" data-id="${visit.id}" 
                data-user="${visit.user_id}" data-vehicle="${visit.vehicle_id}">Crear Compra</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Añadir event listeners a los botones de acción
    document.querySelectorAll('.create-purchase').forEach(btn => {
        btn.addEventListener('click', () => createPurchaseFromVisit(
            btn.dataset.id, 
            btn.dataset.user, 
            btn.dataset.vehicle
        ));
    });
}

// Exportar las clases para uso en otros módulos
export {
    UserManager,
    VehicleManager,
    PurchaseManager,
    VisitManager
};