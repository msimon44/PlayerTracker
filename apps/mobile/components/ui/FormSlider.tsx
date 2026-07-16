import Slider from '@react-native-community/slider';
import React, { useCallback, useState } from 'react';
import { LayoutChangeEvent, Platform, StyleSheet, Text, View } from 'react-native';

interface FormSliderProps {
    value: number;
    min?: number;
    max?: number;
    step?: number;
    onValueChange: (value: number) => void;
    primaryColor?: string;
    trackColor?: string;
}

const BUBBLE_SIZE = 52;
const THUMB_SIZE = 20;

export const FormSlider: React.FC<FormSliderProps> = ({
    value,
    min = 1,
    max = 100,
    step = 1,
    onValueChange,
    primaryColor = '#5B21B6',
    trackColor = '#E2E2E2',
}) => {
    const [trackWidth, setTrackWidth] = useState(0);

    // On iOS the slider has ~14px padding on each side
    const SLIDER_PADDING = Platform.OS === 'ios' ? 14 : THUMB_SIZE / 2;

    const progress = (value - min) / (max - min);
    const bubbleCenter = SLIDER_PADDING + progress * (trackWidth - SLIDER_PADDING * 2);
    const bubbleLeft = bubbleCenter - BUBBLE_SIZE / 2;

    const handleLayout = useCallback((e: LayoutChangeEvent) => {
        setTrackWidth(e.nativeEvent.layout.width);
    }, []);

    return (
        <View style={styles.container}>
            {/* Value bubble */}
            <View style={styles.bubbleRow} onLayout={handleLayout}>
                {trackWidth > 0 && (
                    <View
                        style={[
                            styles.bubble,
                            {
                                left: bubbleLeft,
                                borderColor: primaryColor,
                                backgroundColor: hexToRgba(primaryColor, 0.08),
                            },
                        ]}
                    >
                        <Text style={[styles.bubbleText, { color: primaryColor }]}>{value}</Text>
                    </View>
                )}
            </View>

            {/* Min / Max labels */}
            <View style={styles.rangeRow}>
                <Text style={styles.rangeLabel}>{min}</Text>
                <Text style={styles.rangeLabel}>{max}</Text>
            </View>

            {/* Slider */}
            <Slider
                style={styles.slider}
                minimumValue={min}
                maximumValue={max}
                step={step}
                value={value}
                onValueChange={onValueChange}
                minimumTrackTintColor={trackColor}
                maximumTrackTintColor={trackColor}
                thumbTintColor={primaryColor}
            />

            <Text style={styles.hint}>Slide to select a value</Text>
        </View>
    );
};

// Utility — converts hex color to rgba for the bubble background
function hexToRgba(hex: string, alpha: number): string {
    const sanitized = hex.replace('#', '');
    const bigint = parseInt(
        sanitized.length === 3
            ? sanitized
                  .split('')
                  .map((c) => c + c)
                  .join('')
            : sanitized,
        16,
    );
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111',
        marginBottom: 24,
    },
    bubbleRow: {
        height: BUBBLE_SIZE,
        position: 'relative',
        marginBottom: 8,
    },
    bubble: {
        position: 'absolute',
        width: BUBBLE_SIZE,
        height: BUBBLE_SIZE,
        borderRadius: BUBBLE_SIZE / 2,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bubbleText: {
        fontSize: 17,
        fontWeight: '600',
    },
    rangeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 2,
        marginBottom: 2,
    },
    rangeLabel: {
        fontSize: 12,
        color: '#888',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    hint: {
        textAlign: 'center',
        fontSize: 13,
        color: '#AAAAAA',
        marginTop: 4,
    },
});
