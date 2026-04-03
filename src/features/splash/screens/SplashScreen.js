import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthSession } from '../../auth/context/AuthSessionContext';
import { getLoginRoute } from '../../auth/utils/authApi';
import { SplashScreenStyles as styles } from '../../../styles';

const splashColors = {
    background: '#005F5B',
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.88)',
    textMuted: 'rgba(255, 255, 255, 0.74)',
    textSoft: 'rgba(255, 255, 255, 0.56)',
    iconSurface: '#F4F6F5',
    iconColor: '#005F5B',
    bubble: 'rgba(255, 255, 255, 0.05)',
    dotIdle: 'rgba(255, 255, 255, 0.38)',
    dotActive: '#FFFFFF',
};

const SPLASH_ROUTE_DELAY = 1800;
const ENTRANCE_DURATION = 650;
const shouldUseNativeDriver = false;

function LoadingDots() {
    const dotAnimations = useRef([new Animated.Value(0.35), new Animated.Value(0.35), new Animated.Value(0.35)]).current;

    useEffect(() => {
        const loops = dotAnimations.map((animatedValue, index) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(index * 180),
                    Animated.timing(animatedValue, {
                        toValue: 1,
                        duration: 320,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: shouldUseNativeDriver,
                    }),
                    Animated.timing(animatedValue, {
                        toValue: 0.35,
                        duration: 320,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: shouldUseNativeDriver,
                    }),
                    Animated.delay(240),
                ])
            )
        );

        loops.forEach((loop) => loop.start());

        return () => {
            loops.forEach((loop) => loop.stop());
        };
    }, [dotAnimations]);

    return (
        <View style={styles.dotRow}>
            {dotAnimations.map((animatedValue, index) => (
                <Animated.View
                    key={`loading-dot-${index}`}
                    style={[
                        styles.dot,
                        {
                            opacity: animatedValue,
                            transform: [
                                {
                                    scale: animatedValue.interpolate({
                                        inputRange: [0.35, 1],
                                        outputRange: [0.88, 1.12],
                                    }),
                                },
                            ],
                        },
                    ]}
                />
            ))}
        </View>
    );
}

export function SplashScreen({ navigation }) {
    const { isReady, user } = useAuthSession();
    const heroOpacity = useRef(new Animated.Value(0)).current;
    const heroTranslateY = useRef(new Animated.Value(24)).current;
    const iconScale = useRef(new Animated.Value(0.92)).current;
    const loadingOpacity = useRef(new Animated.Value(0)).current;
    const loadingTranslateY = useRef(new Animated.Value(12)).current;
    const hasNavigatedRef = useRef(false);

    const handleContinue = (nextRouteName = 'SignIn') => {
        if (hasNavigatedRef.current) {
            return;
        }

        hasNavigatedRef.current = true;
        navigation.reset({
            index: 0,
            routes: [{ name: nextRouteName }],
        });
    };

    useEffect(() => {
        const entranceAnimation = Animated.sequence([
            Animated.parallel([
                Animated.timing(heroOpacity, {
                    toValue: 1,
                    duration: ENTRANCE_DURATION,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: shouldUseNativeDriver,
                }),
                Animated.timing(heroTranslateY, {
                    toValue: 0,
                    duration: ENTRANCE_DURATION,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: shouldUseNativeDriver,
                }),
                Animated.timing(iconScale, {
                    toValue: 1,
                    duration: ENTRANCE_DURATION,
                    easing: Easing.out(Easing.back(1.1)),
                    useNativeDriver: shouldUseNativeDriver,
                }),
            ]),
            Animated.parallel([
                Animated.timing(loadingOpacity, {
                    toValue: 1,
                    duration: 380,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: shouldUseNativeDriver,
                }),
                Animated.timing(loadingTranslateY, {
                    toValue: 0,
                    duration: 380,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: shouldUseNativeDriver,
                }),
            ]),
        ]);

        entranceAnimation.start();

        return () => {
            entranceAnimation.stop();
        };
    }, [heroOpacity, heroTranslateY, iconScale, loadingOpacity, loadingTranslateY]);

    useEffect(() => {
        if (!isReady) {
            return undefined;
        }

        const timeoutId = setTimeout(() => {
            const nextRouteName = getLoginRoute(user) ?? 'SignIn';
            handleContinue(nextRouteName);
        }, SPLASH_ROUTE_DELAY);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [isReady, navigation, user]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={[styles.bubble, styles.bubbleTopLeft]} />
                <View style={[styles.bubble, styles.bubbleTopRight]} />
                <View style={[styles.bubble, styles.bubbleMiddleRight]} />
                <View style={[styles.bubble, styles.bubbleBottomLeft]} />
                <View style={[styles.bubble, styles.bubbleBottomRight]} />

                <Animated.View
                    style={[
                        styles.content,
                        {
                            opacity: heroOpacity,
                            transform: [{ translateY: heroTranslateY }],
                        },
                    ]}
                >
                    <Animated.View
                        style={[
                            styles.iconTile,
                            {
                                transform: [{ scale: iconScale }],
                            },
                        ]}
                    >
                        <MaterialCommunityIcons color={splashColors.iconColor} name="airplane" size={34} />
                    </Animated.View>

                    <Text style={styles.brandText}>
                        <Text style={styles.brandStrong}>iTravel</Text> <Text style={styles.brandLight}>OOO</Text>
                    </Text>

                    <Text style={styles.title}>Out of Office</Text>
                    <Text style={styles.subtitle}>Streamline leave requests & consultant management</Text>

                    <Animated.View
                        style={[
                            styles.loadingBlock,
                            {
                                opacity: loadingOpacity,
                                transform: [{ translateY: loadingTranslateY }],
                            },
                        ]}
                    >
                        <Text style={styles.loadingText}>Loading...</Text>
                        <LoadingDots />
                    </Animated.View>
                </Animated.View>

                <Text style={styles.footer}>© 2026 iTravel OOO. All rights reserved.</Text>
            </View>
        </SafeAreaView>
    );
}
