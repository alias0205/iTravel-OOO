import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from './src/app/navigation/AppNavigator';
import { ApprovalNotificationsProvider } from './src/features/approval/context/ApprovalNotificationsContext';
import { AuthSessionProvider } from './src/features/auth/context/AuthSessionContext';
import { ConsultantNotificationsProvider } from './src/features/consultant/context/ConsultantNotificationsContext';

export default function App() {
    return (
        <SafeAreaProvider>
            <AuthSessionProvider>
                <ApprovalNotificationsProvider>
                    <ConsultantNotificationsProvider>
                        <NavigationContainer>
                            <AppNavigator />
                        </NavigationContainer>
                    </ConsultantNotificationsProvider>
                </ApprovalNotificationsProvider>
            </AuthSessionProvider>
        </SafeAreaProvider>
    );
}
