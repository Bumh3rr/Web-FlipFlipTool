import { ValidationService } from './ValidationService.js';
import { EmailService } from './EmailService.js';
import { ModalManager } from './ModalManager.js';
import { CountdownTimer } from './CountdownTimer.js';
import { LocationService } from './LocationService.js';

// Instanciar servicios
const validationService = new ValidationService();
const emailService = new EmailService();
const modalManager = new ModalManager();
const countdownTimer = new CountdownTimer();
const locationService = new LocationService();

// Importar Notyf para notificaciones
var notyf = new Notyf({
    duration: 2000,
    position: { x: 'right', y: 'top' }
});

// Función principal de validación y envío
async function validateAndSubmit() {
    try {
        const email = document.getElementById('email_user').value.trim();

        modalManager.closeModal(ModalManager.ModalType.INFO);
        showLoading();

        //await emailService.sendOTP(email);
        countdownTimer.start(60, () => {
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
    const email = document.getElementById('email_user').value.trim();

    try {
        showLoading();
        await emailService.sendOTP(email);
        countdownTimer.start(60, () => {
            countdownTimer.setClickHandler(() => sendAgainOtpEmail());
        });
        hideLoading();
        notyf.success('Código reenviado correctamente, revise su correo electrónico');
    } catch (error) {
        hideLoading();
        notyf.error('Error al reenviar el código, intente nuevamente');
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
}

function closeModal() {
    modalManager.closeModalPop();
}

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', function () {
    // Cargar ubicaciones
    locationService.loadMunicipalities();
    locationService.populateStatesSelect();
    locationService.setupStateChangeListener();

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
            () => validateAndSubmit()
        );
    });
});

// Exponer funciones globales si es necesario
window.validateAndSubmit = validateAndSubmit;
window.sendAgainOtpEmail = sendAgainOtpEmail;
window.closeModal = closeModal;