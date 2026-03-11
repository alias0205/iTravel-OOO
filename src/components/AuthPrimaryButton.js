import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../theme/colors';

export function AuthPrimaryButton({ label, onPress, style, textStyle, disabled, loading }) {
    return (
        <Pressable disabled={disabled || loading} onPress={onPress} style={[styles.button, disabled || loading ? styles.buttonDisabled : null, style]}>
            {loading ? <ActivityIndicator color={colors.white} size="small" /> : <Text style={[styles.text, textStyle]}>{label}</Text>}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 50,
        borderRadius: 999,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.primary,
        shadowOpacity: 0.16,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 4,
    },
    buttonDisabled: {
        backgroundColor: colors.disabled,
        shadowOpacity: 0,
        elevation: 0,
    },
    text: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '700',
    },
});
