import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Define the interface for the component's props
interface FormLinkCardProps {
    id: string | number;
    title: string;
    date: string;
    iconUrl: string;
    onPress: (id: string | number) => void;
    isArchived: boolean;
}

const FormLinkCard: React.FC<FormLinkCardProps> = ({ id, title, date, iconUrl, onPress, isArchived }) => {
    return (
        <TouchableOpacity
            style={isArchived ? styles.cardContainerArchived : styles.cardContainer}
            onPress={() => onPress(id)}
            activeOpacity={0.8}
        >
            <View style={styles.contentContainer}>
                {/* Left Section: Avatar and Text */}
                <View style={styles.leftSection}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>A</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.date}>{date}</Text>
                    </View>
                </View>

                {/* Right Section: Icon Image */}
                <View style={styles.rightSection}>
                    <Image source={{ uri: iconUrl }} style={styles.iconImage} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        margin: 2,
        borderRadius: 16,
        backgroundColor: '#F9F3F9', // Light background color from the image
        borderWidth: 1,
        borderColor: '#E8DEE8', // Subtle border color
        overflow: 'hidden', // Ensure the right section doesn't overflow the rounded corners
    },
    cardContainerArchived: {
        margin: 2,
        borderRadius: 16,
        backgroundColor: '#A1A1A1', // Light background color from the image
        borderWidth: 1,
        borderColor: '#E8DEE8', // Subtle border color
        overflow: 'hidden',
    },
    contentContainer: {
        flexDirection: 'row',
        height: 80, // Fixed height for consistency
    },
    leftSection: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#EADDFF', // Lighter purple for avatar background
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#6750A4', // Darker purple for avatar text
    },
    textContainer: {
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1B1F', // Dark text for title
        marginBottom: 4,
    },
    date: {
        fontSize: 12,
        color: '#49454F', // Medium gray for date
    },
    rightSection: {
        width: 80, // Fixed width for the icon section
        backgroundColor: '#E8DEF8', // Slightly darker background for the right section
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconImage: {
        width: 80,
        height: 80,
        // resizeMode: 'contain',
        // In a real scenario, you might want to tint the icon if it's a simple shape
        // tintColor: '#CAC4D0',
    },
});

export default FormLinkCard;
