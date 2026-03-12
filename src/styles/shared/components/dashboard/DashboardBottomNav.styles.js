import { StyleSheet } from 'react-native';

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

export { styles };
export default styles;
