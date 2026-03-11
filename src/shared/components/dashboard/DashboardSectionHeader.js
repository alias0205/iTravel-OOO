import { Pressable, StyleSheet, Text, View } from 'react-native';

export function DashboardSectionHeader({ title, actionLabel, onActionPress }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {actionLabel ? (
                <Pressable onPress={onActionPress}>
                    <Text style={styles.action}>{actionLabel}</Text>
                </Pressable>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    title: {
        color: '#232B39',
        fontSize: 20,
        lineHeight: 24,
        fontWeight: '800',
    },
    action: {
        color: '#0A6B63',
        fontSize: 16,
        lineHeight: 20,
        fontWeight: '700',
    },
});
