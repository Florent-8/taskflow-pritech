import { StyleSheet, TextInput, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';

type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export function SearchBar({ value, onChangeText }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        placeholder="Search by title"
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: spacing.lg,
  },
  input: {
    color: colors.text,
    fontSize: typography.body,
    paddingVertical: spacing.sm,
  },
});
