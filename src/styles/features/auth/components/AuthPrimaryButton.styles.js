import { StyleSheet } from 'react-native';

import { colors } from '../../../theme/colors';

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

export { styles };
export default styles;
