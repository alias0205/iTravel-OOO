import { memo } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { StatusBadge } from './StatusBadge';
import { RequestCardStyles as styles } from '../../../styles';

const iconTone = {
    blue: { backgroundColor: '#E5EDFE', color: '#356AE6' },
    purple: { backgroundColor: '#F1EAFE', color: '#7D32DB' },
    red: { backgroundColor: '#FDECEC', color: '#EB4B46' },
};

function RequestCardComponent({ title, dateRange, duration, detail, meta, icon, iconColor = 'blue', statusLabel, statusTone, onPress }) {
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

function arePropsEqual(previousProps, nextProps) {
    return (
        previousProps.title === nextProps.title &&
        previousProps.dateRange === nextProps.dateRange &&
        previousProps.duration === nextProps.duration &&
        previousProps.detail === nextProps.detail &&
        previousProps.meta === nextProps.meta &&
        previousProps.icon === nextProps.icon &&
        previousProps.iconColor === nextProps.iconColor &&
        previousProps.statusLabel === nextProps.statusLabel &&
        previousProps.statusTone === nextProps.statusTone
    );
}

export const RequestCard = memo(RequestCardComponent, arePropsEqual);
