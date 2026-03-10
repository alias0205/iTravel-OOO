import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { AuthAgreement } from '../components/AuthAgreement';
import { AuthPrimaryButton } from '../components/AuthPrimaryButton';
import { AuthScreenShell } from '../components/AuthScreenShell';
import { LabeledInput } from '../components/LabeledInput';
import { colors } from '../theme/colors';
import { hasValidationErrors, validateSignUp } from '../utils/authValidation';

export function SignUpScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [touched, setTouched] = useState({
        email: false,
        password: false,
        confirmPassword: false,
        acceptedTerms: false,
    });
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validationErrors = useMemo(() => validateSignUp({ email, password, confirmPassword, acceptedTerms }), [acceptedTerms, confirmPassword, email, password]);
    const isFormValid = !hasValidationErrors(validationErrors);

    const visibleErrors = {
        email: touched.email || submitAttempted ? validationErrors.email : '',
        password: touched.password || submitAttempted ? validationErrors.password : '',
        confirmPassword: touched.confirmPassword || submitAttempted ? validationErrors.confirmPassword : '',
        acceptedTerms: touched.acceptedTerms || submitAttempted ? validationErrors.acceptedTerms : '',
    };

    const handleSubmit = async () => {
        setSubmitAttempted(true);
        setTouched({
            email: true,
            password: true,
            confirmPassword: true,
            acceptedTerms: true,
        });

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
            footerActionLabel="Back to Sign In"
            footerPrefix="Already have an account?"
            onFooterActionPress={() => navigation.navigate('SignIn')}
            title="Create new account"
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

            <LabeledInput
                autoCapitalize="none"
                autoCorrect={false}
                error={visibleErrors.confirmPassword}
                label="Confirm Password"
                onBlur={() => setTouched((currentValue) => ({ ...currentValue, confirmPassword: true }))}
                onChangeText={setConfirmPassword}
                placeholder="Enter your confirm password"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                rightAccessory={
                    <Pressable
                        accessibilityLabel={showConfirmPassword ? 'Hide password' : 'Show password'}
                        hitSlop={10}
                        onPress={() => setShowConfirmPassword((currentValue) => !currentValue)}
                    >
                        <MaterialCommunityIcons color={colors.icon} name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={25} />
                    </Pressable>
                }
            />

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

            <AuthPrimaryButton disabled={!isFormValid} label="Sign up" loading={isSubmitting} onPress={handleSubmit} />
        </AuthScreenShell>
    );
}

const styles = StyleSheet.create({
    agreementError: {
        marginTop: -20,
        marginBottom: 20,
        fontSize: 13,
        lineHeight: 18,
        color: colors.danger,
    },
});
