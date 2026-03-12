import { Text, View } from 'react-native';

import { InfoFieldStyles as styles } from '../../../styles';

export function InfoField({ label, value }) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
}
