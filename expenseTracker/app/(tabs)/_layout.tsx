import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import TabBarBackground from '@/components/ui/TabBarBackground';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarStyle: {
          ...Platform.select({
            ios: {
              backgroundColor: 'transparent',
              height: 90,
              paddingBottom: 20,
            },
            android: {
              backgroundColor: Colors[colorScheme ?? 'light'].background,
              height: 70,
              paddingBottom: 10,
              elevation: 8,
            },
            default: {
              backgroundColor: Colors[colorScheme ?? 'light'].background,
              height: 70,
              paddingBottom: 10,
            },
          }),
        },
        tabBarBackground: Platform.OS === 'ios' ? TabBarBackground : undefined,
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
        headerTintColor: Colors[colorScheme ?? 'light'].text,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'SpendWise',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="receipt-long" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="add-circle" size={size} color={color} />
          ),
          tabBarStyle: {
            ...Platform.select({
              ios: {
                backgroundColor: 'transparent',
              },
              android: {
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                elevation: 8,
              },
              default: {
                backgroundColor: Colors[colorScheme ?? 'light'].background,
              },
            }),
          },
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="insert-chart" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
