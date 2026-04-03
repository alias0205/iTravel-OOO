import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from './src/app/navigation/AppNavigator';
import { AuthSessionProvider } from './src/features/auth/context/AuthSessionContext';

export default function App() {
    return (
        <SafeAreaProvider>
            <AuthSessionProvider>
                <NavigationContainer>
                    <AppNavigator />
                </NavigationContainer>
            </AuthSessionProvider>
        </SafeAreaProvider>
    );
}
