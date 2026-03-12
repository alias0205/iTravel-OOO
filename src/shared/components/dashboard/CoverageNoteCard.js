import { Image, Text, View } from 'react-native';

import { CoverageNoteCardStyles as styles } from '../../../styles';

export function CoverageNoteCard({ avatarLabel, avatarSource, name, note }) {
    return (
        <View style={styles.card}>
            {avatarSource ? (
                <Image source={avatarSource} style={styles.avatarImage} />
            ) : (
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{avatarLabel}</Text>
                </View>
            )}

            <View style={styles.copy}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.note}>{note}</Text>
            </View>
        </View>
    );
}
