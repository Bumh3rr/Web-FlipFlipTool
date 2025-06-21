// Variables globales
let userData = {};
let tallerData = {};

// Funciones para manejar modales
function openUserModal() {
    //document.getElementById('userModal').style.display = 'block';
    //document.body.style.overflow = 'hidden';

    document.getElementById('userModal').style.display = 'none';
    document.getElementById('tallerModal').style.display = 'block';
}

function closeUserModal() {
    document.getElementById('userModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    resetUserForm();
}

function openTallerModal() {
    document.getElementById('userModal').style.display = 'none';
    document.getElementById('tallerModal').style.display = 'block';
}

function closeTallerModal() {
    document.getElementById('tallerModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    resetTallerForm();
}

function backToUserModal() {
    document.getElementById('tallerModal').style.display = 'none';
    document.getElementById('userModal').style.display = 'block';
}

// Función para alternar visibilidad de contraseña
function togglePassword(fieldId) {
    const passwordValidation = validatePasswords(password, confirmPassword);
    if (!passwordValidation.valid) {
        showError(passwordValidation.message);
        return;
    }

    // Guardar datos del usuario
    userData = {
        firstName,
        lastName,
        email,
        phone: countryCode + phone,
        username,
        password
    };

    // Mostrar loading
    document.getElementById('userLoading').style.display = 'block';
    document.getElementById('userSubmitBtn').disabled = true;

    // Simular validación (aquí podrías hacer una validación previa del usuario)
    setTimeout(() => {
        document.getElementById('userLoading').style.display = 'none';
        document.getElementById('userSubmitBtn').disabled = false;

        // Abrir modal del taller
        openTallerModal();
    }, 1500);
}

// Datos de municipios por estado (ejemplo con algunos estados)
const municipiosPorEstado = {
    'guerrero': [
        'Acapulco de Juárez',
        'Chilpancingo de los Bravo',
        'Iguala de la Independencia',
        'Taxco de Alarcón',
        'Zihuatanejo de Azueta',
        'Tlapa de Comonfort',
        'Chilapa de Álvarez',
        'Acatepec',
        'Ahuacuotzingo',
        'Ajuchitlán del Progreso'
    ],
    'cdmx': [
        'Álvaro Obregón',
        'Azcapotzalco',
        'Benito Juárez',
        'Coyoacán',
        'Cuajimalpa de Morelos',
        'Gustavo A. Madero',
        'Iztacalco',
        'Iztapalapa',
        'La Magdalena Contreras',
        'Miguel Hidalgo',
        'Milpa Alta',
        'Tláhuac',
        'Tlalpan',
        'Venustiano Carranza',
        'Xochimilco'
    ],
    'jalisco': [
        'Guadalajara',
        'Zapopan',
        'Tlaquepaque',
        'Tonalá',
        'Puerto Vallarta',
        'Tlajomulco de Zúñiga',
        'El Salto',
        'Chapala',
        'Ocotlán',
        'Lagos de Moreno'
    ],
    'nuevo-leon': [
        'Monterrey',
        'Guadalupe',
        'San Nicolás de los Garza',
        'Apodaca',
        'General Escobedo',
        'Santa Catarina',
        'San Pedro Garza García',
        'Juárez',
        'Cadereyta Jiménez',
        'García'
    ],
    'veracruz': [
        'Veracruz',
        'Xalapa',
        'Coatzacoalcos',
        'Córdoba',
        'Poza Rica de Hidalgo',
        'Minatitlán',
        'Boca del Río',
        'Orizaba',
        'Tuxpan',
        'Martínez de la Torre'
    ]
    // Agregar más estados según necesites
};

// Manejar cambio de estado
document.getElementById('estado').addEventListener('change', function () {
    const estadoSeleccionado = this.value;
    const municipioSelect = document.getElementById('municipio');

    // Limpiar municipios
    municipioSelect.innerHTML = '<option value="">Seleccione el Municipio</option>';

    if (estadoSeleccionado && municipiosPorEstado[estadoSeleccionado]) {
        municipiosPorEstado[estadoSeleccionado].forEach(municipio => {
            const option = document.createElement('option');
            option.value = municipio.toLowerCase().replace(/\s+/g, '-');
            option.textContent = municipio;
            municipioSelect.appendChild(option);
        });
    }
});

// Manejo del formulario de taller
document.getElementById('tallerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const tallerName = document.getElementById('tallerName').value.trim();
    const tallerCountryCode = document.getElementById('tallerCountryCode').value;
    const tallerPhone = document.getElementById('tallerPhone').value.trim();
    const tallerEmail = document.getElementById('tallerEmail').value.trim();
    const estado = document.getElementById('estado').value;
    const municipio = document.getElementById('municipio').value;
    const codigoPostal = document.getElementById('codigoPostal').value.trim();
    const referencias = document.getElementById('referencias').value.trim();

    // Validaciones
    if (!tallerName) {
        showError('Por favor ingresa el nombre del taller');
        return;
    }

    if (!isValidPhone(tallerPhone)) {
        showError('Por favor ingresa un número de teléfono válido para el taller');
        return;
    }

    if (!isValidEmail(tallerEmail)) {
        showError('Por favor ingresa un email válido para el taller');
        return;
    }

    if (!estado || !municipio) {
        showError('Por favor selecciona el estado y municipio');
        return;
    }

    if (!codigoPostal || !/^\d{5}$/.test(codigoPostal)) {
        showError('Por favor ingresa un código postal válido (5 dígitos)');
        return;
    }

    // Guardar datos del taller
    tallerData = {
        name: tallerName,
        phone: tallerCountryCode + tallerPhone,
        email: tallerEmail,
        estado,
        municipio,
        codigoPostal,
        referencias
    };

    // Mostrar loading
    document.getElementById('tallerLoading').style.display = 'block';
    document.getElementById('tallerSubmitBtn').disabled = true;

    // Enviar datos a la API
    try {
        await submitRegistration();
    } catch (error) {
        console.error('Error en el registro:', error);
        showError('Hubo un error al procesar el registro. Por favor intenta nuevamente.');
        document.getElementById('tallerLoading').style.display = 'none';
        document.getElementById('tallerSubmitBtn').disabled = false;
    }
});

// Función para enviar datos a la API
async function submitRegistration() {
    const registrationData = {
        user: userData,
        taller: tallerData,
        timestamp: new Date().toISOString()
    };

    try {
        // Aquí puedes cambiar la URL por tu endpoint real
        const response = await fetch('https://tu-api.com/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(registrationData)
        });

        const result = await response.json();

        document.getElementById('tallerLoading').style.display = 'none';
        document.getElementById('tallerSubmitBtn').disabled = false;

        if (response.ok) {
            showSuccess('¡Registro completado exitosamente! Pronto recibirás información sobre tu cuenta.');
            closeTallerModal();
            resetUserForm();
            resetTallerForm();
        } else {
            throw new Error(result.message || 'Error en el servidor');
        }
    } catch (error) {
        // Si falla la conexión a la API, mostrar los datos en consola para desarrollo
        console.log('Datos que se enviarían a la API:', registrationData);

        document.getElementById('tallerLoading').style.display = 'none';
        document.getElementById('tallerSubmitBtn').disabled = false;

        showSuccess('Registro completado (modo desarrollo). Revisa la consola para ver los datos.');
        closeTallerModal();
        resetUserForm();
        resetTallerForm();
    }
}

