import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ApprovalCalendarScreen } from '../../features/approval/screens/ApprovalCalendarScreen';
import { ApprovalDashboardScreen } from '../../features/approval/screens/ApprovalDashboardScreen';
import { ApprovalNotificationsScreen } from '../../features/approval/screens/ApprovalNotificationsScreen';
import { ApprovalRequestListScreen } from '../../features/approval/screens/ApprovalRequestListScreen';
import { ApprovalRequestReviewScreen } from '../../features/approval/screens/ApprovalRequestReviewScreen';
import { ApprovalSettingsScreen } from '../../features/approval/screens/ApprovalSettingsScreen';
import { ForgotPasswordScreen } from '../../features/auth/screens/ForgotPasswordScreen';
import { SignInScreen } from '../../features/auth/screens/SignInScreen';
import { SignUpScreen } from '../../features/auth/screens/SignUpScreen';
import { ConsultantDashboardScreen } from '../../features/consultant/screens/ConsultantDashboardScreen';
import { ConsultantNewRequestScreen } from '../../features/consultant/screens/ConsultantNewRequestScreen';
import { ConsultantNotificationsScreen } from '../../features/consultant/screens/ConsultantNotificationsScreen';
import { ConsultantRequestListScreen } from '../../features/consultant/screens/ConsultantRequestListScreen';
import { ConsultantRequestDetailScreen } from '../../features/consultant/screens/ConsultantRequestDetailScreen';
import { ConsultantSettingsScreen } from '../../features/consultant/screens/ConsultantSettingsScreen';
import { SplashScreen } from '../../features/splash/screens/SplashScreen';

const Stack = createNativeStackNavigator();

export function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            <Stack.Screen component={SplashScreen} name="Splash" />
            <Stack.Screen component={ApprovalCalendarScreen} name="ApprovalCalendar" />
            <Stack.Screen component={ApprovalDashboardScreen} name="ApprovalDashboard" />
            <Stack.Screen component={ApprovalNotificationsScreen} name="ApprovalNotifications" />
            <Stack.Screen component={ApprovalRequestListScreen} name="ApprovalRequestList" />
            <Stack.Screen component={ApprovalRequestReviewScreen} name="ApprovalRequestReview" />
            <Stack.Screen component={ApprovalSettingsScreen} name="ApprovalSettings" />
            <Stack.Screen component={ConsultantDashboardScreen} name="ConsultantDashboard" />
            <Stack.Screen component={ConsultantNewRequestScreen} name="ConsultantNewRequest" />
            <Stack.Screen component={ConsultantNotificationsScreen} name="ConsultantNotifications" />
            <Stack.Screen component={ConsultantRequestListScreen} name="ConsultantRequestList" />
            <Stack.Screen component={ConsultantRequestDetailScreen} name="ConsultantRequestDetail" />
            <Stack.Screen component={ConsultantSettingsScreen} name="ConsultantSettings" />
            <Stack.Screen component={ForgotPasswordScreen} name="ForgotPassword" />
            <Stack.Screen component={SignInScreen} name="SignIn" />
            <Stack.Screen component={SignUpScreen} name="SignUp" />
        </Stack.Navigator>
    );
}
