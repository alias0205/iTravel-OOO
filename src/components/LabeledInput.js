import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '../theme/colors';

export function LabeledInput({ label, error, containerStyle, inputStyle, rightAccessory, ...inputProps }) {
    return (
        <View style={[styles.fieldGroup, containerStyle]}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.inputShell, rightAccessory ? styles.inputShellWithAccessory : null, error ? styles.inputShellError : null]}>
                <TextInput placeholderTextColor={colors.hint} style={[styles.input, rightAccessory ? styles.inputWithAccessory : null, inputStyle]} {...inputProps} />
                {rightAccessory ? <View style={styles.accessory}>{rightAccessory}</View> : null}
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    fieldGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        lineHeight: 22,
        color: colors.label,
        fontWeight: '600',
        marginBottom: 10,
    },
    inputShell: {
        minHeight: 62,
        borderWidth: 1.2,
        borderColor: colors.border,
        borderRadius: 14,
        backgroundColor: colors.surface,
        justifyContent: 'center',
    },
    inputShellWithAccessory: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 14,
    },
    inputShellError: {
        borderColor: colors.danger,
        backgroundColor: colors.dangerSoft,
    },
    input: {
        minHeight: 62,
        paddingHorizontal: 18,
        fontSize: 16,
        color: colors.text,
        flex: 1,
    },
    inputWithAccessory: {
        paddingRight: 0,
    },
    accessory: {
        marginLeft: 12,
    },
    errorText: {
        marginTop: 8,
        fontSize: 13,
        lineHeight: 18,
        color: colors.danger,
    },
});
