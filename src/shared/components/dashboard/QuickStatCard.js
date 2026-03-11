import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

const toneMap = {
    blue: { backgroundColor: '#E7EEFD', color: '#3D68DF' },
    purple: { backgroundColor: '#F1EAFE', color: '#8B3DDE' },
};

export function QuickStatCard({ icon, title, value, subtitle, tone = 'blue' }) {
    const currentTone = toneMap[tone] ?? toneMap.blue;

    return (
        <View style={styles.card}>
            <View style={[styles.iconBox, { backgroundColor: currentTone.backgroundColor }]}>
                <MaterialCommunityIcons color={currentTone.color} name={icon} size={20} />
            </View>

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E7EAEE',
        padding: 16,
        minHeight: 146,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    title: {
        color: '#6E7686',
        fontSize: 12,
        lineHeight: 18,
        marginBottom: 12,
    },
    value: {
        color: '#252D3A',
        fontSize: 20,
        lineHeight: 24,
        fontWeight: '800',
        marginBottom: 4,
    },
    subtitle: {
        color: '#4E5B6D',
        fontSize: 12,
        lineHeight: 18,
    },
});
