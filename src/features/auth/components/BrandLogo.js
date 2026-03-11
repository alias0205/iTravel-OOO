import { Image, StyleSheet, View } from 'react-native';

const logoSources = {
    dark: require('../../../../assets/nutra/logo-dark.png'),
    light: require('../../../../assets/nutra/logo-light.png'),
};

export function BrandLogo({ variant = 'dark', containerStyle, imageStyle }) {
    return (
        <View style={[styles.logoBlock, containerStyle]}>
            <Image resizeMode="contain" source={logoSources[variant] ?? logoSources.dark} style={[styles.logoImage, imageStyle]} />
        </View>
    );
}

const styles = StyleSheet.create({
    logoBlock: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logoImage: {
        width: 168,
        height: 64,
    },
});
