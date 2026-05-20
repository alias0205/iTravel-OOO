import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { ApprovalMetricCardStyles as styles } from '../../../styles';

const toneMap = {
    orange: { backgroundColor: '#FCE8D0', color: '#EA6C12' },
    blue: { backgroundColor: '#E6EEFD', color: '#3D68DF' },
};

export function ApprovalMetricCard({ icon, onPress, title, value, subtitle, tone = 'orange' }) {
    const currentTone = toneMap[tone] ?? toneMap.orange;

    return (
        <Pressable disabled={!onPress} onPress={onPress} style={styles.card}>
            <View style={[styles.iconWrap, { backgroundColor: currentTone.backgroundColor }]}>
                <MaterialCommunityIcons color={currentTone.color} name={icon} size={18} />
            </View>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.title}>{title}</Text>
        </Pressable>
    );
}
