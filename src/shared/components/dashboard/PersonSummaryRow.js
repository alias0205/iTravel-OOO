import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, Pressable, Text, View } from 'react-native';

import { PersonSummaryRowStyles as styles } from '../../../styles';

export function PersonSummaryRow({ avatarLabel, avatarSource, name, subtitle, extra, showAction = false }) {
    return (
        <View style={styles.row}>
            {avatarSource ? (
                <Image source={avatarSource} style={styles.avatarImage} />
            ) : (
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{avatarLabel}</Text>
                </View>
            )}

            <View style={styles.copy}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
                {extra ? <Text style={styles.extra}>{extra}</Text> : null}
            </View>

            {showAction ? (
                <Pressable style={styles.actionButton}>
                    <MaterialCommunityIcons color="#495361" name="email" size={18} />
                </Pressable>
            ) : null}
        </View>
    );
}
