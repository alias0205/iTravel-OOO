import { useMemo, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { AuthPrimaryButton } from '../components/AuthPrimaryButton';
import { AuthScreenShell } from '../components/AuthScreenShell';
import { LabeledInput } from '../components/LabeledInput';
import { colors } from '../../../shared/theme/colors';
import { hasValidationErrors, validateForgotPassword } from '../utils/authValidation';

export function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [touched, setTouched] = useState({ email: false });
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const validationErrors = useMemo(() => validateForgotPassword({ email }), [email]);
    const isFormValid = !hasValidationErrors(validationErrors);
    const visibleEmailError = touched.email || submitAttempted ? validationErrors.email : '';

    const handleSubmit = async () => {
        setSubmitAttempted(true);
        setTouched({ email: true });
        setSuccessMessage('');

        if (!isFormValid) {
            return;
        }

        setIsSubmitting(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setSuccessMessage('Reset instructions have been sent to your email address.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthScreenShell
            footerActionLabel="Back to Sign In"
            footerPrefix="Remember your password?"
            onFooterActionPress={() => navigation.navigate('SignIn')}
            showSocialSection={false}
            title="Forgot password"
        >
            <Text style={styles.description}>Enter your email address and we’ll send you instructions to reset your password.</Text>

            <LabeledInput
                autoCapitalize="none"
                autoCorrect={false}
                error={visibleEmailError}
                keyboardType="email-address"
                label="Email Address"
                onBlur={() => setTouched({ email: true })}
                onChangeText={setEmail}
                placeholder="Enter your email address"
                value={email}
            />

            {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

            <AuthPrimaryButton disabled={!isFormValid} label="Send reset link" loading={isSubmitting} onPress={handleSubmit} />
        </AuthScreenShell>
    );
}

const styles = StyleSheet.create({
    description: {
        marginBottom: 20,
        fontSize: 15,
        lineHeight: 24,
        color: colors.mutedStrong,
        textAlign: 'center',
    },
    successText: {
        marginTop: -4,
        marginBottom: 20,
        fontSize: 14,
        lineHeight: 20,
        color: colors.primaryDark,
        textAlign: 'center',
    },
});
