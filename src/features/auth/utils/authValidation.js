const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSignIn({ email, password, acceptedTerms }) {
    return {
        email: getEmailError(email),
        password: getPasswordError(password),
        acceptedTerms: getTermsError(acceptedTerms),
    };
}

export function validateSignUp({ email, password, confirmPassword, acceptedTerms }) {
    return {
        email: getEmailError(email),
        password: getPasswordError(password),
        confirmPassword: getConfirmPasswordError(password, confirmPassword),
        acceptedTerms: getTermsError(acceptedTerms),
    };
}

export function validateForgotPassword({ email }) {
    return {
        email: getEmailError(email),
    };
}

export function hasValidationErrors(validationState) {
    return Object.values(validationState).some(Boolean);
}

function getEmailError(email) {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
        return 'Email address is required';
    }

    if (!emailPattern.test(trimmedEmail)) {
        return 'Enter a valid email address';
    }

    return '';
}

function getPasswordError(password) {
    if (!password) {
        return 'Password is required';
    }

    if (password.length < 8) {
        return 'Password must be at least 8 characters';
    }

    return '';
}

function getConfirmPasswordError(password, confirmPassword) {
    if (!confirmPassword) {
        return 'Confirm password is required';
    }

    if (password !== confirmPassword) {
        return 'Passwords do not match';
    }

    return '';
}

function getTermsError(acceptedTerms) {
    return acceptedTerms ? '' : 'You must accept the agreement to continue';
}
