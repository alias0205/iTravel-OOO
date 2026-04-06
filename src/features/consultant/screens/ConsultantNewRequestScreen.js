import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { getApprovalDurationBreakdown } from '../../approval/utils/approvalDurationUtils';
import { ConsultantScreenLayout } from '../components/ConsultantScreenLayout';
import { fetchLeaveReasons } from '../utils/leaveReasonsApi';
import { createOutOfOfficeRequest, updateOutOfOfficeRequest } from '../utils/outOfOfficeApi';
import { useAuthSession } from '../../auth/context/AuthSessionContext';
import { ConsultantNewRequestScreenStyles as styles } from '../../../styles';
import { DetailSectionCard } from '../../../shared/components/dashboard/DetailSectionCard';

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

function formatLongDate(dateValue) {
    if (!dateValue) {
        return 'N/A';
    }

    return dateValue.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

function formatDateRangeLabel(startDate, endDate) {
    if (!startDate || !endDate) {
        return 'Date unavailable';
    }

    const sameYear = startDate.getFullYear() === endDate.getFullYear();
    const sameMonth = sameYear && startDate.getMonth() === endDate.getMonth();
    const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });

    if (sameMonth) {
        return `${startMonth} ${String(startDate.getDate()).padStart(2, '0')} - ${String(endDate.getDate()).padStart(2, '0')}, ${endDate.getFullYear()}`;
    }

    return `${startMonth} ${String(startDate.getDate()).padStart(2, '0')} - ${endMonth} ${String(endDate.getDate()).padStart(2, '0')}, ${endDate.getFullYear()}`;
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

function formatApiDate(dateValue) {
    const month = `${dateValue.getMonth() + 1}`.padStart(2, '0');
    const day = `${dateValue.getDate()}`.padStart(2, '0');
    const year = dateValue.getFullYear();

    return `${year}-${month}-${day}`;
}

