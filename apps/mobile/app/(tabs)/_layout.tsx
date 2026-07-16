import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors['light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
            }}
        >
            <Tabs.Screen
                name='form'
                options={{
                    title: 'Current form',
                    headerShown: false,
                    // This removes the button from the bottom navbar
                    href: null,
                }}
            />
            {/* <Tabs.Screen
                name='index'
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name='home' color='black' />,
                }}
            /> */}
            <Tabs.Screen
                name='active-forms'
                options={{
                    title: 'Active',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name='inbox' color='black' />,
                }}
            />
            <Tabs.Screen
                name='forms-archive'
                options={{
                    title: 'Archive',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name='archive' color='black' />,
                }}
            />
            <Tabs.Screen
                name='userpage'
                options={{
                    title: 'You',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name='person' color='black' />,
                }}
            />
        </Tabs>
    );
}
