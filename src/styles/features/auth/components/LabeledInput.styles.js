import { StyleSheet } from 'react-native';

import { colors } from '../../../theme/colors';

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
        minHeight: 50,
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
        minHeight: 50,
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

export { styles };
export default styles;
