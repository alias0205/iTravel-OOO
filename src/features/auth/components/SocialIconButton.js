import { Pressable } from 'react-native';

import { SocialIconButtonStyles as styles, colors } from '../../../styles';

export function SocialIconButton({ children, onPress }) {
    return (
        <Pressable onPress={onPress} style={styles.button}>
            {children}
        </Pressable>
    );
}
