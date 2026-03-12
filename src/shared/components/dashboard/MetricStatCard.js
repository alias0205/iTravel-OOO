import { Text, View } from 'react-native';

import { MetricStatCardStyles as styles } from '../../../styles';

export function MetricStatCard({ title, value, subtitle, tone = 'mint' }) {
    return (
        <View style={[styles.card, tone === 'neutral' ? styles.cardNeutral : styles.cardMint]}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
    );
}
