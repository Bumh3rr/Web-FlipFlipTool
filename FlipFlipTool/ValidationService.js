export class ValidationService {
    constructor() {
        this.patterns = {
            phone: /^(\+52\s?)?(\d{2}\s?\d{4}\s?\d{4}|\d{3}\s?\d{3}\s?\d{4}|\d{10})$/,
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            text: /^[a-zA-ZÀ-ÿ\s]{3,}$/,
            username: /^[a-zA-ZñÑ0-9._-]{3,20}$/,
            address: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s,\\-\\.\\#]+$/
        };
    }

    validateMexicanPhone(phone) {
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        const mexicanPatterns = [
            /^\d{10}$/
        ];
        return mexicanPatterns.some(pattern => pattern.test(cleanPhone));
    }

    validateField(value, type) {
        if (!value || value.trim() === '') return false;
        
        switch (type) {
            case 'phone':
                return this.validateMexicanPhone(value);
            case 'text':
                return this.patterns.text.test(value);
            case 'email':
                return this.patterns.email.test(value);
            case 'username':
                return this.patterns.username.test(value);
            case 'address':
                return this.patterns.address.test(value);
            case 'password':
                return value.length >= 6;
            default:
                return true;
        }
    }

    validateForm() {
        const fields = [
            { id: 'firstname', type: 'text', message: 'El nombre debe tener al menos 3 caracteres y solo contener letras' },
            { id: 'lastname', type: 'text', message: 'El apellido debe tener al menos 3 caracteres y solo contener letras' },
            { id: 'email_user', type: 'email', message: 'El correo electrónico no tiene un formato válido' },
            { id: 'phone_user', type: 'phone', message: 'El teléfono debe tener un formato válido (10 dígitos o con código de área)' },
            { id: 'username', type: 'username', message: 'El nombre de usuario debe tener al menos 3 caracteres y solo contener letras, números o guiones bajos' },
            { id: 'password', type: 'password', message: 'La contraseña debe tener al menos 6 caracteres' },
            { id: 'workshop_name', type: 'text', message: 'El nombre del taller debe tener al menos 3 caracteres y solo contener letras' },
            { id: 'workshop_phone', type: 'phone', message: 'El teléfono del taller debe tener un formato válido' },
            { id: 'address_colony', type: 'address', message: 'La colonia debe tener al menos 3 caracteres' },
            { id: 'address_street', type: 'address', message: 'La calle debe tener al menos 3 caracteres' }
        ];

        for (const field of fields) {
            const element = document.getElementById(field.id);
            if (!element) continue;
            
            const value = element.value.trim();
            if (!this.validateField(value, field.type)) {
                return { isValid: false, message: field.message };
            }
        }

        // Validar confirmación de contraseña
        const password = document.getElementById('password').value.trim();
        const confirmPassword = document.getElementById('confirm_password').value.trim();
        if (password !== confirmPassword) {
            return { isValid: false, message: 'Las contraseñas no coinciden' };
        }

        // Validar selects
        const state = document.getElementById('address_state').value;
        const municipality = document.getElementById('address_municipality').value;
        
        if (!state) return { isValid: false, message: 'Debe seleccionar un estado' };
        if (!municipality) return { isValid: false, message: 'Debe seleccionar un municipio' };

        return { isValid: true, message: 'Validación exitosa' };
    }
}