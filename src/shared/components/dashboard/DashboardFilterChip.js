import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';

export function DashboardFilterChip({ label, active = false }) {
    return (
        <Pressable style={[styles.chip, active ? styles.chipActive : null]}>
            <Text style={[styles.label, active ? styles.labelActive : null]}>{label}</Text>
            <MaterialCommunityIcons color={active ? '#FFFFFF' : '#4B5565'} name="chevron-down" size={18} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    chip: {
        height: 38,
        paddingHorizontal: 16,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#C9D1DB',
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    chipActive: {
        backgroundColor: '#0A6B63',
        borderColor: '#0A6B63',
    },
    label: {
        color: '#4B5565',
        fontSize: 14,
        lineHeight: 18,
        fontWeight: '700',
        marginRight: 6,
    },
    labelActive: {
        color: '#FFFFFF',
    },
});
