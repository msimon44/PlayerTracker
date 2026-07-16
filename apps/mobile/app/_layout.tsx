import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { globalStore } from '../store/store';

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: '(login)',
};

export default function RootLayout() {
    return (
        <Provider store={globalStore}>
            <ThemeProvider value={DefaultTheme}>
                <Stack>
                    <Stack.Screen
                        name='(login)'
                        options={{
                            headerShown: false, // <--- C'est cette ligne qui enlève le bandeau "Login" ou "Register"
                        }}
                    />
                    <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
                    <Stack.Screen name='modal' options={{ presentation: 'modal', title: 'Modal' }} />
                </Stack>
                <StatusBar style='auto' />
            </ThemeProvider>
        </Provider>
    );
}
