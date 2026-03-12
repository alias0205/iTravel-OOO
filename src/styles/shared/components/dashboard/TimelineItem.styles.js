import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
    leftRail: {
        width: 36,
        alignItems: 'center',
    },
    iconWrap: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    line: {
        width: 1,
        flex: 1,
        backgroundColor: '#D9DEE5',
        marginTop: 6,
        marginBottom: -2,
    },
    copy: {
        flex: 1,
        paddingBottom: 18,
        paddingLeft: 10,
    },
    title: {
        color: '#202937',
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '800',
        marginBottom: 2,
    },
    timestamp: {
        color: '#6F7787',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 6,
    },
    detail: {
        color: '#4E5868',
        fontSize: 14,
        lineHeight: 22,
    },
});

export { styles };
export default styles;
