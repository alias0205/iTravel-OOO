import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ConsultantScreenLayout } from '../components/ConsultantScreenLayout';

const profileAvatar = require('../../../../assets/nutra/avatars/avatar-4.jpg');

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

function SelectField({ label, value }) {
    return (
        <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <Pressable style={styles.selectShell}>
                <Text style={styles.selectValue}>{value}</Text>
                <MaterialCommunityIcons color="#334155" name="chevron-down" size={20} />
            </Pressable>
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

export function ConsultantSettingsScreen({ navigation }) {
    return (
        <ConsultantScreenLayout
            activeNavKey="settings"
            headerRight={
                <Pressable style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
            }
            headerSubtitle="Manage your preferences"
            headerTitle="Settings"
            navigation={navigation}
            notificationCount={3}
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
                    <SettingsField label="Last Name" value="Chen" />
                    <SettingsField label="Email Address" value="michael.chen@company.com" />
                </SettingsSection>

                <SettingsSection icon="shield-check" subtitle="Manage your account security settings" title="Security & Privacy">
                    <SecurityRow actionLabel="Change Password" subtitle="Last changed 3 months ago" title="Password" />
                </SettingsSection>

                <Pressable style={styles.signOutButton}>
                    <MaterialCommunityIcons color="#EF4444" name="logout-variant" size={18} />
                    <Text style={styles.signOutText}>Sign Out</Text>
                </Pressable>
            </View>
        </ConsultantScreenLayout>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 24,
    },
    pagePadding: {
        paddingHorizontal: 12,
        paddingTop: 12,
    },
    saveButton: {
        minWidth: 60,
        height: 34,
        borderRadius: 9,
        backgroundColor: '#0A6B63',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 14,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        lineHeight: 18,
        fontWeight: '800',
    },
    sectionCard: {
        backgroundColor: '#FFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#D7DCE3',
        overflow: 'hidden',
        marginBottom: 18,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#D7DCE3',
    },
    sectionHeaderCopy: {
        marginLeft: 10,
        flex: 1,
    },
    sectionTitle: {
        color: '#2A3140',
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '800',
    },
    sectionSubtitle: {
        color: '#6B7280',
        fontSize: 14,
        lineHeight: 20,
        marginTop: 2,
    },
    sectionBody: {
        padding: 12,
    },
    profilePhotoBlock: {
        textAlign: 'center',
        alignItems: 'center',
        marginBottom: 14,
    },
    profilePhoto: {
        width: 62,
        height: 62,
        borderRadius: 31,
        marginBottom: 8,
    },
    changePhotoText: {
        color: '#0A6B63',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '700',
    },
    fieldWrap: {
        marginBottom: 14,
    },
    fieldLabel: {
        color: '#5B6575',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '700',
        marginBottom: 6,
    },
    inputShell: {
        minHeight: 44,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: '#FFF',
        paddingHorizontal: 12,
        color: '#1F2937',
        fontSize: 15,
    },
    inputShellMultiline: {
        minHeight: 84,
        paddingTop: 12,
        textAlignVertical: 'top',
    },
    selectShell: {
        minHeight: 44,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: '#FFF',
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    selectValue: {
        color: '#1F2937',
        fontSize: 15,
        lineHeight: 20,
    },
    securityRow: {
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    securityCopy: {
        flex: 1,
        paddingRight: 12,
    },
    securityTitle: {
        color: '#374151',
        fontSize: 16,
        lineHeight: 20,
        fontWeight: '700',
    },
    securitySubtitle: {
        color: '#6B7280',
        fontSize: 14,
        lineHeight: 19,
        marginTop: 2,
    },
    securityActionButton: {
        paddingVertical: 4,
    },
    securityActionButtonPrimary: {
        minWidth: 58,
        height: 34,
        borderRadius: 8,
        backgroundColor: '#0A6B63',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 14,
    },
    securityActionText: {
        fontSize: 14,
        lineHeight: 18,
        fontWeight: '700',
    },
    securityActionTextDefault: {
        color: '#0A6B63',
    },
    securityActionTextPrimary: {
        color: '#FFFFFF',
    },
    statusBadge: {
        minWidth: 56,
        height: 32,
        borderRadius: 999,
        backgroundColor: '#DDF5E2',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    statusBadgeText: {
        color: '#55A869',
        fontSize: 14,
        lineHeight: 18,
        fontWeight: '700',
    },
    signOutButton: {
        height: 54,
        borderRadius: 12,
        backgroundColor: '#F8E9E9',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 4,
    },
    signOutText: {
        color: '#EF4444',
        fontSize: 16,
        lineHeight: 20,
        fontWeight: '800',
        marginLeft: 8,
    },
});
