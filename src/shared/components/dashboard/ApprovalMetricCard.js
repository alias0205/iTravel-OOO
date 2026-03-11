import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

const toneMap = {
    orange: { backgroundColor: '#FCE8D0', color: '#EA6C12' },
    blue: { backgroundColor: '#E6EEFD', color: '#3D68DF' },
};

export function ApprovalMetricCard({ icon, title, value, subtitle, tone = 'orange' }) {
    const currentTone = toneMap[tone] ?? toneMap.orange;

    return (
        <View style={styles.card}>
            <View style={[styles.iconWrap, { backgroundColor: currentTone.backgroundColor }]}>
                <MaterialCommunityIcons color={currentTone.color} name={icon} size={18} />
            </View>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E4E8EE',
        padding: 16,
        minHeight: 130,
    },
    iconWrap: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    value: {
        color: '#1B2430',
        fontSize: 18,
        lineHeight: 24,
        fontWeight: '800',
        marginBottom: 8,
    },
    title: {
        color: '#5E6776',
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 2,
    },
    subtitle: {
        color: '#8B93A1',
        fontSize: 13,
        lineHeight: 18,
    },
});
