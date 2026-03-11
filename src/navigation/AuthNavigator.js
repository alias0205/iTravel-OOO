import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { SignInScreen } from '../screens/SignInScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { SplashScreen } from '../screens/SplashScreen';

const Stack = createNativeStackNavigator();

export function AuthNavigator() {
    return (
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            <Stack.Screen component={SplashScreen} name="Splash" />
            <Stack.Screen component={ForgotPasswordScreen} name="ForgotPassword" />
            <Stack.Screen component={SignInScreen} name="SignIn" />
            <Stack.Screen component={SignUpScreen} name="SignUp" />
        </Stack.Navigator>
    );
}
