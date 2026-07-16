import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { loginAction } from '../../store/userActions';

// Assuming you are in app/(login)/loginPage.tsx
export default function LoginScreen() {
    const { isSignedIn, userName } = useSelector((state: RootState) => state.connectedUserData);
    const dispatch = useDispatch();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleGoToRegister = () => {
        router.push('/(login)/scan-qr');
    };
    // State to handle initial token check

    useEffect(() => {
        console.log('Checking token at rendering');
    }, []);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please enter both email and password.');
            console.log('Enter both');
            return;
        }

        console.log('Handle login');
        dispatch(loginAction(username));
        // Add a small delay to simulate network latency for better UX
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.replace('/(tabs)/active-forms');
    };

    // Show a loading spinner while we check the token

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.form}>
                <Text style={styles.title}>Welcome Back </Text>
                {/* Email Input */}
                <TextInput
                    style={styles.input}
                    placeholder='Username'
                    value={username}
                    onChangeText={setUsername}
                    keyboardType='default'
                    autoCapitalize='none'
                    placeholderTextColor='#999'
                />

                {/* Password Input */}
                <TextInput
                    style={styles.input}
                    placeholder='Password'
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor='#999'
                />

                {/* Error Message */}
                {/* <Text style={styles.errorMessage}>{wrongIdentifiers ? 'Wrong username and/or password' : ''}</Text> */}
                {/* Login Button */}
                <Pressable
                    style={({ pressed }) => [styles.button, { backgroundColor: '#007AFF' }]}
                    onPress={handleLogin}
                >
                    <Text style={styles.buttonText}>{'Sign In'}</Text>
                </Pressable>
                <TouchableOpacity style={styles.linkContainer} onPress={handleGoToRegister}>
                    <Text style={styles.linkText}>Pas encore de compte ? Inscription</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    errorMessage: {
        color: 'red',
        paddingHorizontal: 15,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 30,
        backgroundColor: '#f5f5f5',
    },
    image: {
        width: 250,
        height: 150,
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'gray',
        resizeMode: 'cover',
    },
    form: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: '#fafafa',
        color: '#333',
    },
    button: {
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    link: {
        marginTop: 20,
        padding: 10,
        alignSelf: 'center',
    },
    linkText: {
        color: '#007AFF',
        fontSize: 14,
    },
    linkContainer: { marginTop: 20, alignItems: 'center' },
});
