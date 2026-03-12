import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    card: {
        flex: 1,
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    cardMint: {
        backgroundColor: '#E6F2F1',
    },
    cardNeutral: {
        backgroundColor: '#F9FAFB',
    },
    title: {
        color: '#445061',
        fontSize: 14,
        lineHeight: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    value: {
        color: '#17333B',
        fontSize: 24,
        lineHeight: 28,
        fontWeight: '800',
        marginBottom: 4,
    },
    subtitle: {
        color: '#566273',
        fontSize: 14,
        lineHeight: 18,
    },
});

export { styles };
export default styles;
