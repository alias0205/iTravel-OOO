import { StyleSheet } from 'react-native';

import { colors } from '../../../theme/colors';

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 32,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.checkbox,
        marginTop: 2,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxActive: {
        backgroundColor: colors.primaryDark,
    },
    text: {
        flex: 1,
        color: colors.mutedStrong,
        fontSize: 16,
        lineHeight: 24,
    },
    link: {
        color: colors.primaryDark,
        fontWeight: '600',
    },
});

export { styles };
export default styles;
