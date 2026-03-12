import { Alert } from 'react-native';

export function showApproveRequestDialog(request) {
    Alert.alert('Approve Request', 'Approve ' + request.name + "'s " + request.leaveLabel + ' request for ' + request.dateRange + '?', [
        { style: 'cancel', text: 'Cancel' },
        {
            text: 'Approve',
            onPress: () => {
                Alert.alert('Request Approved', request.name + "'s request has been approved.");
            },
        },
    ]);
}
