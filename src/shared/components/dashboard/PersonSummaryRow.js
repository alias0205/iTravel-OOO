import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

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

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#D6E2E1',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarImage: {
        width: 42,
        height: 42,
        borderRadius: 21,
        marginRight: 12,
    },
    avatarText: {
        color: '#21414A',
        fontSize: 13,
        lineHeight: 16,
        fontWeight: '800',
    },
    copy: {
        flex: 1,
    },
    name: {
        color: '#202937',
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '800',
    },
    subtitle: {
        color: '#6F7787',
        fontSize: 14,
        lineHeight: 20,
    },
    extra: {
        color: '#6F7787',
        fontSize: 14,
        lineHeight: 20,
    },
    actionButton: {
        width: 38,
        height: 38,
        borderRadius: 10,
        backgroundColor: '#F1F3F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
    },
});
