import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput, View } from 'react-native';

import { DashboardSearchInputStyles as styles } from '../../../styles';

export function DashboardSearchInput({ onChangeText, placeholder, value }) {
    return (
        <View style={styles.container}>
            <MaterialCommunityIcons color="#9AA2AF" name="magnify" size={22} />
            <TextInput autoCapitalize="none" onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#9AA2AF" style={styles.input} value={value} />
        </View>
    );
}
