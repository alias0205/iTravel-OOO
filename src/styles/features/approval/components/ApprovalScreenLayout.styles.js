import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F4F5F7',
    },
    headerCard: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E9EF',
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 16,
    },
    headerInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerCopyRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 0,
        paddingRight: 12,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: '#F3F5F8',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    headerCopy: {
        flex: 1,
        minWidth: 0,
    },
    headerTitle: {
        color: '#1F2937',
        fontSize: 18,
        lineHeight: 24,
        fontWeight: '800',
        flexShrink: 1,
    },
    headerSubtitle: {
        color: '#5B6575',
        fontSize: 14,
        lineHeight: 20,
        marginTop: 2,
    },
    headerRight: {
        marginLeft: 12,
        flexShrink: 0,
    },
    scrollContent: {
        paddingBottom: 0,
    },
    contentBody: {
        flex: 1,
        minHeight: 0,
    },
});

export { styles };
export default styles;
