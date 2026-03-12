import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E7EAEE',
        padding: 16,
        minHeight: 146,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    title: {
        color: '#6E7686',
        fontSize: 12,
        lineHeight: 18,
        marginBottom: 12,
    },
    value: {
        color: '#252D3A',
        fontSize: 20,
        lineHeight: 24,
        fontWeight: '800',
        marginBottom: 4,
    },
    subtitle: {
        color: '#4E5B6D',
        fontSize: 12,
        lineHeight: 18,
    },
});

export { styles };
export default styles;
