import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, TextInput, View } from 'react-native';

export function DashboardSearchInput({ placeholder }) {
    return (
        <View style={styles.container}>
            <MaterialCommunityIcons color="#9AA2AF" name="magnify" size={22} />
            <TextInput placeholder={placeholder} placeholderTextColor="#9AA2AF" style={styles.input} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 46,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D8DDE4',
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        marginBottom: 12,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: '#212A37',
    },
});