// Cerrar modales al hacer clic fuera de ellos
window.addEventListener('click', function (event) {
    const userModal = document.getElementById('userModal');
    const tallerModal = document.getElementById('tallerModal');

    if (event.target === userModal) {
        closeUserModal();
    }
    if (event.target === tallerModal) {
        closeTallerModal();
    }
});

// Navegación suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Manejo de tecla Escape para cerrar modales
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        if (document.getElementById('tallerModal').style.display === 'block') {
            closeTallerModal();
        } else if (document.getElementById('userModal').style.display === 'block') {
            closeUserModal();
        }
    }
});

// Validación en tiempo real para campos específicos
document.getElementById('email').addEventListener('blur', function () {
    if (this.value && !isValidEmail(this.value)) {
        this.style.borderColor = '#ff6b6b';
    } else {
        this.style.borderColor = '#555';
    }
});

document.getElementById('phone').addEventListener('blur', function () {
    if (this.value && !isValidPhone(this.value)) {
        this.style.borderColor = '#ff6b6b';
    } else {
        this.style.borderColor = '#555';
    }
});

document.getElementById('tallerEmail').addEventListener('blur', function () {
    if (this.value && !isValidEmail(this.value)) {
        this.style.borderColor = '#ff6b6b';
    } else {
        this.style.borderColor = '#555';
    }
});

document.getElementById('tallerPhone').addEventListener('blur', function () {
    if (this.value && !isValidPhone(this.value)) {
        this.style.borderColor = '#ff6b6b';
    } else {
        this.style.borderColor = '#555';
    }
});

// Función para formatear número de teléfono mientras se escribe
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);

    if (value.length >= 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    } else if (value.length >= 3) {
        value = value.replace(/(\d{3})(\d{3})/, '$1 $2');
    }

    input.value = value;
}

document.getElementById('phone').addEventListener('input', function () {
    formatPhoneNumber(this);
});

document.getElementById('tallerPhone').addEventListener('input', function () {
    formatPhoneNumber(this);
});

// Manejo de botones de dirección (placeholder para funcionalidad futura)
document.querySelectorAll('.address-btn').forEach(button => {
    button.addEventListener('click', function () {
        const action = this.textContent.includes('colonia') ? 'colonia' : 'calle';
        const value = prompt(`Ingresa la ${action}:`);
        if (value) {
            this.textContent = `${action}: ${value}`;
            this.style.color = '#4ecdc4';
        }
    });
});

console.log('TallerCell - Sistema de gestión de talleres de celulares cargado correctamente'); field = document.getElementById(fieldId);
const button = field.nextElementSibling;
if (field.type === 'password') {
    field.type = 'text';
    button.textContent = '🙈';
} else {
    field.type = 'password';
    button.textContent = '👁️';
}

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para validar teléfono
function isValidPhone(phone) {
    const phoneRegex = /^\d{10,15}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
}

// Función para validar contraseñas
function validatePasswords(password, confirmPassword) {
    if (password.length < 6) {
        return { valid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
    }
    if (password !== confirmPassword) {
        return { valid: false, message: 'Las contraseñas no coinciden' };
    }
    return { valid: true };
}

// Función para mostrar mensaje de error
function showError(message) {
    alert(message); // En producción, usar un sistema de notificaciones más elegante
}

// Función para mostrar mensaje de éxito
function showSuccess(message) {
    alert(message); // En producción, usar un sistema de notificaciones más elegante
}

// Función para resetear formulario de usuario
function resetUserForm() {
    document.getElementById('userForm').reset();
    userData = {};
}

// Función para resetear formulario de taller
function resetTallerForm() {
    document.getElementById('tallerForm').reset();
    tallerData = {};
}

// Manejo del formulario de usuario
document.getElementById('userForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const countryCode = document.getElementById('countryCode').value;
    const phone = document.getElementById('phone').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
});
