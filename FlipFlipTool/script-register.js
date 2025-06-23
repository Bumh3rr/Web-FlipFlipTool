import { ValidationService } from './utils/ValidationService.js';
import { EmailService } from './utils/EmailService.js';
import { ModalManager } from './utils/ModalManager.js';
import { CountdownTimer } from './utils/CountdownTimer.js';
import { RegisterService } from './utils/RegisterService.js';

// Instanciar servicios
const validationService = new ValidationService();
const emailService = new EmailService();
const modalManager = new ModalManager();
const countdownTimer = new CountdownTimer();
const registerService = new RegisterService();

// Importar Notyf para notificaciones
var notyf = new Notyf({
    duration: 2000,
    position: { x: 'right', y: 'top' }
});

// Función principal de validación y envío
async function submitSendOtp() {
    try {
        const email = document.getElementById('email').value.trim();

        modalManager.closeModal(ModalManager.ModalType.INFO);
        showLoading();

        await emailService.sendOTP(email);
        countdownTimer.start(10, () => {
            countdownTimer.setClickHandler(() => sendAgainOtpEmail());
        });

        hideLoading();
        showVericationOtp(email);
        notyf.success('Código enviado correctamente, revise su correo electrónico');
    } catch (error) {
        hideLoading();
        modalManager.openError('Se produjo un error :(', error.message);
        notyf.error('Error al enviar el código, intente nuevamente');
    }
}

async function sendAgainOtpEmail() {
    const email = document.getElementById('email').value.trim();

    try {
        showLoading();
        await emailService.sendOTP(email);
        countdownTimer.start(10, () => {
            countdownTimer.setClickHandler(() => sendAgainOtpEmail());
        });
        hideLoading();
        notyf.success('Código reenviado correctamente, revise su correo electrónico');
    } catch (error) {
        hideLoading();
        notyf.error('Error al reenviar el código, intente nuevamente');
    }
}

async function ValidAndRegister() {
    const codeOtp = document.getElementById('code_otp').value.trim();
    const validation = validationService.validateOTP(codeOtp);
    if (!validation.isValid) {
        notyf.error(validation.message);
        return;
    }

    const data = {
        username: document.getElementById('username').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value.trim(),
        firstname: document.getElementById('firstname').value.trim(),
        lastname: document.getElementById('lastname').value.trim(),
        phone: document.getElementById('phone').value.trim(),
    };

    const validationData = validationService.validateOTP(codeOtp);
    if (!validationData.isValid) {
        notyf.error(validationData.message);
        return;
    }

    try {


        showLoading();
        const response = await registerService.register(codeOtp, data);
        hideLoading();

        if (response) {
            notyf.success('Registro exitoso, por favor inicie sesión');
            modalManager.closeModalPop();
            modalManager.openSuccess('Registro Exitoso', 'Su cuenta ha sido creada exitosamente.');
        } else {
            notyf.error('Error al registrar, intente nuevamente');
            throw new Error('No se pudo completar el registro. Por favor, intente nuevamente.');
        }

    } catch (error) {
        hideLoading();
        modalManager.openError('Se produjo un error :(', error.message);
        notyf.error(error.message);
        console.log('Error al registrar:', error);
    }

}

function togglePassword(inputId, iconElement) {
    const passwordInput = document.getElementById(inputId);

    if (passwordInput.type === 'password') {
        // Mostrar contraseña
        passwordInput.type = 'text';
        iconElement.className = 'ri-eye-line toggle-password';
    } else {
        // Ocultar contraseña
        passwordInput.type = 'password';
        iconElement.className = 'ri-eye-off-line toggle-password';
    }
}

// Funciones de utilidad (mantener las existentes)
function showLoading() {
    const loaderBackground = document.getElementById('id-background-loader');
    loaderBackground.classList.remove('hide');
    loaderBackground.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideLoading() {
    const loaderBackground = document.getElementById('id-background-loader');
    loaderBackground.classList.remove('show');
    loaderBackground.classList.add('hide');
    document.body.style.overflow = '';
}

function showVericationOtp(email) {
    document.getElementById('modal-otp').classList.add('show');
    document.getElementById('id-form-card-email').textContent = email;
    document.getElementById('code_otp').value = ''; // Limpiar el campo de código OTP
    document.getElementById('code_otp').focus(); // Enfocar el campo
    document.getElementById('id-send-again').onclick = () => { sendAgainOtpEmail(); } // <- Asignar evento al botón de reenviar OTP
}

function closeModal() {
    modalManager.closeModalPop();
}

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', function () {
    // Configurar evento del botón de registro
    document.getElementById('button-register').addEventListener('click', function (e) {
        e.preventDefault(); // <- 

        const validation = validationService.validateForm();
        if (!validation.isValid) {
            modalManager.openWarning(validation.message);
            return;
        }

        modalManager.openInfo(
            'Información de Registro',
            'Por favor, confirme su información antes de continuar.',
            () => submitSendOtp()
        );
    });

    document.getElementById('id-button-verify-otp').addEventListener('click', function (e) {
        e.preventDefault(); // <- 
        ValidAndRegister();
    });
});

// Exponer funciones globales si es necesario
window.register = ValidAndRegister;
window.sendAgainOtpEmail = sendAgainOtpEmail;
window.closeModal = closeModal;
window.togglePassword = togglePassword;