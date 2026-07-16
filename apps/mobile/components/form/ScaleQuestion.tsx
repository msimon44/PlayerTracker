import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { FormSlider } from '../ui/FormSlider';

interface ScaleQuestionProps {
    data: any;
    onAnswerChange: (value: number) => void;
}

const ScaleQuestion: React.FC<ScaleQuestionProps> = ({ data, onAnswerChange }) => {
    const [value, setValue] = useState(50); // Default to middle

    const handleValueChange = (val: number) => {
        setValue(val);
        onAnswerChange(val);
    };

    return (
        <View style={styles.container}>
            <View style={styles.sliderContainer}>
                <FormSlider
                    min={1}
                    max={100}
                    step={1}
                    value={value}
                    onValueChange={handleValueChange}
                    primaryColor='#6200ee'
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
    },
    valueDisplay: {
        marginBottom: 30,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F3E5F5',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#6200ee',
    },
    valueText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#6200ee',
    },
    sliderContainer: {
        width: '100%',
        paddingHorizontal: 10,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    labels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginBottom: 5,
    },
    labelText: {
        color: '#757575',
        fontWeight: 'bold',
    },
    helperText: {
        marginTop: 15,
        color: '#999',
        fontSize: 14,
    },
});

export default ScaleQuestion;
