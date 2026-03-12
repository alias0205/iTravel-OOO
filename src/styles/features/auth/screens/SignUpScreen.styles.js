import { StyleSheet } from 'react-native';

import { colors } from '../../../theme/colors';

const styles = StyleSheet.create({
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
