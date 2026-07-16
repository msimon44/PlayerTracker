import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface TextQuestionProps {
    data: {
        placeholder?: string;
        keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
        autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
        [key: string]: any;
    };
    onAnswerChange: (value: string) => void;
}

const TextQuestion: React.FC<TextQuestionProps> = ({ data, onAnswerChange }) => {
    const [value, setValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleChangeText = (text: string) => {
        setValue(text);
        onAnswerChange(text);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={[styles.input, isFocused ? styles.inputFocused : styles.inputBlur]}
                value={value}
                onChangeText={handleChangeText}
                placeholder={data.placeholder || 'Type here...'}
                placeholderTextColor='#999'
                keyboardType={data.keyboardType || 'default'}
                autoCapitalize={data.autoCapitalize || 'sentences'}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 10,
    },
    input: {
        width: '100%',
        height: 56,
        borderWidth: 2,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: '#FAFAFA',
        color: '#333',
    },
    inputBlur: {
        borderColor: '#E0E0E0',
    },
    inputFocused: {
        borderColor: '#6200ee',
        backgroundColor: '#FFFFFF',
    },
});

export default TextQuestion;
