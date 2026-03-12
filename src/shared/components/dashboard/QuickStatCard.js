import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { QuickStatCardStyles as styles } from '../../../styles';

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
