import { useState } from 'react';
import { StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useExpenses } from '@/context/ExpenseContext';
import { useColorScheme } from '@/hooks/useColorScheme';

const screenWidth = Dimensions.get('window').width;

export default function StatisticsScreen() {
  const { state } = useExpenses();
  const colorScheme = useColorScheme();
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const periods = [
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'year', label: 'Year' },
  ];

  const chartConfig = {
    backgroundColor: Colors[colorScheme ?? 'light'].background,
    backgroundGradientFrom: Colors[colorScheme ?? 'light'].background,
    backgroundGradientTo: Colors[colorScheme ?? 'light'].background,
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(10, 132, 255, ${opacity})`,
    labelColor: (opacity = 1) => Colors[colorScheme ?? 'light'].text,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: Colors[colorScheme ?? 'light'].tint
    }
  };

  // Calculate statistics based on selected period
  const calculateStats = () => {
    if (!state.expenses.length) return null;

    const now = new Date();
    const filteredExpenses = state.expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      if (selectedPeriod === 'week') {
        return now.getTime() - expenseDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
      } else if (selectedPeriod === 'month') {
        return now.getMonth() === expenseDate.getMonth() && 
               now.getFullYear() === expenseDate.getFullYear();
      } else {
        return now.getFullYear() === expenseDate.getFullYear();
      }
    });

    const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const categoryData = filteredExpenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

    return { totalAmount, categoryData };
  };

  const stats = calculateStats();

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.periodSelector}>
        {periods.map(period => (
          <TouchableOpacity
            key={period.id}
            style={[
              styles.periodButton,
              selectedPeriod === period.id && styles.selectedPeriod
            ]}
            onPress={() => setSelectedPeriod(period.id)}
          >
            <ThemedText style={[
              styles.periodText,
              selectedPeriod === period.id && styles.selectedPeriodText
            ]}>
              {period.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>

      {stats ? (
        <>
          <ThemedView style={styles.summaryCard}>
            <ThemedText style={styles.summaryTitle}>
              Total Expenses ({selectedPeriod})
            </ThemedText>
            <ThemedText style={styles.summaryAmount}>
              ${stats.totalAmount.toFixed(2)}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.chartContainer}>
            <ThemedText style={styles.chartTitle}>Expenses by Category</ThemedText>
            <PieChart
              data={Object.entries(stats.categoryData).map(([name, value]) => ({
                name,
                value: value as number,
                color: `hsl(${Math.random() * 360}, 70%, 50%)`,
                legendFontColor: Colors[colorScheme ?? 'light'].text,
              }))}
              width={screenWidth - 32}
              height={220}
              chartConfig={chartConfig}
              accessor="value"
              backgroundColor="transparent"
              paddingLeft="15"
            />
          </ThemedView>
        </>
      ) : (
        <ThemedView style={styles.noDataContainer}>
          <ThemedText style={styles.noDataText}>
            No expense data available for the selected period
          </ThemedText>
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  periodSelector: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-around',
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  selectedPeriod: {
    backgroundColor: Colors.light.tint,
  },
  periodText: {
    fontSize: 16,
  },
  selectedPeriodText: {
    color: 'white',
  },
  summaryCard: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(10, 132, 255, 0.1)',
  },
  summaryTitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
  },
  chartContainer: {
    padding: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  }
});