import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import NoteQuestion from './NoteQuestion';
import ScaleQuestion from './ScaleQuestion';
import SelectQuestion from './SelectQuestion';
import TextQuestion from './TextQuestion';
import YesNoQuestion from './YesNoQuestion';

// --- Types ---

export type QuestionType = 'NoteQuestion' | 'YesNoQuestion' | 'TextQuestion' | 'SelectQuestion' | 'ScaleQuestion';

interface FormQuestionProps {
    type: QuestionType;
    data: any;
    handleAnswerChange: (value: any) => void;
}

// --- Component ---

const FormQuestion: React.FC<FormQuestionProps> = ({ type, data, handleAnswerChange }) => {
    const renderQuestionComponent = () => {
        switch (type) {
            case 'NoteQuestion':
                return <NoteQuestion data={data} onAnswerChange={handleAnswerChange} />;
            case 'YesNoQuestion':
                return <YesNoQuestion data={data} onAnswerChange={handleAnswerChange} />;
            case 'TextQuestion':
                return <TextQuestion data={data} onAnswerChange={handleAnswerChange} />;
            case 'SelectQuestion':
                return <SelectQuestion data={data} onAnswerChange={handleAnswerChange} />;
            case 'ScaleQuestion':
                return <ScaleQuestion data={data} onAnswerChange={handleAnswerChange} />;
            default:
                return (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>Unsupported question type: {type}</Text>
                    </View>
                );
        }
    };

    return <View style={styles.container}>{renderQuestionComponent()}</View>;
};

// --- Styles ---

const styles = StyleSheet.create({
    container: {
        padding: 16,
        width: '100%',
    },
    errorContainer: {
        padding: 20,
        backgroundColor: '#FFEBEE',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FFCDD2',
    },
    errorText: {
        color: '#B71C1C',
        textAlign: 'center',
    },
});

export default FormQuestion;
