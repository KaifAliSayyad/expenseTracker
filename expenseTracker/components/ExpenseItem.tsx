import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useExpenses } from '@/context/ExpenseContext';
import type { Expense } from '@/context/ExpenseContext';

type ExpenseItemProps = {
  expense: Expense;
};

export function ExpenseItem({ expense }: ExpenseItemProps) {
  const colorScheme = useColorScheme();
  const { deleteExpense } = useExpenses();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const handleDelete = async () => {
    try {
      Alert.alert(
        'Delete Expense',
        'Are you sure you want to delete this expense?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              await deleteExpense(expense.id);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to delete expense');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.leftContent}>
        <MaterialIcons 
          name="category" 
          size={24} 
          color={Colors[colorScheme ?? 'light'].text} 
        />
        <View style={styles.details}>
          <ThemedText style={styles.category}>{expense.category}</ThemedText>
          <ThemedText style={styles.description}>{expense.description}</ThemedText>
          <ThemedText style={styles.date}>{formatDate(expense.date)}</ThemedText>
        </View>
      </View>
      <View style={styles.rightContent}>
        <ThemedText style={styles.amount}>
          ${expense.amount.toFixed(2)}
        </ThemedText>
        <TouchableOpacity 
          onPress={handleDelete}
          style={styles.deleteButton}
        >
          <MaterialIcons name="delete" size={20} color={Colors.light.tint} />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  details: {
    marginLeft: 12,
    flex: 1,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 4,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  deleteButton: {
    padding: 4,
  },
});