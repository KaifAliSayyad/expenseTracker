import { StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useExpenses } from '@/context/ExpenseContext';

export default function HomeScreen() {
  const { state } = useExpenses();
  const colorScheme = useColorScheme();

  const totalExpenses = state.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const recentExpenses = state.expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[
        styles.totalContainer,
        { backgroundColor: Colors[colorScheme ?? 'light'].tint }
      ]}>
        <ThemedText style={styles.totalLabel}>Total Expenses</ThemedText>
        <ThemedText style={styles.totalAmount}>${totalExpenses.toFixed(2)}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.recentHeaderContainer}>
        <ThemedText style={styles.recentTitle}>Recent Expenses</ThemedText>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/(tabs)/add')}
        >
          <MaterialIcons name="add" size={24} color={Colors[colorScheme ?? 'light'].tint} />
          <ThemedText style={styles.addButtonText}>Add Expense</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.recentContainer}>
        {recentExpenses.length > 0 ? (
          recentExpenses.map((expense) => (
            <ThemedView key={expense.id} style={styles.recentItem}>
              <ThemedView style={styles.recentItemLeft}>
                <ThemedText style={styles.recentItemCategory}>{expense.category}</ThemedText>
                <ThemedText style={styles.recentItemDescription}>{expense.description}</ThemedText>
              </ThemedView>
              <ThemedText style={styles.recentItemAmount}>
                ${expense.amount.toFixed(2)}
              </ThemedText>
            </ThemedView>
          ))
        ) : (
          <ThemedText style={styles.noExpensesText}>
            No expenses yet. Add your first expense!
          </ThemedText>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  totalContainer: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    minHeight: 120, // Add minimum height
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  totalLabel: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
    marginBottom: 8, // Add margin bottom to create space
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 44, // Add line height to prevent text overlap
  },
  recentHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  recentContainer: {
    flex: 1,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  recentItemLeft: {
    flex: 1,
  },
  recentItemCategory: {
    fontSize: 16,
    fontWeight: '500',
  },
  recentItemDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  recentItemAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  noExpensesText: {
    textAlign: 'center',
    opacity: 0.5,
    marginTop: 32,
  },
});
