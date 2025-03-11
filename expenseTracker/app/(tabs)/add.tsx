import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useExpenses } from '@/context/ExpenseContext';

const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'];

export default function AddExpenseScreen() {
  const colorScheme = useColorScheme();
  const { addExpense } = useExpenses();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSubmit = async () => {
    if (!amount || !description || !selectedCategory) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      await addExpense({
        amount: numAmount,
        description,
        category: selectedCategory,
        date: new Date(),
      });
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Expense added successfully', [
        { text: 'OK', onPress: () => router.push('/(tabs)/expenses') }
      ]);
      
      // Reset form
      setAmount('');
      setDescription('');
      setSelectedCategory('');
    } catch (error) {
      Alert.alert('Error', 'Failed to add expense');
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Add New Expense</ThemedText>
        
        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Amount ($)</ThemedText>
          <TextInput
            style={[
              styles.input,
              { color: Colors[colorScheme ?? 'light'].text }
            ]}
            placeholder="0.00"
            placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Description</ThemedText>
          <TextInput
            style={[
              styles.input,
              { color: Colors[colorScheme ?? 'light'].text }
            ]}
            placeholder="Enter description"
            placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
            value={description}
            onChangeText={setDescription}
          />
        </ThemedView>

        <ThemedView style={styles.categoriesContainer}>
          <ThemedText style={styles.label}>Category</ThemedText>
          <ThemedView style={styles.categoryGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.selectedCategory,
                ]}
                onPress={() => {
                  setSelectedCategory(category);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <ThemedText
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.selectedCategoryText,
                  ]}
                >
                  {category}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </ThemedView>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <MaterialIcons name="add" size={24} color="white" />
          <ThemedText style={styles.submitButtonText}>Add Expense</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  categoryText: {
    fontSize: 14,
  },
  selectedCategoryText: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: Colors.light.tint,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});