/**
 * Authentication service for managing user sessions
 * Simple in-memory storage for MVP implementation
 */

const { validatePassword } = require('../utils/passwordValidator');

// In-memory storage for user sessions and credentials
// In production, this should be replaced with a proper database
const userSessions = new Map(); // number -> { authenticated: boolean, loginAttempts: number }
const userCredentials = new Map(); // number -> { password: string }
const pendingRegistrations = new Map(); // number -> { step: 'waiting_password' | 'waiting_confirmation', password?: string }

/**
 * Check if user is authenticated
 */
function isAuthenticated(number) {
    const session = userSessions.get(number);
    return session && session.authenticated === true;
}

/**
 * Check if user is registered
 */
function isRegistered(number) {
    return userCredentials.has(number);
}

/**
 * Start registration process
 */
function startRegistration(number) {
    pendingRegistrations.set(number, { step: 'waiting_password' });
}

/**
 * Handle registration password step
 */
function handleRegistrationPassword(number, password) {
    const validation = validatePassword(password);
    
    if (!validation.isValid) {
        return {
            success: false,
            message: validation.message,
            nextStep: 'waiting_password'
        };
    }

    pendingRegistrations.set(number, { 
        step: 'waiting_confirmation', 
        password: password 
    });
    
    return {
        success: true,
        message: "Contraseña válida. Por favor, confirma tu contraseña escribiéndola nuevamente:",
        nextStep: 'waiting_confirmation'
    };
}

/**
 * Handle registration confirmation step
 */
function handleRegistrationConfirmation(number, confirmPassword) {
    const pending = pendingRegistrations.get(number);
    
    if (!pending || pending.step !== 'waiting_confirmation') {
        return {
            success: false,
            message: "Error en el proceso de registro. Reinicia el registro.",
            nextStep: null
        };
    }

    if (pending.password !== confirmPassword) {
        return {
            success: false,
            message: "Las contraseñas no coinciden. Por favor, confirma tu contraseña:",
            nextStep: 'waiting_confirmation'
        };
    }

    // Complete registration
    userCredentials.set(number, { password: pending.password });
    userSessions.set(number, { authenticated: true, loginAttempts: 0 });
    pendingRegistrations.delete(number);

    return {
        success: true,
        message: "¡Registro completado exitosamente! Ya puedes usar el servicio.",
        nextStep: null
    };
}

/**
 * Get registration step for user
 */
function getRegistrationStep(number) {
    const pending = pendingRegistrations.get(number);
    return pending ? pending.step : null;
}

/**
 * Attempt login with password
 */
function attemptLogin(number, password) {
    const credentials = userCredentials.get(number);
    
    if (!credentials) {
        return {
            success: false,
            message: "Usuario no registrado. Usa 'registrar' para crear una cuenta."
        };
    }

    const session = userSessions.get(number) || { authenticated: false, loginAttempts: 0 };
    
    if (credentials.password === password) {
        // Successful login
        userSessions.set(number, { authenticated: true, loginAttempts: 0 });
        return {
            success: true,
            message: "¡Login exitoso! Ya puedes usar el servicio."
        };
    } else {
        // Failed login
        session.loginAttempts = (session.loginAttempts || 0) + 1;
        userSessions.set(number, session);
        
        return {
            success: false,
            message: `Contraseña incorrecta. Intentos fallidos: ${session.loginAttempts}`
        };
    }
}

/**
 * Logout user
 */
function logout(number) {
    const session = userSessions.get(number);
    if (session) {
        session.authenticated = false;
        userSessions.set(number, session);
    }
    return {
        success: true,
        message: "Has cerrado sesión exitosamente."
    };
}

/**
 * Get authentication requirements message
 */
function getAuthRequiredMessage() {
    return "🔐 Para usar este servicio necesitas autenticarte.\n\n" +
           "Opciones disponibles:\n" +
           "• Escribe 'login [tu_contraseña]' si ya tienes cuenta\n" +
           "• Escribe 'registrar' para crear una nueva cuenta\n\n" +
           "Ejemplo: login MiContraseña123!";
}

/**
 * Get registration instructions
 */
function getRegistrationInstructions() {
    return "📝 *Registro de nueva cuenta*\n\n" +
           "Tu contraseña debe cumplir los siguientes requisitos:\n" +
           "✅ Al menos 8 caracteres\n" +
           "✅ Al menos una letra mayúscula (A-Z)\n" +
           "✅ Al menos una letra minúscula (a-z)\n" +
           "✅ Al menos un número (0-9)\n" +
           "✅ Al menos un carácter especial (!@#$%^&*(),.?\":{}|<>)\n\n" +
           "Por favor, escribe tu nueva contraseña:";
}

module.exports = {
    isAuthenticated,
    isRegistered,
    startRegistration,
    handleRegistrationPassword,
    handleRegistrationConfirmation,
    getRegistrationStep,
    attemptLogin,
    logout,
    getAuthRequiredMessage,
    getRegistrationInstructions
};