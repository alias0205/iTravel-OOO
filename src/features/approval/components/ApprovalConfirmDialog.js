import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Modal, Pressable, Text, View } from 'react-native';

import { ApprovalConfirmDialogStyles as styles } from '../../../styles';

const toneStyles = {
    approve: {
        accent: '#0A6B63',
        accentSoft: '#D9F1EA',
        buttonBackground: '#0A6B63',
        icon: 'check-circle',
    },
    reject: {
        accent: '#DC2626',
        accentSoft: '#FDE8E8',
        buttonBackground: '#DC2626',
        icon: 'close-circle',
    },
};

export function ApprovalConfirmDialog({ visible, title, message, request, confirmLabel, cancelLabel = 'Cancel', tone = 'approve', onConfirm, onClose }) {
    const currentTone = toneStyles[tone] ?? toneStyles.approve;

    return (
        <Modal animationType="fade" onRequestClose={onClose} statusBarTranslucent transparent visible={visible}>
            <View style={styles.overlay}>
                <Pressable onPress={onClose} style={styles.backdrop} />

                <View style={styles.dialogCard}>
                    <View style={[styles.iconWrap, { backgroundColor: currentTone.accentSoft }]}>
                        <MaterialCommunityIcons color={currentTone.accent} name={currentTone.icon} size={26} />
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    {request ? (
                        <View style={styles.requestSummaryCard}>
                            <View style={styles.requestSummaryRow}>
                                <Text style={styles.requestSummaryLabel}>Employee</Text>
                                <Text style={styles.requestSummaryValue}>{request.name}</Text>
                            </View>
                            <View style={styles.requestSummaryRow}>
                                <Text style={styles.requestSummaryLabel}>Request</Text>
                                <Text style={styles.requestSummaryValue}>{request.leaveLabel}</Text>
                            </View>
                            <View style={styles.requestSummaryRow}>
                                <Text style={styles.requestSummaryLabel}>Dates</Text>
                                <Text style={styles.requestSummaryValue}>{request.dateRange}</Text>
                            </View>
                        </View>
                    ) : null}

                    <View style={styles.actionsRow}>
                        <Pressable onPress={onClose} style={[styles.actionButton, styles.cancelButton]}>
                            <Text style={styles.cancelButtonText}>{cancelLabel}</Text>
                        </Pressable>
                        <Pressable onPress={onConfirm} style={[styles.actionButton, { backgroundColor: currentTone.buttonBackground }]}>
                            <Text style={styles.confirmButtonText}>{confirmLabel}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
