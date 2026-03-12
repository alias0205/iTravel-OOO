import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useMemo, useState } from 'react';
import { Platform, Pressable, Text, TextInput, View } from 'react-native';

import { ConsultantScreenLayout } from '../components/ConsultantScreenLayout';
import { ConsultantNewRequestScreenStyles as styles } from '../../../styles';
import { DetailSectionCard } from '../../../shared/components/dashboard/DetailSectionCard';

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

function getRequestedDays(startDate, endDate) {
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

    return inclusiveDays;
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
    const [reason, setReason] = useState('');
    const [submitAttempted, setSubmitAttempted] = useState(false);

    const requestedDays = useMemo(() => getRequestedDays(startDate, endDate), [endDate, startDate]);
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

    const handleSubmit = () => {
        setSubmitAttempted(true);

        if (!isFormValid) {
            return;
        }

        navigation.goBack();
    };

    return (
        <ConsultantScreenLayout
            activeNavKey="new-request"
            headerSubtitle="Create and submit a new out-of-office request"
            headerTitle="New Leave Request"
            navigation={navigation}
            notificationCount={3}
            scrollContentStyle={styles.scrollContent}
            showBackButton
        >
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

                <Pressable onPress={handleSubmit} style={[styles.footerButton, styles.footerButtonPrimary, !isFormValid ? styles.footerButtonPrimaryDisabled : null]}>
                    <Text style={styles.footerButtonPrimaryText}>Submit Request</Text>
                </Pressable>
            </View>
        </ConsultantScreenLayout>
    );
}
