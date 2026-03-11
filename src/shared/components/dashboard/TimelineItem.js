import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

const toneMap = {
    submitted: { backgroundColor: '#E6EEFD', color: '#356AE6', icon: 'send' },
    review: { backgroundColor: '#FFF2C9', color: '#C38E08', icon: 'clock-time-four' },
    approved: { backgroundColor: '#DDF4E4', color: '#2A9A49', icon: 'check' },
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

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
    leftRail: {
        width: 36,
        alignItems: 'center',
    },
    iconWrap: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    line: {
        width: 1,
        flex: 1,
        backgroundColor: '#D9DEE5',
        marginTop: 6,
        marginBottom: -2,
    },
    copy: {
        flex: 1,
        paddingBottom: 18,
        paddingLeft: 10,
    },
    title: {
        color: '#202937',
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '800',
        marginBottom: 2,
    },
    timestamp: {
        color: '#6F7787',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 6,
    },
    detail: {
        color: '#4E5868',
        fontSize: 14,
        lineHeight: 22,
    },
});
