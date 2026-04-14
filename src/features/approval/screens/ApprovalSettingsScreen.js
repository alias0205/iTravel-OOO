import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';

import { ApprovalScreenLayout } from '../components/ApprovalScreenLayout';
import { useAuthSession } from '../../auth/context/AuthSessionContext';
import { fetchCurrentUserProfile, updateCurrentUserPassword, updateCurrentUserProfile } from '../../auth/utils/authApi';
import { ApprovalSettingsScreenStyles as styles } from '../../../styles';

function getProfileInitials(firstName, lastName, email) {
    const firstInitial = firstName?.trim()?.charAt(0) || '';
    const lastInitial = lastName?.trim()?.charAt(0) || '';

    if (firstInitial || lastInitial) {
        return `${firstInitial}${lastInitial}`.toUpperCase();
    }

    return (email?.trim()?.charAt(0) || '?').toUpperCase();
}

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

function SettingsField({ autoCapitalize = 'sentences', autoCorrect = true, label, multiline = false, onChangeText, rightAccessory = null, secureTextEntry = false, value }) {
    return (
        <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <View style={styles.inputShellWrap}>
                <TextInput
                    autoCapitalize={autoCapitalize}
                    autoCorrect={autoCorrect}
                    editable
                    multiline={multiline}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    style={[styles.inputShell, rightAccessory ? styles.inputShellWithAccessory : null, multiline ? styles.inputShellMultiline : null]}
                    value={value}
                />
                {rightAccessory ? <View style={styles.inputAccessory}>{rightAccessory}</View> : null}
            </View>
        </View>
    );
}

function SecurityRow({ actionLabel, onPress, subtitle, title, tone = 'default' }) {
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
                <Pressable onPress={onPress} style={[styles.securityActionButton, tone === 'primary' ? styles.securityActionButtonPrimary : null]}>
                    <Text style={[styles.securityActionText, tone === 'primary' ? styles.securityActionTextPrimary : styles.securityActionTextDefault]}>{actionLabel}</Text>
                </Pressable>
            )}
        </View>
    );
}

