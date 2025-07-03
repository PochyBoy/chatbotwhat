/**
 * Password validation utility
 * Validates that password contains uppercase, lowercase, numbers and special characters
 */

function validatePassword(password) {
    if (!password || typeof password !== 'string') {
        return {
            isValid: false,
            message: "La contraseña es requerida"
        };
    }

    // Check minimum length
    if (password.length < 8) {
        return {
            isValid: false,
            message: "La contraseña debe tener al menos 8 caracteres"
        };
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
        return {
            isValid: false,
            message: "La contraseña debe contener al menos una letra mayúscula"
        };
    }

    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
        return {
            isValid: false,
            message: "La contraseña debe contener al menos una letra minúscula"
        };
    }

    // Check for number
    if (!/[0-9]/.test(password)) {
        return {
            isValid: false,
            message: "La contraseña debe contener al menos un número"
        };
    }

    // Check for special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return {
            isValid: false,
            message: "La contraseña debe contener al menos un carácter especial (!@#$%^&*(),.?\":{}|<>)"
        };
    }

    return {
        isValid: true,
        message: "Contraseña válida"
    };
}

module.exports = {
    validatePassword
};