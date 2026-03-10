import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { AuthAgreement } from '../components/AuthAgreement';
import { AuthPrimaryButton } from '../components/AuthPrimaryButton';
import { AuthScreenShell } from '../components/AuthScreenShell';
import { LabeledInput } from '../components/LabeledInput';
import { colors } from '../theme/colors';
import { hasValidationErrors, validateSignIn } from '../utils/authValidation';

export function SignInScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [touched, setTouched] = useState({
        email: false,
        password: false,
        acceptedTerms: false,
    });
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validationErrors = useMemo(() => validateSignIn({ email, password, acceptedTerms }), [acceptedTerms, email, password]);
    const isFormValid = !hasValidationErrors(validationErrors);

    const visibleErrors = {
        email: touched.email || submitAttempted ? validationErrors.email : '',
        password: touched.password || submitAttempted ? validationErrors.password : '',
        acceptedTerms: touched.acceptedTerms || submitAttempted ? validationErrors.acceptedTerms : '',
    };

    const handleSubmit = async () => {
        setSubmitAttempted(true);
        setTouched({ email: true, password: true, acceptedTerms: true });

        if (!isFormValid) {
            return;
        }

        setIsSubmitting(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthScreenShell
            footerActionLabel="Create Account"
            footerPrefix="Don’t have an account?"
            onFooterActionPress={() => navigation.navigate('SignUp')}
            title="Sign in to your account"
        >
            <LabeledInput
                autoCapitalize="none"
                autoCorrect={false}
                error={visibleErrors.email}
                keyboardType="email-address"
                label="Email Address"
                onBlur={() => setTouched((currentValue) => ({ ...currentValue, email: true }))}
                onChangeText={setEmail}
                placeholder="Enter your email address"
                value={email}
            />

            <LabeledInput
                autoCapitalize="none"
                autoCorrect={false}
                error={visibleErrors.password}
                label="Password"
                onBlur={() => setTouched((currentValue) => ({ ...currentValue, password: true }))}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                value={password}
                rightAccessory={
                    <Pressable accessibilityLabel={showPassword ? 'Hide password' : 'Show password'} hitSlop={10} onPress={() => setShowPassword((currentValue) => !currentValue)}>
                        <MaterialCommunityIcons color={colors.icon} name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={25} />
                    </Pressable>
                }
            />

            <Pressable onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotPasswordButton}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </Pressable>

            <AuthAgreement
                checked={acceptedTerms}
                links={[
                    { label: 'User Agreement', separator: ' and ' },
                    { label: 'Privacy Policy', separator: '' },
                ]}
                onPress={() => {
                    setTouched((currentValue) => ({ ...currentValue, acceptedTerms: true }));
                    setAcceptedTerms((currentValue) => !currentValue);
                }}
                prefixText="I’ve read and agreed to"
            />

            {visibleErrors.acceptedTerms ? <Text style={styles.agreementError}>{visibleErrors.acceptedTerms}</Text> : null}

            <AuthPrimaryButton disabled={!isFormValid} label="Sign in" loading={isSubmitting} onPress={handleSubmit} />
        </AuthScreenShell>
    );
}

const styles = StyleSheet.create({
    forgotPasswordButton: {
        alignSelf: 'flex-end',
        marginTop: 2,
        marginBottom: 28,
    },
    forgotPasswordText: {
        fontSize: 15,
        color: '#646464',
        fontWeight: '500',
    },
    agreementError: {
        marginTop: -20,
        marginBottom: 20,
        fontSize: 13,
        lineHeight: 18,
        color: colors.danger,
    },
});
