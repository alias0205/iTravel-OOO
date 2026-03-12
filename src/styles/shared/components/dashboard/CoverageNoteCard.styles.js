import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: '#A9C8F8',
        backgroundColor: '#EAF2FF',
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#C7D6F4',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    avatarText: {
        color: '#224685',
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '800',
    },
    copy: {
        flex: 1,
    },
    name: {
        color: '#234485',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '800',
        marginBottom: 2,
    },
    note: {
        color: '#2550AB',
        fontSize: 14,
        lineHeight: 21,
    },
});

export { styles };
export default styles;
