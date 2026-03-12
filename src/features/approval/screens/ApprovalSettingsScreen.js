import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, Pressable, Text, TextInput, View } from 'react-native';

import { ApprovalScreenLayout } from '../components/ApprovalScreenLayout';
import { ApprovalSettingsScreenStyles as styles } from '../../../styles';

const profileAvatar = require('../../../../assets/nutra/avatars/avatar-6.jpg');

function SettingsSection({ icon, title, subtitle, children }) {
    return (
        <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
                <MaterialCommunityIcons color="#0A6B63" name={icon} size={20} />
                <View style={styles.sectionHeaderCopy}>
                    <Text style={styles.sectionTitle}>{title}</Text>
                    <Text style={styles.sectionSubtitle}>{subtitle}</Text>
                </View>
            </View>

            <View style={styles.sectionBody}>{children}</View>
        </View>
    );
}

function SettingsField({ label, value, multiline = false }) {
    return (
        <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <TextInput editable={true} multiline={multiline} style={[styles.inputShell, multiline ? styles.inputShellMultiline : null]} value={value} />
        </View>
    );
}

function SecurityRow({ title, subtitle, actionLabel, tone = 'default' }) {
    return (
        <View style={styles.securityRow}>
            <View style={styles.securityCopy}>
                <Text style={styles.securityTitle}>{title}</Text>
                <Text style={styles.securitySubtitle}>{subtitle}</Text>
            </View>

            {tone === 'badge' ? (
                <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>{actionLabel}</Text>
                </View>
            ) : (
                <Pressable style={[styles.securityActionButton, tone === 'primary' ? styles.securityActionButtonPrimary : null]}>
                    <Text style={[styles.securityActionText, tone === 'primary' ? styles.securityActionTextPrimary : styles.securityActionTextDefault]}>{actionLabel}</Text>
                </Pressable>
            )}
        </View>
    );
}

export function ApprovalSettingsScreen({ navigation }) {
    const handleSignOut = () => {
        navigation?.reset({
            index: 0,
            routes: [{ name: 'SignIn' }],
        });
    };

    return (
        <ApprovalScreenLayout
            activeNavKey="settings"
            headerRight={
                <Pressable style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
            }
            headerSubtitle="Manage your preferences"
            headerTitle="Settings"
            navigation={navigation}
            notificationCount={8}
            showNotification={false}
            showBackButton
            scrollContentStyle={styles.scrollContent}
        >
            <View style={styles.pagePadding}>
                <SettingsSection icon="account" subtitle="Update your basic profile information and photo" title="Profile Information">
                    <View style={styles.profilePhotoBlock}>
                        <Image source={profileAvatar} style={styles.profilePhoto} />
                        <Pressable>
                            <Text style={styles.changePhotoText}>Change Photo</Text>
                        </Pressable>
                    </View>

                    <SettingsField label="First Name" value="Michael" />
                    <SettingsField label="Last Name" value="Johnson" />
                    <SettingsField label="Email Address" value="michael.johnson@company.com" />
                </SettingsSection>

                <SettingsSection icon="shield-check" subtitle="Manage your account security settings" title="Security & Privacy">
                    <SecurityRow actionLabel="Change Password" subtitle="Last changed 3 months ago" title="Password" />
                </SettingsSection>

                <Pressable onPress={handleSignOut} style={styles.signOutButton}>
                    <MaterialCommunityIcons color="#EF4444" name="logout-variant" size={18} />
                    <Text style={styles.signOutText}>Sign Out</Text>
                </Pressable>
            </View>
        </ApprovalScreenLayout>
    );
}
