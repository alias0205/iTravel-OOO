import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const defaultItems = [
    { key: 'home', label: 'Home', icon: 'home' },
    { key: 'calendar', label: 'Calendar', icon: 'calendar-month-outline' },
    { key: 'approvals', label: 'Approvals', icon: 'clipboard-check-outline', badge: 1 },
    { key: 'settings', label: 'Settings', icon: 'cog-outline' },
];

export function DashboardBottomNav({ items = defaultItems, activeKey = 'home' }) {
    return (
        <View style={styles.container}>
            {items.map((item) => (
                <Pressable key={item.key} style={styles.item}>
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

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderColor: '#E6EAF0',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 10,
        paddingBottom: 14,
    },
    item: {
        alignItems: 'center',
        minWidth: 62,
    },
    iconWrap: {
        width: 42,
        height: 42,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
        position: 'relative',
    },
    iconWrapActive: {
        backgroundColor: '#0A6B63',
    },
    label: {
        color: '#767E8D',
        fontSize: 11,
        lineHeight: 16,
        fontWeight: '500',
    },
    labelActive: {
        color: '#0A6B63',
        fontWeight: '700',
    },
    badge: {
        position: 'absolute',
        top: -2,
        right: -3,
        minWidth: 18,
        height: 18,
        paddingHorizontal: 4,
        borderRadius: 999,
        backgroundColor: '#F04A49',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        lineHeight: 12,
        fontWeight: '800',
    },
});
