import { Text, View } from 'react-native';

import { DetailSectionCardStyles as styles } from '../../../styles';

export function DetailSectionCard({ title, children }) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            {children}
        </View>
    );
}
