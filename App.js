import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from './src/app/navigation/AppNavigator';
import { ApprovalNotificationsProvider } from './src/features/approval/context/ApprovalNotificationsContext';
import { AuthSessionProvider } from './src/features/auth/context/AuthSessionContext';

export default function App() {
    return (
        <SafeAreaProvider>
            <AuthSessionProvider>
                <ApprovalNotificationsProvider>
                    <NavigationContainer>
                        <AppNavigator />
                    </NavigationContainer>
                </ApprovalNotificationsProvider>
            </AuthSessionProvider>
        </SafeAreaProvider>
    );
}
