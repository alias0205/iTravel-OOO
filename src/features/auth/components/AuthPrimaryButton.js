import { ActivityIndicator, Pressable, Text } from 'react-native';

import { AuthPrimaryButtonStyles as styles, colors } from '../../../styles';

export function AuthPrimaryButton({ label, onPress, style, textStyle, disabled, loading }) {
    return (
        <Pressable disabled={disabled || loading} onPress={onPress} style={[styles.button, disabled || loading ? styles.buttonDisabled : null, style]}>
            {loading ? <ActivityIndicator color={colors.white} size="small" /> : <Text style={[styles.text, textStyle]}>{label}</Text>}
        </Pressable>
    );
}
