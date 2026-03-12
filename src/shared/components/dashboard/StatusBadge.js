import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { StatusBadgeStyles as styles } from '../../../styles';

const toneStyles = {
    pending: {
        container: { backgroundColor: '#FFF8DD' },
        text: { color: '#B07A08' },
    },
    approved: {
        container: { backgroundColor: '#DCFCE7' },
        text: { color: '#166534' },
    },
    rejected: {
        container: { backgroundColor: '#FBE8E7' },
        text: { color: '#D33A33' },
    },
};

export function StatusBadge({ label, tone = 'pending' }) {
    const currentTone = toneStyles[tone] ?? toneStyles.pending;
    const showIcon = tone === 'approved';

    return (
        <View style={[styles.container, currentTone.container]}>
            {showIcon ? <MaterialCommunityIcons color={currentTone.text.color} name="check-circle" size={14} style={styles.icon} /> : null}
            <Text style={[styles.text, currentTone.text]}>{label}</Text>
        </View>
    );
}
