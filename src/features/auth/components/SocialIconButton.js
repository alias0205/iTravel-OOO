import { Pressable, StyleSheet } from 'react-native';

import { colors } from '../../../shared/theme/colors';

export function SocialIconButton({ children, onPress }) {
    return (
        <Pressable onPress={onPress} style={styles.button}>
            {children}
        </Pressable>
    );
}

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
