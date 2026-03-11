import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StatusBadge } from './StatusBadge';

const iconTone = {
    blue: { backgroundColor: '#E5EDFE', color: '#356AE6' },
    purple: { backgroundColor: '#F1EAFE', color: '#7D32DB' },
    red: { backgroundColor: '#FDECEC', color: '#EB4B46' },
};

export function RequestCard({ title, dateRange, duration, detail, meta, icon, iconColor = 'blue', statusLabel, statusTone, onPress }) {
    const currentIconTone = iconTone[iconColor] ?? iconTone.blue;

    return (
        <Pressable onPress={onPress} style={styles.card}>
            <View style={styles.topRow}>
                <View style={[styles.iconBox, { backgroundColor: currentIconTone.backgroundColor }]}>
                    <MaterialCommunityIcons color={currentIconTone.color} name={icon} size={20} />
                </View>

                <View style={styles.mainCopy}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.dateRange}>{dateRange}</Text>
                    <Text style={styles.detail}>
                        {duration} · {detail}
                    </Text>
                </View>

                <StatusBadge label={statusLabel} tone={statusTone} />
            </View>

            <View style={styles.divider} />

            <View style={styles.metaRow}>
                <MaterialCommunityIcons color="#9098A8" name="clock-outline" size={16} />
                <Text style={styles.metaText}>{meta}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E7EAEE',
        padding: 16,
        marginBottom: 12,
        shadowColor: '#0B1526',
        shadowOpacity: 0.03,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    mainCopy: {
        flex: 1,
        paddingRight: 10,
    },
    title: {
        color: '#252D3A',
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '800',
        marginBottom: 3,
    },
    dateRange: {
        color: '#71798A',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 6,
    },
    detail: {
        color: '#4E5B6D',
        fontSize: 14,
        lineHeight: 20,
    },
    divider: {
        height: 1,
        backgroundColor: '#ECEFF3',
        marginTop: 14,
        marginBottom: 12,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        color: '#71798A',
        fontSize: 14,
        lineHeight: 20,
        marginLeft: 6,
    },
});
