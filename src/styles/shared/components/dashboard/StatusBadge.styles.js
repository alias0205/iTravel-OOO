import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 14,
        paddingVertical: 4,
        borderRadius: 999,
    },
    icon: {
        marginRight: 4,
    },
    text: {
        fontSize: 11,
        lineHeight: 12,
        fontWeight: '600',
    },
});

export { styles };
export default styles;
