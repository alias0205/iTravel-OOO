import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { DashboardBottomNavStyles as styles } from '../../../styles';

const defaultItems = [
    { key: 'home', label: 'Home', icon: 'home' },
    { key: 'calendar', label: 'Calendar', icon: 'calendar-month-outline' },
    { key: 'approvals', label: 'Approvals', icon: 'clipboard-check-outline', badge: 1 },
    { key: 'settings', label: 'Settings', icon: 'cog-outline' },
];

export function DashboardBottomNav({ items = defaultItems, activeKey = 'home', onItemPress }) {
    return (
        <View style={styles.container}>
            {items.map((item) => (
                <Pressable key={item.key} onPress={() => onItemPress?.(item)} style={styles.item}>
                    <View style={[styles.iconWrap, item.key === activeKey ? styles.iconWrapActive : null]}>
                        <MaterialCommunityIcons color={item.key === activeKey ? '#FFFFFF' : '#767E8D'} name={item.icon} size={22} />
                        {item.badge ? (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{item.badge}</Text>
                            </View>
                        ) : null}
                    </View>
                    <Text style={[styles.label, item.key === activeKey ? styles.labelActive : null]}>{item.label}</Text>
                </Pressable>
            ))}
        </View>
    );
}
