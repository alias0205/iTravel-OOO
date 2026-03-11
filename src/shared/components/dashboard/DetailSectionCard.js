import { StyleSheet, Text, View } from 'react-native';

export function DetailSectionCard({ title, children }) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E3E8EE',
        padding: 16,
        marginBottom: 16,
    },
    title: {
        color: '#212938',
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '800',
        marginBottom: 16,
    },
});
