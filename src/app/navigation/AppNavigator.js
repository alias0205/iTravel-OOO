import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ApprovalDashboardScreen } from '../../features/approval/screens/ApprovalDashboardScreen';
import { ForgotPasswordScreen } from '../../features/auth/screens/ForgotPasswordScreen';
import { SignInScreen } from '../../features/auth/screens/SignInScreen';
import { SignUpScreen } from '../../features/auth/screens/SignUpScreen';
import { ConsultantDashboardScreen } from '../../features/consultant/screens/ConsultantDashboardScreen';
import { ConsultantNewRequestScreen } from '../../features/consultant/screens/ConsultantNewRequestScreen';
import { ConsultantRequestDetailScreen } from '../../features/consultant/screens/ConsultantRequestDetailScreen';
import { SplashScreen } from '../../features/splash/screens/SplashScreen';

const Stack = createNativeStackNavigator();

export function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            <Stack.Screen component={SplashScreen} name="Splash" />
            <Stack.Screen component={ApprovalDashboardScreen} name="ApprovalDashboard" />
            <Stack.Screen component={ConsultantDashboardScreen} name="ConsultantDashboard" />
            <Stack.Screen component={ConsultantNewRequestScreen} name="ConsultantNewRequest" />
            <Stack.Screen component={ConsultantRequestDetailScreen} name="ConsultantRequestDetail" />
            <Stack.Screen component={ForgotPasswordScreen} name="ForgotPassword" />
            <Stack.Screen component={SignInScreen} name="SignIn" />
            <Stack.Screen component={SignUpScreen} name="SignUp" />
        </Stack.Navigator>
    );
}
