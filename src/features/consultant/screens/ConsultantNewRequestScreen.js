import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useMemo, useState } from 'react';
import { Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { DashboardTopBar } from '../../../shared/components/dashboard/DashboardTopBar';
import { DetailSectionCard } from '../../../shared/components/dashboard/DetailSectionCard';

const consultantAvatar = require('../../../../assets/nutra/avatars/avatar-1.jpg');

const leaveOptions = ['Annual Leave', 'Sick Leave', 'Vacation', 'Personal Leave'];
const AVAILABLE_BALANCE = 18.5;

function normalizeDate(dateValue) {
    return new Date(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate());
}

function formatDate(dateValue) {
    if (!dateValue) {
        return 'mm/dd/yyyy';
    }

    const month = `${dateValue.getMonth() + 1}`.padStart(2, '0');
    const day = `${dateValue.getDate()}`.padStart(2, '0');
    const year = dateValue.getFullYear();

    return `${month}/${day}/${year}`;
}

function getRequestedDays(startDate, endDate, halfDay) {
    if (!startDate || !endDate) {
        return 0;
    }

    const normalizedStartDate = normalizeDate(startDate);
    const normalizedEndDate = normalizeDate(endDate);

    if (normalizedEndDate < normalizedStartDate) {
        return 0;
    }

    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const inclusiveDays = Math.round((normalizedEndDate - normalizedStartDate) / millisecondsPerDay) + 1;

    if (inclusiveDays <= 0) {
        return 0;
    }

    return halfDay ? 0.5 : inclusiveDays;
}

function formatDaysLabel(days) {
    if (!days) {
        return '-';
    }

    return `${days} ${days === 1 ? 'day' : 'days'}`;
}

function BalanceItem({ value, label, tone = 'teal' }) {
    return (
        <View style={styles.balanceItem}>
            <Text
                style={[
                    styles.balanceValue,
                    tone === 'orange' ? styles.balanceValueOrange : null,
                    tone === 'gold' ? styles.balanceValueGold : null,
                    tone === 'slate' ? styles.balanceValueSlate : null,
                ]}
            >
                {value}
            </Text>
            <Text style={styles.balanceLabel}>{label}</Text>
        </View>
    );
}

function FieldLabel({ children }) {
    return <Text style={styles.fieldLabel}>{children}</Text>;
}

function SummaryRow({ label, value, valueTone = 'default' }) {
    return (
        <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{label}</Text>
            <Text style={[styles.summaryValue, valueTone === 'teal' ? styles.summaryValueTeal : null]}>{value}</Text>
        </View>
    );
}

export function ConsultantNewRequestScreen({ navigation }) {
    const [selectedLeaveType, setSelectedLeaveType] = useState('');
    const [isLeaveTypeOpen, setIsLeaveTypeOpen] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [activePickerField, setActivePickerField] = useState(null);
    const [halfDay, setHalfDay] = useState(false);
    const [reason, setReason] = useState('');
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [draftSaved, setDraftSaved] = useState(false);

    const requestedDays = useMemo(() => getRequestedDays(startDate, endDate, halfDay), [endDate, halfDay, startDate]);
    const hasDateOrderError = Boolean(startDate && endDate && normalizeDate(endDate) < normalizeDate(startDate));
    const isFormValid = Boolean(selectedLeaveType && startDate && endDate && !hasDateOrderError);

    const summary = useMemo(() => {
        const remainingBalance = Math.max(AVAILABLE_BALANCE - requestedDays, 0);

        return {
            leaveType: selectedLeaveType || '-',
            duration: formatDaysLabel(requestedDays),
            requestedDays: requestedDays ? String(requestedDays) : '0',
            remainingBalance: `${remainingBalance.toFixed(remainingBalance % 1 === 0 ? 0 : 1)} days`,
        };
    }, [requestedDays, selectedLeaveType]);

    const visibleErrors = {
        leaveType: submitAttempted && !selectedLeaveType ? 'Please select a leave type' : '',
        startDate: submitAttempted && !startDate ? 'Please choose a start date' : '',
        endDate: submitAttempted && !endDate ? 'Please choose an end date' : submitAttempted && hasDateOrderError ? 'End date must be on or after the start date' : '',
    };

    const pickerValue = activePickerField === 'end' ? (endDate ?? startDate ?? new Date()) : (startDate ?? new Date());

    const handleDateChange = (_event, selectedDate) => {
        if (Platform.OS === 'android') {
            setActivePickerField(null);
        }

        if (!selectedDate || !activePickerField) {
            return;
        }

        const normalizedSelectedDate = normalizeDate(selectedDate);

        if (activePickerField === 'start') {
            setStartDate(normalizedSelectedDate);
            if (endDate && normalizeDate(endDate) < normalizedSelectedDate) {
                setEndDate(normalizedSelectedDate);
            }
            return;
        }

        setEndDate(normalizedSelectedDate);
    };

    const renderPicker = (fieldName) => {
        if (activePickerField !== fieldName) {
            return null;
        }

        return (
            <View style={styles.pickerWrap}>
                <DateTimePicker
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    minimumDate={fieldName === 'end' && startDate ? startDate : undefined}
                    mode="date"
                    onChange={handleDateChange}
                    value={pickerValue}
                />
                {Platform.OS === 'ios' ? (
                    <Pressable onPress={() => setActivePickerField(null)} style={styles.pickerDoneButton}>
                        <Text style={styles.pickerDoneText}>Done</Text>
                    </Pressable>
                ) : null}
            </View>
        );
    };

    const handleSaveDraft = () => {
        setDraftSaved(true);
        setSubmitAttempted(false);
    };

    const handleSubmit = () => {
        setSubmitAttempted(true);
        setDraftSaved(false);

        if (!isFormValid) {
            return;
        }

        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <DashboardTopBar avatarSource={consultantAvatar} leftIconName="menu" showBrandIcon showNotification={false} subtitle="Nutrastat" title="iTravel OOO" variant="light" />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.pagePadding}>
                    <DetailSectionCard title="Your Leave Balance">
                        <View style={styles.balanceGrid}>
                            <BalanceItem label="Available Days" value="18.5" />
                            <BalanceItem label="Used This Year" tone="orange" value="6.5" />
                            <BalanceItem label="Pending Requests" tone="gold" value="2" />
                            <BalanceItem label="Annual Allowance" tone="slate" value="25" />
                        </View>
                    </DetailSectionCard>

                    <DetailSectionCard title="New Leave Request">
                        <View style={styles.leaveTypeFieldWrap}>
                            <FieldLabel>Leave Type *</FieldLabel>
                            <Pressable
                                onPress={() => setIsLeaveTypeOpen((currentValue) => !currentValue)}
                                style={[styles.inputShell, isLeaveTypeOpen ? styles.inputShellActive : null]}
                            >
                                <Text style={selectedLeaveType ? styles.inputValue : styles.inputPlaceholder}>{selectedLeaveType || 'Select leave type'}</Text>
                                <MaterialCommunityIcons color="#111827" name={isLeaveTypeOpen ? 'chevron-up' : 'chevron-down'} size={20} />
                            </Pressable>
                            {visibleErrors.leaveType ? <Text style={styles.errorText}>{visibleErrors.leaveType}</Text> : null}
                            {isLeaveTypeOpen ? (
                                <View style={styles.optionListOverlay}>
                                    <View style={styles.optionList}>
                                        {leaveOptions.map((option) => (
                                            <Pressable
                                                key={option}
                                                onPress={() => {
                                                    setSelectedLeaveType(option);
                                                    setIsLeaveTypeOpen(false);
                                                }}
                                                style={[styles.optionItem, option === selectedLeaveType ? styles.optionItemActive : null]}
                                            >
                                                <Text style={[styles.optionText, option === selectedLeaveType ? styles.optionTextActive : null]}>{option}</Text>
                                                {option === selectedLeaveType ? <MaterialCommunityIcons color="#0A6B63" name="check" size={18} /> : null}
                                            </Pressable>
                                        ))}
                                    </View>
                                </View>
                            ) : null}
                        </View>

                        <FieldLabel>Start Date *</FieldLabel>
                        <Pressable
                            onPress={() => setActivePickerField((currentValue) => (currentValue === 'start' ? null : 'start'))}
                            style={[styles.inputShell, activePickerField === 'start' ? styles.inputShellActive : null, visibleErrors.startDate ? styles.inputShellError : null]}
                        >
                            <Text style={startDate ? styles.inputValue : styles.inputPlaceholder}>{formatDate(startDate)}</Text>
                            <MaterialCommunityIcons color="#8B8B8B" name="calendar-month-outline" size={20} />
                        </Pressable>
                        {visibleErrors.startDate ? <Text style={styles.errorText}>{visibleErrors.startDate}</Text> : null}
                        {renderPicker('start')}

                        <FieldLabel>End Date *</FieldLabel>
                        <Pressable
                            onPress={() => setActivePickerField((currentValue) => (currentValue === 'end' ? null : 'end'))}
                            style={[styles.inputShell, activePickerField === 'end' ? styles.inputShellActive : null, visibleErrors.endDate ? styles.inputShellError : null]}
                        >
                            <Text style={endDate ? styles.inputValue : styles.inputPlaceholder}>{formatDate(endDate)}</Text>
                            <MaterialCommunityIcons color="#8B8B8B" name="calendar-month-outline" size={20} />
                        </Pressable>
                        {visibleErrors.endDate ? <Text style={styles.errorText}>{visibleErrors.endDate}</Text> : null}
                        {renderPicker('end')}

                        <View style={styles.toggleCard}>
                            <View style={styles.toggleCopy}>
                                <Text style={styles.toggleTitle}>Half Day Request</Text>
                                <Text style={styles.toggleSubtitle}>Request only half of the selected day(s)</Text>
                            </View>
                            <Switch onValueChange={setHalfDay} thumbColor="#FFFFFF" trackColor={{ false: '#D1D5DB', true: '#0A6B63' }} value={halfDay} />
                        </View>

                        <FieldLabel>Reason/Notes</FieldLabel>
                        <View style={styles.textAreaShell}>
                            <TextInput
                                multiline
                                onChangeText={setReason}
                                placeholder="Please provide a brief reason for your leave request..."
                                placeholderTextColor="#9CA3AF"
                                style={styles.textArea}
                                textAlignVertical="top"
                                value={reason}
                            />
                        </View>

                        <FieldLabel>Attachments (Optional)</FieldLabel>
                        <View style={styles.uploadBox}>
                            <View style={styles.uploadIconWrap}>
                                <MaterialCommunityIcons color="#9CA3AF" name="cloud-upload-outline" size={34} />
                            </View>
                            <Text style={styles.uploadTitle}>Drop files here or click to browse</Text>
                            <Text style={styles.uploadSubtitle}>Supports: PDF, DOC, DOCX, JPG, PNG</Text>
                            <Text style={styles.uploadSubtitle}>(Max 5MB each)</Text>
                            <Pressable style={styles.uploadButton}>
                                <Text style={styles.uploadButtonText}>Choose Files</Text>
                            </Pressable>
                        </View>
                    </DetailSectionCard>

                    <DetailSectionCard title="Request Summary">
                        <SummaryRow label="Leave Type:" value={summary.leaveType} />
                        <View style={styles.summaryDivider} />
                        <SummaryRow label="Duration:" value={summary.duration} />
                        <View style={styles.summaryDivider} />
                        <SummaryRow label="Days Requested:" value={summary.requestedDays} />
                        <View style={styles.summaryDivider} />
                        <SummaryRow label="Remaining Balance:" value={summary.remainingBalance} valueTone="teal" />
                    </DetailSectionCard>

                    {draftSaved ? <Text style={styles.helperText}>Draft saved locally.</Text> : null}

                    <Pressable onPress={handleSaveDraft} style={[styles.footerButton, styles.footerButtonMuted]}>
                        <Text style={styles.footerButtonMutedText}>Save as Draft</Text>
                    </Pressable>
                    <Pressable onPress={handleSubmit} style={[styles.footerButton, styles.footerButtonPrimary, !isFormValid ? styles.footerButtonPrimaryDisabled : null]}>
                        <Text style={styles.footerButtonPrimaryText}>Submit Request</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F4F5F7',
    },
    scrollContent: {
        paddingBottom: 18,
    },
    pagePadding: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    balanceGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -8,
        marginBottom: -18,
    },
    balanceItem: {
        width: '50%',
        alignItems: 'center',
        paddingHorizontal: 8,
        marginBottom: 18,
    },
    balanceValue: {
        color: '#0F766E',
        fontSize: 26,
        lineHeight: 30,
        fontWeight: '800',
        marginBottom: 4,
    },
    balanceValueOrange: {
        color: '#EA580C',
    },
    balanceValueGold: {
        color: '#CA8A04',
    },
    balanceValueSlate: {
        color: '#475569',
    },
    balanceLabel: {
        color: '#5B6575',
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
    },
    fieldLabel: {
        color: '#1F2937',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '700',
        marginBottom: 10,
        marginTop: 2,
    },
    leaveTypeFieldWrap: {
        position: 'relative',
        zIndex: 20,
    },
    inputShell: {
        minHeight: 46,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#C9D2DE',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18,
    },
    inputShellActive: {
        borderColor: '#0A6B63',
    },
    inputShellError: {
        borderColor: '#DC2626',
    },
    inputPlaceholder: {
        color: '#9CA3AF',
        fontSize: 16,
        lineHeight: 22,
    },
    inputValue: {
        color: '#1F2937',
        fontSize: 16,
        lineHeight: 22,
    },
    pickerWrap: {
        marginTop: -8,
        marginBottom: 18,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#D7DEE8',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
    },
    pickerDoneButton: {
        alignSelf: 'flex-end',
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    pickerDoneText: {
        color: '#0A6B63',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '700',
    },
    optionList: {
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#D7DEE8',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
    },
    optionListOverlay: {
        position: 'absolute',
        top: 76,
        left: 0,
        right: 0,
        zIndex: 30,
        shadowColor: '#0F172A',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
    },
    optionItem: {
        minHeight: 46,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#EEF2F5',
    },
    optionItemActive: {
        backgroundColor: '#EEF8F6',
    },
    optionText: {
        color: '#1F2937',
        fontSize: 15,
        lineHeight: 20,
    },
    optionTextActive: {
        color: '#0A6B63',
        fontWeight: '700',
    },
    errorText: {
        marginTop: -10,
        marginBottom: 12,
        color: '#DC2626',
        fontSize: 12,
        lineHeight: 18,
    },
    toggleCard: {
        borderRadius: 14,
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 16,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 22,
    },
    toggleCopy: {
        flex: 1,
        paddingRight: 12,
    },
    toggleTitle: {
        color: '#1F2937',
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    toggleSubtitle: {
        color: '#5B6575',
        fontSize: 14,
        lineHeight: 20,
    },
    textAreaShell: {
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#C9D2DE',
        backgroundColor: '#FFFFFF',
        minHeight: 122,
        marginBottom: 22,
    },
    textArea: {
        minHeight: 122,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: '#1F2937',
        fontSize: 16,
        lineHeight: 26,
    },
    uploadBox: {
        borderRadius: 16,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderColor: '#C9D2DE',
        backgroundColor: '#FBFCFD',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 26,
    },
    uploadIconWrap: {
        marginBottom: 10,
    },
    uploadTitle: {
        color: '#4B5563',
        fontSize: 16,
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: 8,
    },
    uploadSubtitle: {
        color: '#6B7280',
        fontSize: 13,
        lineHeight: 18,
        textAlign: 'center',
    },
    uploadButton: {
        marginTop: 16,
        height: 42,
        borderRadius: 10,
        backgroundColor: '#E5E7EB',
        paddingHorizontal: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadButtonText: {
        color: '#374151',
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '700',
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
    },
    summaryLabel: {
        color: '#5B6575',
        fontSize: 15,
        lineHeight: 22,
    },
    summaryValue: {
        color: '#1F2937',
        fontSize: 15,
        lineHeight: 22,
        fontWeight: '700',
    },
    summaryValueTeal: {
        color: '#0F766E',
    },
    summaryDivider: {
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    footerButton: {
        height: 54,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    footerButtonMuted: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D7DEE8',
    },
    footerButtonPrimary: {
        backgroundColor: '#0A6B63',
    },
    footerButtonPrimaryDisabled: {
        backgroundColor: '#7AA8A3',
    },
    footerButtonMutedText: {
        color: '#374151',
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '700',
    },
    footerButtonPrimaryText: {
        color: '#FFFFFF',
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '800',
    },
    helperText: {
        color: '#0F766E',
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        marginTop: -4,
        marginBottom: 12,
    },
});
