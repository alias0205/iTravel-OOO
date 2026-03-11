import { StyleSheet, Text, View } from 'react-native';

export function InfoField({ label, value }) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        color: '#414B5A',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '700',
        marginBottom: 6,
    },
    value: {
        color: '#242D39',
        fontSize: 16,
        lineHeight: 24,
    },
});
