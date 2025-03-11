import { StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ExpenseItem } from '@/components/ExpenseItem';
import { useExpenses } from '@/context/ExpenseContext';
import { Colors } from '@/constants/Colors';

export default function ExpensesScreen() {
  const { state, loadExpenses } = useExpenses();

  useEffect(() => {
    loadExpenses();
  }, []);

  if (state.loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </ThemedView>
    );
  }

  if (state.error) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.error}>{state.error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={state.expenses}
        renderItem={({ item }) => <ExpenseItem expense={item} />}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <ThemedText style={styles.title}>Recent Expenses</ThemedText>
        }
        ListEmptyComponent={
          <ThemedText style={styles.emptyText}>
            No expenses yet. Add some from the Add tab!
          </ThemedText>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.5,
    marginTop: 32,
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});