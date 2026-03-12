import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Easing, SafeAreaView, Text, View } from 'react-native';

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

const SPLASH_ROUTE_DELAY = 2800;
const ENTRANCE_DURATION = 650;

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
                        useNativeDriver: true,
                    }),
                    Animated.timing(animatedValue, {
                        toValue: 0.35,
                        duration: 320,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
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
    const heroOpacity = useRef(new Animated.Value(0)).current;
    const heroTranslateY = useRef(new Animated.Value(24)).current;
    const iconScale = useRef(new Animated.Value(0.92)).current;
    const loadingOpacity = useRef(new Animated.Value(0)).current;
    const loadingTranslateY = useRef(new Animated.Value(12)).current;

    useEffect(() => {
        const entranceAnimation = Animated.sequence([
            Animated.parallel([
                Animated.timing(heroOpacity, {
                    toValue: 1,
                    duration: ENTRANCE_DURATION,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(heroTranslateY, {
                    toValue: 0,
                    duration: ENTRANCE_DURATION,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(iconScale, {
                    toValue: 1,
                    duration: ENTRANCE_DURATION,
                    easing: Easing.out(Easing.back(1.1)),
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(loadingOpacity, {
                    toValue: 1,
                    duration: 380,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(loadingTranslateY, {
                    toValue: 0,
                    duration: 380,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
            ]),
        ]);

        entranceAnimation.start();

        const timeoutId = setTimeout(() => {
            navigation.replace('SignIn');
        }, SPLASH_ROUTE_DELAY);

        return () => {
            clearTimeout(timeoutId);
            entranceAnimation.stop();
        };
    }, [heroOpacity, heroTranslateY, iconScale, loadingOpacity, loadingTranslateY, navigation]);

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

                    <Text style={styles.title}>Out of Office made simple</Text>
                    <Text style={styles.subtitle}>Streamline leave requests & consuldant management</Text>

                    <Animated.View
                        style={[
                            styles.loadingBlock,
                            {
                                opacity: loadingOpacity,
                                transform: [{ translateY: loadingTranslateY }],
                            },
                        ]}
                    >
                        <Text style={styles.loadingText}>Loading your workspace...</Text>
                        <LoadingDots />
                    </Animated.View>
                </Animated.View>

                <Text style={styles.footer}>© 2024 iTravel OOO. All rights reserved.</Text>
            </View>
        </SafeAreaView>
    );
}
