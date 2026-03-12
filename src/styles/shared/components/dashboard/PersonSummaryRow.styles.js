import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#D6E2E1',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarImage: {
        width: 42,
        height: 42,
        borderRadius: 21,
        marginRight: 12,
    },
    avatarText: {
        color: '#21414A',
        fontSize: 13,
        lineHeight: 16,
        fontWeight: '800',
    },
    copy: {
        flex: 1,
    },
    name: {
        color: '#202937',
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '800',
    },
    subtitle: {
        color: '#6F7787',
        fontSize: 14,
        lineHeight: 20,
    },
    extra: {
        color: '#6F7787',
        fontSize: 14,
        lineHeight: 20,
    },
    actionButton: {
        width: 38,
        height: 38,
        borderRadius: 10,
        backgroundColor: '#F1F3F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
    },
});

export { styles };
export default styles;
