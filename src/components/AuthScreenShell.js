import { FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BrandLogo } from '../components/BrandLogo';
import { colors } from '../theme/colors';
import { SocialIconButton } from './SocialIconButton';

const topBackgroundSource = require('../../assets/nutra/top-bg.png');

export function AuthScreenShell({ title, children, footerPrefix, footerActionLabel, onFooterActionPress, showSocialSection = true }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.topBackgroundWrap}>
                    <Image resizeMode="stretch" source={topBackgroundSource} style={styles.topBackground} />
                    <BrandLogo containerStyle={styles.headerLogoWrap} imageStyle={styles.headerLogoImage} variant="dark" />
                </View>

                <View style={styles.container}>
                    <Text style={styles.heading}>{title}</Text>

                    <View style={styles.formSection}>{children}</View>

                    {showSocialSection ? (
                        <>
                            <Text style={styles.secondaryLabel}>other way to sign in</Text>

                            <View style={styles.socialRow}>
                                <SocialIconButton>
                                    <FontAwesome color={colors.google} name="google" size={28} />
                                </SocialIconButton>
                                <SocialIconButton>
                                    <FontAwesome color={colors.facebook} name="facebook-f" size={28} />
                                </SocialIconButton>
                            </View>
                        </>
                    ) : null}

                    <Text style={styles.footerText}>
                        {footerPrefix}{' '}
                        <Text onPress={onFooterActionPress} style={styles.inlineLink}>
                            {footerActionLabel}
                        </Text>
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

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
