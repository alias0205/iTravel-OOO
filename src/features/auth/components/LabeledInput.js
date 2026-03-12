import { Text, TextInput, View } from 'react-native';

import { LabeledInputStyles as styles, colors } from '../../../styles';

export function LabeledInput({ label, error, containerStyle, inputStyle, rightAccessory, ...inputProps }) {
    return (
        <View style={[styles.fieldGroup, containerStyle]}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.inputShell, rightAccessory ? styles.inputShellWithAccessory : null, error ? styles.inputShellError : null]}>
                <TextInput placeholderTextColor={colors.hint} style={[styles.input, rightAccessory ? styles.inputWithAccessory : null, inputStyle]} {...inputProps} />
                {rightAccessory ? <View style={styles.accessory}>{rightAccessory}</View> : null}
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
}
