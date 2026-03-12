import { StyleSheet } from 'react-native';

import { colors } from '../../../theme/colors';

const styles = StyleSheet.create({
    description: {
        marginBottom: 20,
        fontSize: 15,
        lineHeight: 24,
        color: colors.mutedStrong,
        textAlign: 'center',
    },
    successText: {
        marginTop: -4,
        marginBottom: 20,
        fontSize: 14,
        lineHeight: 20,
        color: colors.primaryDark,
        textAlign: 'center',
    },
});

export { styles };
export default styles;
