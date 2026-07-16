import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FormQuestion, { QuestionType } from '../../components/form/FormQuestion';

// --- Types ---

// Input prop structure
export interface InputQuestionData {
    question: string;
    type: QuestionType;
    [key: string]: any; // Allow extra properties for specific question types (options, etc.)
}

// Output structure as requested
export interface AnsweredQuestion extends InputQuestionData {
    answer: any;
}

// interface FormProps {
//     questions: InputQuestionData[];
//     onFinish: (answers: AnsweredQuestion[]) => void;
//     onExit?: () => void;
// }

// --- Component ---

export default function Form() {
    const questionsParam = useLocalSearchParams().questions;
    const questions: InputQuestionData[] = questionsParam ? JSON.parse(questionsParam as string) : null;
    // const navigation = useNavigation();
    const router = useRouter();

    const onFinish = (answers: AnsweredQuestion[]) => {
        console.log(answers);
        // send/store answers to API somewhere
        alert(JSON.stringify(answers, null, 4));
        router.navigate('/(tabs)/active-forms');
    };

    const onExit = () => {
        console.log('EXIT');
        router.navigate('/(tabs)/active-forms');
    };

    const [currentIndex, setCurrentIndex] = useState(0);

    // Initialize answers state with the structure of questions + empty answer field
    const [answers, setAnswers] = useState<AnsweredQuestion[]>(questions.map((q) => ({ ...q, answer: null })));

    const currentQuestion = answers[currentIndex];
    const isLastQuestion = currentIndex === questions.length - 1;
    const isFirstQuestion = currentIndex === 0;

    // Update the specific answer for the current index
    const handleAnswerChange = (value: any) => {
        const updatedAnswers = [...answers];
        updatedAnswers[currentIndex] = {
            ...updatedAnswers[currentIndex],
            answer: value,
        };
        setAnswers(updatedAnswers);
    };

    const handleNext = () => {
        if (isLastQuestion) {
            onFinish(answers);
        } else {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (isFirstQuestion) {
            if (onExit) onExit();
        } else {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    if (!currentQuestion) {
        return (
            <View style={styles.center}>
                <Text>No questions available.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Progress Header */}
            <View style={styles.header}>
                <Text style={styles.progressText}>
                    Question {currentIndex + 1} / {questions.length}
                </Text>
                <View style={styles.progressBarBackground}>
                    <View
                        style={[styles.progressBarFill, { width: `${((currentIndex + 1) / questions.length) * 100}%` }]}
                    />
                </View>
            </View>

            {/* Question Content Area */}
            <View style={styles.content}>
                <Text style={styles.questionLabel}>{currentQuestion.question}</Text>

                <FormQuestion
                    type={currentQuestion.type}
                    data={currentQuestion}
                    handleAnswerChange={handleAnswerChange}
                />
            </View>

            {/* Navigation Footer */}
            <View style={styles.footer}>
                <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handlePrevious}>
                    <Text style={styles.secondaryButtonText}>{isFirstQuestion ? 'Exit' : 'Back'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleNext}>
                    <Text style={styles.primaryButtonText}>{isLastQuestion ? 'Finish' : 'Next'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// --- Styles ---

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    progressText: {
        marginBottom: 8,
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
    },
    progressBarBackground: {
        height: 6,
        backgroundColor: '#eee',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#6200ee',
    },
    content: {
        flex: 1,
        padding: 16,
        justifyContent: 'center', // Centers the question vertically
    },
    questionLabel: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#333',
    },
    footer: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        justifyContent: 'space-between',
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: '#6200ee',
    },
    secondaryButton: {
        backgroundColor: '#f5f5f5',
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
    },
});
