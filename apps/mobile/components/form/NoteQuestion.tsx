import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface NoteQuestionProps {
    data: any; // Accepts the data object from FormQuestion
    onAnswerChange: (value: string) => void;
}

const NoteQuestion: React.FC<NoteQuestionProps> = ({ data, onAnswerChange }) => {
    const [text, setText] = useState('');

    const handleChangeText = (value: string) => {
        setText(value);
        onAnswerChange(value);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.helperText}>{data.placeholder || 'Type your answer here...'}</Text>
            <TextInput
                style={styles.input}
                multiline
                textAlignVertical='top' // Ensures text starts at top-left on Android
                placeholder={data.placeholder || 'Enter your notes...'}
                placeholderTextColor='#999'
                value={text}
                onChangeText={handleChangeText}
                // Optional: autoFocus={true}
            />
            <Text style={styles.charCount}>{text.length} characters</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 10,
    },
    helperText: {
        marginBottom: 8,
        color: '#666',
        fontSize: 14,
        fontStyle: 'italic',
    },
    input: {
        height: 150, // Fixed height for a "Note" feel
        width: '100%',
        borderColor: '#E0E0E0',
        borderWidth: 2,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        backgroundColor: '#FAFAFA',
        color: '#333',
    },
    charCount: {
        textAlign: 'right',
        marginTop: 8,
        color: '#999',
        fontSize: 12,
    },
});

export default NoteQuestion;