export function ApprovalSettingsScreen({ navigation }) {
    const { authProfile, session, signIn, signOut } = useAuthSession();
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [email, setEmail] = useState(authProfile?.email ?? '');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [firstName, setFirstName] = useState(authProfile?.firstName ?? '');
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [isPasswordFormVisible, setIsPasswordFormVisible] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [lastName, setLastName] = useState(authProfile?.lastName ?? '');
    const [newPassword, setNewPassword] = useState('');
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const profileInitials = getProfileInitials(firstName, lastName, email);

    useEffect(() => {
        setFirstName(authProfile?.firstName ?? '');
        setLastName(authProfile?.lastName ?? '');
        setEmail(authProfile?.email ?? '');
    }, [authProfile?.email, authProfile?.firstName, authProfile?.lastName]);

    useEffect(() => {
        if (!session?.token) {
            return;
        }

        let isMounted = true;

        void (async () => {
            setIsLoadingProfile(true);

            try {
                const user = await fetchCurrentUserProfile({ token: session.token });

                if (!isMounted || !user) {
                    return;
                }

                setFirstName(user.first_name || '');
                setLastName(user.last_name || '');
                setEmail(user.email || '');
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                if (error?.status === 401) {
                    await signOut();
                    navigation?.reset({
                        index: 0,
                        routes: [{ name: 'Splash' }],
                    });
                }
            } finally {
                if (isMounted) {
                    setIsLoadingProfile(false);
                }
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [navigation, session?.token, signOut]);

    const handleSignOut = async () => {
        await signOut();
        navigation?.reset({
            index: 0,
            routes: [{ name: 'Splash' }],
        });
    };

    const handleSave = () => {
        void (async () => {
            if (!session?.token || isSaving) {
                return;
            }

            setIsSaving(true);

            try {
                const result = await updateCurrentUserProfile({
                    email,
                    firstName,
                    lastName,
                    token: session.token,
                });

                if (result.user) {
                    await signIn({ ...session, user: result.user });
                }

                Alert.alert('Profile Updated', result.message);
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Unable to update your profile right now.';

                if (error?.status === 401) {
                    await signOut();
                    navigation?.reset({
                        index: 0,
                        routes: [{ name: 'Splash' }],
                    });
                    return;
                }

                Alert.alert('Update Failed', message);
            } finally {
                setIsSaving(false);
            }
        })();
    };

    const handleChangePassword = () => {
        void (async () => {
            if (!session?.token || isChangingPassword) {
                return;
            }

            if (!currentPassword || !newPassword || !confirmNewPassword) {
                Alert.alert('Missing Information', 'Please fill in your current password, new password, and confirmation.');
                return;
            }

            if (newPassword !== confirmNewPassword) {
                Alert.alert('Password Mismatch', 'The new password and confirmation password must match.');
                return;
            }

            setIsChangingPassword(true);

            try {
                const result = await updateCurrentUserPassword({
                    currentPassword,
                    newPassword,
                    passwordConfirmation: confirmNewPassword,
                    token: session.token,
                });

                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
                setShowCurrentPassword(false);
                setShowNewPassword(false);
                setShowConfirmNewPassword(false);
                setIsPasswordFormVisible(false);
                Alert.alert('Password Updated', result.message);
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Unable to update your password right now.';

                if (error?.status === 401) {
                    await signOut();
                    navigation?.reset({
                        index: 0,
                        routes: [{ name: 'Splash' }],
                    });
                    return;
                }

                Alert.alert('Update Failed', message);
            } finally {
                setIsChangingPassword(false);
            }
        })();
    };

    return (
        <ApprovalScreenLayout
            activeNavKey="settings"
            headerRight={
                <Pressable onPress={handleSave} style={[styles.saveButton, isSaving ? styles.saveButtonDisabled : null]}>
                    <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save'}</Text>
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
                <SettingsSection icon="account" subtitle="Update your basic profile information" title="Profile Information">
                    <View style={styles.profilePhotoBlock}>
                        <View style={styles.profileMonogram}>
                            <Text style={styles.profileMonogramText}>{profileInitials}</Text>
                        </View>
                    </View>

                    <SettingsField label="First Name" onChangeText={setFirstName} value={firstName} />
                    <SettingsField label="Last Name" onChangeText={setLastName} value={lastName} />
                    <SettingsField label="Email Address" onChangeText={setEmail} value={email} />
                    {isLoadingProfile ? <Text style={styles.profileSyncText}>Refreshing profile...</Text> : null}
                </SettingsSection>

                <SettingsSection icon="shield-check" subtitle="Manage your account security settings" title="Security & Privacy">
                    <SecurityRow actionLabel="Change Password" onPress={() => setIsPasswordFormVisible(true)} subtitle="Update your password securely" title="Password" />

                    {isPasswordFormVisible ? (
                        <View style={styles.passwordFormBlock}>
                            <SettingsField
                                autoCapitalize="none"
                                autoCorrect={false}
                                label="Current Password"
                                onChangeText={setCurrentPassword}
                                rightAccessory={
                                    <Pressable accessibilityLabel={showCurrentPassword ? 'Hide current password' : 'Show current password'} hitSlop={10} onPress={() => setShowCurrentPassword((currentValue) => !currentValue)}>
                                        <MaterialCommunityIcons color="#64748B" name={showCurrentPassword ? 'eye-off-outline' : 'eye-outline'} size={22} />
                                    </Pressable>
                                }
                                secureTextEntry={!showCurrentPassword}
                                value={currentPassword}
                            />
                            <SettingsField
                                autoCapitalize="none"
                                autoCorrect={false}
                                label="New Password"
                                onChangeText={setNewPassword}
                                rightAccessory={
                                    <Pressable accessibilityLabel={showNewPassword ? 'Hide new password' : 'Show new password'} hitSlop={10} onPress={() => setShowNewPassword((currentValue) => !currentValue)}>
                                        <MaterialCommunityIcons color="#64748B" name={showNewPassword ? 'eye-off-outline' : 'eye-outline'} size={22} />
                                    </Pressable>
                                }
                                secureTextEntry={!showNewPassword}
                                value={newPassword}
                            />
                            <SettingsField
                                autoCapitalize="none"
                                autoCorrect={false}
                                label="Confirm New Password"
                                onChangeText={setConfirmNewPassword}
                                rightAccessory={
                                    <Pressable accessibilityLabel={showConfirmNewPassword ? 'Hide confirm new password' : 'Show confirm new password'} hitSlop={10} onPress={() => setShowConfirmNewPassword((currentValue) => !currentValue)}>
                                        <MaterialCommunityIcons color="#64748B" name={showConfirmNewPassword ? 'eye-off-outline' : 'eye-outline'} size={22} />
                                    </Pressable>
                                }
                                secureTextEntry={!showConfirmNewPassword}
                                value={confirmNewPassword}
                            />

                            <Pressable onPress={handleChangePassword} style={[styles.passwordButton, isChangingPassword ? styles.passwordButtonDisabled : null]}>
                                <Text style={styles.passwordButtonText}>{isChangingPassword ? 'Updating Password...' : 'Update Password'}</Text>
                            </Pressable>

                            <Pressable
                                onPress={() => {
                                    setIsPasswordFormVisible(false);
                                    setCurrentPassword('');
                                    setNewPassword('');
                                    setConfirmNewPassword('');
                                    setShowCurrentPassword(false);
                                    setShowNewPassword(false);
                                    setShowConfirmNewPassword(false);
                                }}
                                style={styles.passwordCancelButton}
                            >
                                <Text style={styles.passwordCancelButtonText}>Cancel</Text>
                            </Pressable>
                        </View>
                    ) : null}
                </SettingsSection>

                <Pressable onPress={handleSignOut} style={styles.signOutButton}>
                    <MaterialCommunityIcons color="#EF4444" name="logout-variant" size={18} />
                    <Text style={styles.signOutText}>Sign Out</Text>
                </Pressable>
            </View>
        </ApprovalScreenLayout>
    );
}
