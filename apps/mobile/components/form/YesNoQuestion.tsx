import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface YesNoQuestionProps {
    data: any; // Accepts the data object from FormQuestion
    onAnswerChange: (value: boolean) => void;
}

const YesNoQuestion: React.FC<YesNoQuestionProps> = ({ data, onAnswerChange }) => {
    const [selectedOption, setSelectedOption] = useState<boolean | null>(null);

    const handlePress = (value: boolean) => {
        setSelectedOption(value);
        onAnswerChange(value);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.optionButton,
                    selectedOption === true && styles.selectedButton,
                    selectedOption === false && styles.unselectedButton,
                ]}
                onPress={() => handlePress(true)}
                activeOpacity={0.8}
            >
                <Text
                    style={[styles.optionText, selectedOption === true ? styles.selectedText : styles.unselectedText]}
                >
                    Yes
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.optionButton,
                    selectedOption === false && styles.selectedButton, // Highlight if No is selected
                    selectedOption === true && styles.unselectedButton,
                ]}
                onPress={() => handlePress(false)}
                activeOpacity={0.8}
            >
                <Text
                    style={[styles.optionText, selectedOption === false ? styles.selectedText : styles.unselectedText]}
                >
                    No
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    optionButton: {
        flex: 1,
        paddingVertical: 20,
        marginHorizontal: 8,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedButton: {
        borderColor: '#6200ee',
        backgroundColor: '#F3E5F5', // Light purple background
    },
    unselectedButton: {
        borderColor: '#E0E0E0',
        backgroundColor: '#FAFAFA',
    },
    optionText: {
        fontSize: 18,
        fontWeight: '600',
    },
    selectedText: {
        color: '#6200ee',
    },
    unselectedText: {
        color: '#757575',
    },
});

export default YesNoQuestion;
