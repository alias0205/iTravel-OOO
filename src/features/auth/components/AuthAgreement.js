import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { AuthAgreementStyles as styles, colors } from '../../../styles';

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