function buildUpdatedRequest(request, { durationLabel, endDate, leaveType, reason, requestedDays, startDate }) {
    const trimmedReason = reason.trim();

    return {
        ...request,
        title: leaveType?.label || request?.title,
        dateRange: formatDateRangeLabel(startDate, endDate),
        startDate: formatLongDate(startDate),
        endDate: formatLongDate(endDate),
        duration: durationLabel || formatDaysLabel(requestedDays),
        detail: trimmedReason || leaveType?.label || request?.detail,
        reason: trimmedReason || 'No additional comment provided.',
        leaveTypeLabel: leaveType?.label || request?.leaveTypeLabel,
        raw: {
            ...(request?.raw || {}),
            id: request?.raw?.id || request?.id,
            start_date: formatApiDate(startDate),
            end_date: formatApiDate(endDate),
            comment: trimmedReason,
            reason: {
                ...(request?.raw?.reason || {}),
                id: leaveType?.value ?? request?.raw?.reason?.id,
                reason: leaveType?.label || request?.raw?.reason?.reason,
                label: leaveType?.label || request?.raw?.reason?.label,
            },
        },
    };
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

export function ConsultantNewRequestScreen({ navigation, route }) {
    const { session, signOut, user } = useAuthSession();
    const requestToEdit = route?.params?.request ?? null;
    const isEditMode = Boolean(requestToEdit?.id);
    const canUpdateRequest = !isEditMode || requestToEdit?.statusTone === 'pending';
    const [leaveOptions, setLeaveOptions] = useState([]);
    const [selectedLeaveType, setSelectedLeaveType] = useState(null);
    const [isLeaveTypeOpen, setIsLeaveTypeOpen] = useState(false);
    const [isLeaveTypesLoading, setIsLeaveTypesLoading] = useState(true);
    const [leaveTypesError, setLeaveTypesError] = useState('');
    const [leaveTypesReloadKey, setLeaveTypesReloadKey] = useState(0);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [activePickerField, setActivePickerField] = useState(null);
    const [reason, setReason] = useState('');
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const today = useMemo(() => normalizeDate(new Date()), []);

    useEffect(() => {
        if (!requestToEdit) {
            return;
        }

        const requestStartDate = requestToEdit?.raw?.start_date || requestToEdit?.start_date;
        const requestEndDate = requestToEdit?.raw?.end_date || requestToEdit?.end_date;
        const normalizedStartDate = requestStartDate ? normalizeDate(new Date(requestStartDate)) : null;
        const normalizedEndDate = requestEndDate ? normalizeDate(new Date(requestEndDate)) : null;

        setStartDate(normalizedStartDate);
        setEndDate(normalizedEndDate);
        setReason(typeof requestToEdit?.raw?.comment === 'string' ? requestToEdit.raw.comment : '');
    }, [requestToEdit]);

    useEffect(() => {
        let isMounted = true;

        void (async () => {
            setIsLeaveTypesLoading(true);
            setLeaveTypesError('');

            try {
                const nextLeaveOptions = await fetchLeaveReasons({
                    showCodePrefix: Array.isArray(user?.roles) && user.roles.length > 0,
                    token: session?.token,
                });

                if (!isMounted) {
                    return;
                }

                setLeaveOptions(nextLeaveOptions);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                const message = error instanceof Error ? error.message : 'Unable to load leave types right now.';
                setLeaveTypesError(message);

                if (message.toLowerCase().includes('sign in again')) {
                    await signOut();
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Splash' }],
                    });
                    return;
                }

                Alert.alert('Leave Types Unavailable', message);
            } finally {
                if (isMounted) {
                    setIsLeaveTypesLoading(false);
                }
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [leaveTypesReloadKey, navigation, session?.token, signOut, user?.roles]);

    useEffect(() => {
        if (!requestToEdit || leaveOptions.length === 0) {
            return;
        }

        const reasonId = String(requestToEdit?.raw?.reason?.id || '');

        const matchedLeaveType = leaveOptions.find((option) => {
            if (reasonId && (String(option.value) === reasonId || String(option.raw?.id) === reasonId || String(option.id) === reasonId)) {
                return true;
            }

            return option.label === requestToEdit?.leaveTypeLabel;
        });

        if (matchedLeaveType) {
            setSelectedLeaveType(matchedLeaveType);
        }
    }, [leaveOptions, requestToEdit]);

    const durationBreakdown = useMemo(() => {
        if (!startDate || !endDate) {
            return null;
        }

        return getApprovalDurationBreakdown({ startDate, endDate });
    }, [endDate, startDate]);
    const requestedDays = useMemo(() => durationBreakdown?.totalDays ?? getRequestedDays(startDate, endDate), [durationBreakdown, endDate, startDate]);
    const hasPastStartDateError = Boolean(startDate && normalizeDate(startDate) < today);
    const hasDateOrderError = Boolean(startDate && endDate && normalizeDate(endDate) < normalizeDate(startDate));
    const isFormValid = Boolean(selectedLeaveType?.value && startDate && endDate && !hasPastStartDateError && !hasDateOrderError && !isLeaveTypesLoading && canUpdateRequest);

    const summary = useMemo(() => {
        const remainingBalance = Math.max(AVAILABLE_BALANCE - requestedDays, 0);
        const payableDays = durationBreakdown ? Math.max(durationBreakdown.totalDays - durationBreakdown.weekendDays - durationBreakdown.bankHolidayDays, 0) : requestedDays;

        return {
            leaveType: selectedLeaveType?.label || '-',
            duration: durationBreakdown?.label || formatDaysLabel(requestedDays),
            requestedDays: String(payableDays || 0),
            remainingBalance: `${remainingBalance.toFixed(remainingBalance % 1 === 0 ? 0 : 1)} days`,
        };
    }, [durationBreakdown, requestedDays, selectedLeaveType]);

    const visibleErrors = {
        leaveType: submitAttempted && !selectedLeaveType?.value ? 'Please select a leave type' : leaveTypesError,
        startDate: submitAttempted && !startDate ? 'Please choose a start date' : submitAttempted && hasPastStartDateError ? 'Start date must be today or later' : '',
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
        void (async () => {
            setSubmitAttempted(true);

            if (!canUpdateRequest) {
                Alert.alert('Request Locked', 'Only pending requests can be edited.');
                return;
            }

            if (!isFormValid || isSubmitting) {
                return;
            }

            setIsSubmitting(true);

            try {
                const requestPayload = {
                    comment: reason.trim(),
                    endDate: formatApiDate(endDate),
                    leaveReason: selectedLeaveType,
                    startDate: formatApiDate(startDate),
                    token: session?.token,
                };

                if (isEditMode) {
                    await updateOutOfOfficeRequest({
                        ...requestPayload,
                        holidayId: requestToEdit?.raw?.id || requestToEdit?.id,
                    });
                } else {
                    await createOutOfOfficeRequest(requestPayload);
                }

                Alert.alert(
                    isEditMode ? 'Request Updated' : 'Request Submitted',
                    isEditMode ? 'Your out of office request has been updated successfully.' : 'Your out of office request has been created successfully.',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                if (!isEditMode) {
                                    navigation.goBack();
                                    return;
                                }

                                navigation.navigate({
                                    name: 'ConsultantRequestDetail',
                                    params: {
                                        request: buildUpdatedRequest(requestToEdit, {
                                            durationLabel: durationBreakdown?.label,
                                            endDate,
                                            leaveType: selectedLeaveType,
                                            reason,
                                            requestedDays,
                                            startDate,
                                        }),
                                    },
                                    merge: true,
                                });
                            },
                        },
                    ]
                );
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Unable to submit your request right now.';
                const status = error?.status;

                if (status === 401 || message.toLowerCase().includes('sign in again')) {
                    await signOut();
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Splash' }],
                    });
                    return;
                }

                if (status === 403) {
                    Alert.alert(
                        'Request Not Allowed',
                        message || (isEditMode ? 'You are not allowed to edit this request.' : 'You are not allowed to create out of office requests.')
                    );
                    return;
                }

                if (status === 409) {
                    Alert.alert('Request Locked', message || 'This request can no longer be edited.');
                    return;
                }

                if (status === 422) {
                    Alert.alert('Request Invalid', message);
                    return;
                }

                Alert.alert('Submission Failed', message);
            } finally {
                setIsSubmitting(false);
            }
        })();
    };

    const renderLeaveTypeModal = () => {
        if (!isLeaveTypeOpen) {
            return null;
        }

        return (
            <Modal animationType="fade" onRequestClose={() => setIsLeaveTypeOpen(false)} transparent visible>
                <Pressable onPress={() => setIsLeaveTypeOpen(false)} style={styles.modalBackdrop}>
                    <Pressable onPress={() => {}} style={styles.modalSheet}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Leave Type</Text>
                            <Pressable hitSlop={10} onPress={() => setIsLeaveTypeOpen(false)}>
                                <MaterialCommunityIcons color="#6B7280" name="close" size={22} />
                            </Pressable>
                        </View>

                        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator style={styles.optionListScroll}>
                            {leaveOptions.map((option) => (
                                <Pressable
                                    key={option.id}
                                    onPress={() => {
                                        setSelectedLeaveType(option);
                                        setIsLeaveTypeOpen(false);
                                    }}
                                    style={[styles.optionItem, option.id === selectedLeaveType?.id ? styles.optionItemActive : null]}
                                >
                                    <Text style={[styles.optionText, option.id === selectedLeaveType?.id ? styles.optionTextActive : null]}>{option.label}</Text>
                                    {option.id === selectedLeaveType?.id ? <MaterialCommunityIcons color="#0A6B63" name="check" size={18} /> : null}
                                </Pressable>
                            ))}
                        </ScrollView>
                    </Pressable>
                </Pressable>
            </Modal>
        );
    };

    return (
        <>
            {renderLeaveTypeModal()}

            <ConsultantScreenLayout
                activeNavKey="new-request"
                headerSubtitle={isEditMode ? 'Update your pending out-of-office request' : 'Create and submit a new out-of-office request'}
                headerTitle={isEditMode ? 'Edit Leave Request' : 'New Leave Request'}
                navigation={navigation}
                notificationCount={3}
                scrollEnabled={!isLeaveTypeOpen}
                scrollContentStyle={styles.scrollContent}
                showBackButton
            >
                <View style={styles.pagePadding}>
                    {/* <DetailSectionCard title="Your Leave Balance">
                    <View style={styles.balanceGrid}>
                        <BalanceItem label="Available Days" value="18.5" />
                        <BalanceItem label="Used This Year" tone="orange" value="6.5" />
                        <BalanceItem label="Pending Requests" tone="gold" value="2" />
                        <BalanceItem label="Annual Allowance" tone="slate" value="25" />
                    </View>
                </DetailSectionCard> */}

                    <DetailSectionCard title={isEditMode ? 'Edit Leave Request' : 'New Leave Request'}>
                        <View style={styles.leaveTypeFieldWrap}>
                            <FieldLabel>Leave Type *</FieldLabel>
                            <Pressable
                                disabled={isLeaveTypesLoading || leaveOptions.length === 0}
                                onPress={() => setIsLeaveTypeOpen((currentValue) => !currentValue)}
                                style={[styles.inputShell, isLeaveTypeOpen ? styles.inputShellActive : null]}
                            >
                                <Text style={selectedLeaveType?.label ? styles.inputValue : styles.inputPlaceholder}>
                                    {selectedLeaveType?.label || (isLeaveTypesLoading ? 'Loading leave types...' : 'Select leave type')}
                                </Text>
                                <MaterialCommunityIcons color="#111827" name={isLeaveTypeOpen ? 'chevron-up' : 'chevron-down'} size={20} />
                            </Pressable>
                            {visibleErrors.leaveType ? <Text style={styles.errorText}>{visibleErrors.leaveType}</Text> : null}
                            {!isLeaveTypesLoading && leaveTypesError ? (
                                <Pressable
                                    onPress={() => {
                                        setLeaveTypesError('');
                                        setIsLeaveTypeOpen(false);
                                        setLeaveTypesReloadKey((currentValue) => currentValue + 1);
                                    }}
                                    style={styles.retryButton}
                                >
                                    <MaterialCommunityIcons color="#0A6B63" name="refresh" size={16} />
                                    <Text style={styles.retryButtonText}>Try again</Text>
                                </Pressable>
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
                        {/* <View style={styles.summaryDivider} />
                    <SummaryRow label="Remaining Balance:" value={summary.remainingBalance} valueTone="teal" /> */}
                    </DetailSectionCard>

                    <Pressable onPress={handleSubmit} style={[styles.footerButton, styles.footerButtonPrimary, !isFormValid ? styles.footerButtonPrimaryDisabled : null]}>
                        <Text style={styles.footerButtonPrimaryText}>
                            {isSubmitting ? (isEditMode ? 'Updating...' : 'Submitting...') : isEditMode ? 'Update Request' : 'Submit Request'}
                        </Text>
                    </Pressable>
                </View>
            </ConsultantScreenLayout>
        </>
    );
}
