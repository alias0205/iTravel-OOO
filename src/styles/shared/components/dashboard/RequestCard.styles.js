import { StyleSheet } from 'react-native';

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

export { styles };
export default styles;
