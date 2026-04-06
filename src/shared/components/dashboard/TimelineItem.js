import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { TimelineItemStyles as styles } from '../../../styles';

const toneMap = {
    submitted: { backgroundColor: '#E6EEFD', color: '#356AE6', icon: 'send' },
    review: { backgroundColor: '#FFF2C9', color: '#C38E08', icon: 'clock-time-four' },
    approved: { backgroundColor: '#DDF4E4', color: '#2A9A49', icon: 'check' },
    rejected: { backgroundColor: '#FDECEC', color: '#D33A33', icon: 'close' },
};

export function TimelineItem({ title, timestamp, detail, tone = 'submitted', isLast = false }) {
    const currentTone = toneMap[tone] ?? toneMap.submitted;

    return (
        <View style={styles.row}>
            <View style={styles.leftRail}>
                <View style={[styles.iconWrap, { backgroundColor: currentTone.backgroundColor }]}>
                    <MaterialCommunityIcons color={currentTone.color} name={currentTone.icon} size={16} />
                </View>
                {isLast ? null : <View style={styles.line} />}
            </View>

            <View style={styles.copy}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.timestamp}>{timestamp}</Text>
                <Text style={styles.detail}>{detail}</Text>
            </View>
        </View>
    );
}
