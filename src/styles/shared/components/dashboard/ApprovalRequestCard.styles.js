import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E4E8EE',
        padding: 16,
        marginBottom: 14,
    },
    headerRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#D7E3E1',
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
        color: '#23434C',
        fontSize: 16,
        lineHeight: 16,
        fontWeight: '800',
    },
    headerCopy: {
        flex: 1,
    },
    leaveMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    statusWrap: {
        alignItems: 'flex-end',
        marginLeft: 12,
        flexShrink: 0,
    },
    leaveReviewerText: {
        color: '#6F7787',
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    name: {
        color: '#232B39',
        fontSize: 16,
        lineHeight: 20,
        fontWeight: '800',
        marginBottom: 2,
    },
    role: {
        color: '#6F7787',
        fontSize: 12,
        lineHeight: 17,
        marginBottom: 8,
    },
    leavePill: {
        alignSelf: 'flex-start',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    leaveText: {
        fontSize: 14,
        lineHeight: 18,
        fontWeight: '600',
        marginLeft: 4,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 0,
    },
    dateRowClosed: {
        marginBottom: 0,
    },
    dateText: {
        color: '#6F7787',
        fontSize: 14,
        lineHeight: 18,
        marginLeft: 6,
    },
    dot: {
        color: '#A2A9B5',
        marginHorizontal: 8,
    },
    submittedFooter: {
        marginTop: 14,
    },
    submittedDivider: {
        height: 1,
        backgroundColor: '#E9EDF3',
        marginBottom: 12,
    },
    submittedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    submittedText: {
        color: '#6F7787',
        fontSize: 13,
        lineHeight: 18,
        marginLeft: 6,
    },
    actionRow: {
        flexDirection: 'row',
        marginTop: 12,
    },
    button: {
        flex: 1,
        height: 44,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonGhost: {
        borderWidth: 2,
        borderColor: '#0A6B63',
        marginRight: 10,
        backgroundColor: '#FFFFFF',
    },
    buttonSolid: {
        backgroundColor: '#0A6B63',
    },
    buttonText: {
        fontSize: 14,
        lineHeight: 18,
        fontWeight: '800',
    },
    buttonTextGhost: {
        color: '#0A6B63',
    },
    buttonTextSolid: {
        color: '#FFFFFF',
    },
});

export { styles };
export default styles;
