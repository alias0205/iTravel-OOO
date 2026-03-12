import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text } from 'react-native';

import { DashboardFilterChipStyles as styles } from '../../../styles';

export function DashboardFilterChip({ label, active = false }) {
    return (
        <Pressable style={[styles.chip, active ? styles.chipActive : null]}>
            <Text style={[styles.label, active ? styles.labelActive : null]}>{label}</Text>
            <MaterialCommunityIcons color={active ? '#FFFFFF' : '#4B5565'} name="chevron-down" size={18} />
        </Pressable>
    );
}
