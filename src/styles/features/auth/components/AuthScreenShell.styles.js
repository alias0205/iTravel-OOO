import { StyleSheet } from 'react-native';

import { colors } from '../../../theme/colors';

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        backgroundColor: colors.background,
    },
    topBackgroundWrap: {
        width: '100%',
        position: 'relative',
    },
    topBackground: {
        width: '100%',
        height: 228,
    },
    headerLogoWrap: {
        position: 'absolute',
        top: 140,
        left: -140,
        right: 0,
        marginBottom: 0,
    },
    headerLogoImage: {
        width: 178,
        height: 68,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 28,
        paddingTop: 24,
        paddingBottom: 42,
    },
    heading: {
        color: colors.heading,
        fontSize: 22,
        lineHeight: 30,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 30,
    },
    formSection: {
        marginBottom: 32,
    },
    secondaryLabel: {
        color: colors.mutedSoft,
        textAlign: 'center',
        fontSize: 15,
        marginBottom: 16,
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 14,
        marginBottom: 48,
    },
    footerText: {
        textAlign: 'center',
        color: colors.muted,
        fontSize: 16,
        lineHeight: 24,
    },
    inlineLink: {
        color: colors.primaryDark,
        fontWeight: '600',
    },
});

export { styles };
export default styles;
