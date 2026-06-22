import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';
import { TaskFilter } from '@/types/task';

const filterOptions: Array<{ label: string; value: TaskFilter }> = [
  { label: 'All', value: 'all' },
  { label: 'Completed', value: 'completed' },
  { label: 'Active', value: 'active' },
];

type FilterBarProps = {
  value: TaskFilter;
  onChange: (value: TaskFilter) => void;
};

export function FilterBar({ value, onChange }: FilterBarProps) {
  return (
    <View style={styles.container}>
      {filterOptions.map((option) => {
        const isSelected = option.value === value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            style={[styles.option, isSelected && styles.optionSelected]}
            onPress={() => onChange(option.value)}
          >
            <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    flexDirection: 'row',
    gap: spacing.xs,
    padding: spacing.xs,
  },
  option: {
    alignItems: 'center',
    borderRadius: radii.sm,
    flex: 1,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: spacing.sm,
  },
  optionSelected: {
    backgroundColor: colors.surface,
  },
  optionText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  optionTextSelected: {
    color: colors.primary,
  },
});
