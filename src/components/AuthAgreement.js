import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

export function AuthAgreement({ checked, onPress, prefixText, links }) {
    return (
        <Pressable onPress={onPress} style={styles.row}>
            <View style={[styles.checkbox, checked && styles.checkboxActive]}>{checked ? <MaterialCommunityIcons color={colors.white} name="check" size={16} /> : null}</View>
            <Text style={styles.text}>
                {prefixText}{' '}
                {links.map((link, index) => (
                    <Text key={link.label}>
                        <Text style={styles.link}>{link.label}</Text>
                        {index < links.length - 1 ? link.separator : ''}
                    </Text>
                ))}
            </Text>
        </Pressable>
    );
}

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
