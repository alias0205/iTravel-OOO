import { StyleSheet } from 'react-native';

import { colors } from '../../../theme/colors';

const styles = StyleSheet.create({
    button: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: colors.borderSoft,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export { styles };
export default styles;
