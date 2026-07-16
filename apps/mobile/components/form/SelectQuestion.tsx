import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SelectQuestionProps {
    data: {
        options: string[];
        [key: string]: any;
    };
    onAnswerChange: (value: string) => void;
}

const SelectQuestion: React.FC<SelectQuestionProps> = ({ data, onAnswerChange }) => {
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (option: string) => {
        setSelected(option);
        onAnswerChange(option);
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {data.options &&
                data.options.map((option, index) => {
                    const isSelected = selected === option;
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[styles.optionItem, isSelected ? styles.selectedItem : styles.unselectedItem]}
                            onPress={() => handleSelect(option)}
                            activeOpacity={0.7}
                        >
                            <View
                                style={[styles.radioCircle, isSelected ? styles.radioSelected : styles.radioUnselected]}
                            >
                                {isSelected && <View style={styles.radioInner} />}
                            </View>
                            <Text style={[styles.optionText, isSelected ? styles.selectedText : styles.unselectedText]}>
                                {option}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 10,
        maxHeight: 400, // Limit height if many options
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        borderWidth: 2,
    },
    unselectedItem: {
        borderColor: '#E0E0E0',
        backgroundColor: '#FAFAFA',
    },
    selectedItem: {
        borderColor: '#6200ee',
        backgroundColor: '#F3E5F5',
    },
    radioCircle: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    radioUnselected: {
        borderColor: '#999',
    },
    radioSelected: {
        borderColor: '#6200ee',
    },
    radioInner: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#6200ee',
    },
    optionText: {
        fontSize: 16,
        fontWeight: '500',
    },
    unselectedText: {
        color: '#333',
    },
    selectedText: {
        color: '#6200ee',
        fontWeight: 'bold',
    },
});

export default SelectQuestion;
