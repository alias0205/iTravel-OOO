import { Pressable, Text, View } from 'react-native';

import { DashboardSectionHeaderStyles as styles } from '../../../styles';

export function DashboardSectionHeader({ title, actionLabel, onActionPress }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {actionLabel ? (
                <Pressable onPress={onActionPress}>
                    <Text style={styles.action}>{actionLabel}</Text>
                </Pressable>
            ) : null}
        </View>
    );
}
