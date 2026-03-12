import { FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Image, SafeAreaView, ScrollView, Text, View } from 'react-native';

import { BrandLogo } from './BrandLogo';
import { SocialIconButton } from './SocialIconButton';
import { AuthScreenShellStyles as styles, colors } from '../../../styles';

const topBackgroundSource = require('../../../../assets/nutra/top-bg.png');

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
