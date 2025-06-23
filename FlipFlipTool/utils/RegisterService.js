export class RegisterService {
    constructor(baseUrl = 'http://localhost:8080') {
        this.baseUrl = baseUrl;
    }

    async register(code_otp, data) {
        try {
            // Enviar el código OTP como parámetro de consulta y los datos en el body
            const response = await fetch(`${this.baseUrl}/auth/register?code_otp=${encodeURIComponent(code_otp)}`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                    //'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify(data) // Solo los datos en el body
            });

            if (!response.ok) {
                let errorMessage = '';
                try {
                    errorMessage = await response.text();
                } catch (error) {
                    errorMessage = `Error ${response.status}: No se pudo obtener el mensaje de error.`;
                }
                throw new Error(errorMessage);
            }

            return await response.json();
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Error de conexión. Verifique su conexión a internet.');
            }
            throw error;
        }
    }
}