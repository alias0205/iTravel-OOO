import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

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

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 14,
        paddingVertical: 4,
        borderRadius: 999,
    },
    icon: {
        marginRight: 4,
    },
    text: {
        fontSize: 11,
        lineHeight: 12,
        fontWeight: '600',
    },
});
