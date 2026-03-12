import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#005F5B',
    },
    container: {
        flex: 1,
        backgroundColor: '#005F5B',
        overflow: 'hidden',
        paddingHorizontal: 28,
        paddingTop: 24,
        paddingBottom: 22,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 36,
    },
    iconTile: {
        width: 76,
        height: 76,
        borderRadius: 18,
        backgroundColor: '#F4F6F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    brandText: {
        fontSize: 20,
        lineHeight: 28,
        marginBottom: 24,
        letterSpacing: 0.2,
    },
    brandStrong: {
        color: '#FFFFFF',
        fontWeight: '800',
    },
    brandLight: {
        color: 'rgba(255, 255, 255, 0.88)',
        fontWeight: '400',
    },
    title: {
        color: 'rgba(255, 255, 255, 0.88)',
        fontSize: 15,
        lineHeight: 21,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.74)',
        fontSize: 12,
        lineHeight: 18,
        textAlign: 'center',
        maxWidth: 240,
    },
    loadingBlock: {
        marginTop: 88,
        alignItems: 'center',
    },
    loadingText: {
        color: 'rgba(255, 255, 255, 0.88)',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '700',
        marginBottom: 10,
    },
    dotRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 999,
        backgroundColor: '#FFFFFF',
    },
    footer: {
        color: 'rgba(255, 255, 255, 0.56)',
        fontSize: 11,
        lineHeight: 16,
        textAlign: 'center',
    },
    bubble: {
        position: 'absolute',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 999,
    },
    bubbleTopLeft: {
        width: 58,
        height: 58,
        top: 30,
        left: 30,
    },
    bubbleTopRight: {
        width: 34,
        height: 34,
        top: 98,
        right: 48,
    },
    bubbleMiddleRight: {
        width: 20,
        height: 20,
        top: 248,
        right: 78,
    },
    bubbleBottomLeft: {
        width: 48,
        height: 48,
        bottom: 118,
        left: 56,
    },
    bubbleBottomRight: {
        width: 72,
        height: 72,
        bottom: 70,
        right: 36,
    },
});

export { styles };
export default styles;
