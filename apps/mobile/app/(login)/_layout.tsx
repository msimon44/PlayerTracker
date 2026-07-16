import { Stack } from 'expo-router';

export default function LoginLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false, // Cache le header (en haut)
            }}
        >
            <Stack.Screen
                name='login'
                options={{
                    headerShown: false,
                    title: 'Login',
                }}
            />
            <Stack.Screen
                name='register'
                options={{
                    title: 'Register',
                }}
            />
        </Stack>
    );
}
