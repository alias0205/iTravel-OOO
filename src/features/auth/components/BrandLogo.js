import { Image, View } from 'react-native';

import { BrandLogoStyles as styles } from '../../../styles';

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
