import { StyleSheet } from 'react-native';

import { colors } from '../../../theme/colors';

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

export { styles };
export default styles;
