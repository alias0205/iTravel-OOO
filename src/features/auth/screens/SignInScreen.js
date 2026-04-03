import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Alert, Pressable, Text } from 'react-native';

import { AuthAgreement } from '../components/AuthAgreement';
import { AuthPrimaryButton } from '../components/AuthPrimaryButton';
import { AuthScreenShell } from '../components/AuthScreenShell';
import { LabeledInput } from '../components/LabeledInput';
import { useAuthSession } from '../context/AuthSessionContext';
import { loginWithPassword } from '../utils/authApi';
import { SignInScreenStyles as styles, colors } from '../../../styles';
import { hasValidationErrors, validateSignIn } from '../utils/authValidation';

function getSignInErrorDialog(error) {
    const rawMessage = error instanceof Error ? error.message.trim() : '';
    const normalizedMessage = rawMessage.toLowerCase();

    if (normalizedMessage.includes('network request failed') || normalizedMessage.includes('networkerror') || normalizedMessage.includes('failed to fetch')) {
        return {
            title: 'Connection Problem',
            message: 'We could not reach the sign-in service. Check your internet connection and try again.',
            buttons: [{ text: 'OK' }],
        };
    }

    if (normalizedMessage.includes('credential') || normalizedMessage.includes('password') || normalizedMessage.includes('unauthorized') || normalizedMessage.includes('invalid')) {
        return {
            title: 'Sign In Failed',
            message: 'Your email or password appears to be incorrect. Check your details and try again, or reset your password if needed.',
            buttons: [
                { text: 'Dismiss', style: 'cancel' },
                { text: 'Forgot Password', action: 'forgot-password' },
            ],
        };
    }

    if (normalizedMessage.includes('supported mobile role')) {
        return {
            title: 'Access Not Available',
            message: 'This account does not have access to the mobile app. Please contact your administrator if you believe this is incorrect.',
            buttons: [{ text: 'OK' }],
        };
    }

    return {
        title: 'Unable to Sign In',
        message: rawMessage || 'Something went wrong while signing you in. Please try again in a moment.',
        buttons: [{ text: 'OK' }],
    };
}

export function SignInScreen({ navigation }) {
    const { signIn } = useAuthSession();
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
            const loginResult = await loginWithPassword({ email, password });

            await signIn({
                token: loginResult.token,
                tokenType: loginResult.tokenType,
                user: loginResult.user,
            });

            navigation.reset({
                index: 0,
                routes: [{ name: 'Splash' }],
            });
        } catch (error) {
            const dialog = getSignInErrorDialog(error);

            Alert.alert(
                dialog.title,
                dialog.message,
                dialog.buttons.map((button) => ({
                    style: button.style,
                    text: button.text,
                    onPress: button.action === 'forgot-password' ? () => navigation.navigate('ForgotPassword') : undefined,
                }))
            );
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
            showSocialSection={false}
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
