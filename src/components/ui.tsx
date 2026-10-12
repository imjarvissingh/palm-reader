import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { getSign, SIGNS, type ZodiacId } from '@/features/horoscope/zodiac';
import { colors, radius, spacing, touchTarget } from '@/theme/tokens';
import { haptic } from './Button';
import { Text } from './Text';

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text variant="heading" accessibilityRole="header">
        {title}
      </Text>
      {action && onAction ? (
        <Pressable accessibilityRole="button" onPress={onAction} hitSlop={12} style={styles.sectionAction}>
          <Text variant="bodySmall" tone="accent">
            {action}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Eyebrow({ children }: { children: string }) {
  return (
    <Text variant="label" tone="gold">
      {children.toUpperCase()}
    </Text>
  );
}

export function IconCircle({ name, color = colors.accent, size = 44 }: { name: keyof typeof Ionicons.glyphMap; color?: string; size?: number }) {
  return (
    <View style={[styles.iconCircle, { width: size, height: size, borderRadius: size / 2 }]}>
      <Ionicons name={name} size={size * 0.5} color={color} />
    </View>
  );
}

export function ZodiacBadge({ signId, size = 56, selected }: { signId: ZodiacId; size?: number; selected?: boolean }) {
  const s = getSign(signId);
  return (
    <View
      style={[styles.badge, { width: size, height: size, borderRadius: size / 2 }, selected && styles.badgeSelected]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Text style={{ fontSize: size * 0.48, lineHeight: size * 0.62, color: selected ? colors.onAccent : colors.gold }}>{s.glyph}</Text>
    </View>
  );
}

/** Radio-style option row used by the palm questionnaire and pickers. */
export function OptionRow({
  label, hint, selected, onPress, testID,
}: { label: string; hint?: string; selected: boolean; onPress: () => void; testID?: string }) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={hint ? `${label}, ${hint}` : label}
      onPress={() => {
        haptic();
        onPress();
      }}
      style={({ pressed }) => [styles.option, selected && styles.optionSelected, pressed && styles.pressed]}
    >
      <View style={[styles.radio, selected && styles.radioOn]}>{selected ? <View style={styles.radioDot} /> : null}</View>
      <View style={styles.flex}>
        <Text variant="body">{label}</Text>
        {hint ? (
          <Text variant="caption" tone="muted">
            {hint}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

export function Chip({ label, selected, onPress, testID }: { label: string; selected?: boolean; onPress?: () => void; testID?: string }) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="tab"
      accessibilityState={{ selected: !!selected }}
      onPress={() => {
        haptic();
        onPress?.();
      }}
      style={[styles.chip, selected && styles.chipOn]}
    >
      <Text variant="bodySmall" tone={selected ? 'onAccent' : 'default'} style={{ fontWeight: '600' }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function Segmented<T extends string>({ items, value, onChange }: { items: { id: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <View style={styles.segmented} accessibilityRole="tablist">
      {items.map((it) => (
        <Pressable
          key={it.id}
          accessibilityRole="tab"
          accessibilityState={{ selected: it.id === value }}
          onPress={() => {
            haptic();
            onChange(it.id);
          }}
          style={[styles.segment, it.id === value && styles.segmentOn]}
        >
          <Text variant="bodySmall" tone={it.id === value ? 'onAccent' : 'muted'} style={{ fontWeight: '700' }}>
            {it.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

/** Horizontal score bar; value 0-100. */
export function ScoreBar({ label, value, color = colors.accent }: { label: string; value: number; color?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <View style={styles.scoreRow} accessible accessibilityLabel={`${label}: ${Math.round(v)} out of 100`}>
      <View style={styles.scoreHeader}>
        <Text variant="bodySmall" tone="muted">
          {label}
        </Text>
        <Text variant="bodySmall" style={{ fontWeight: '700' }}>
          {Math.round(v)}%
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${v}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

/** Five-dot rating; score 1-5. */
export function Dots({ score, label }: { score: number; label: string }) {
  return (
    <View style={styles.dots} accessible accessibilityLabel={`${label}: ${score} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <View key={i} style={[styles.dot, i <= score && styles.dotOn]} />
      ))}
    </View>
  );
}

export function Expandable({ title, subtitle, children, initiallyOpen, accent }: { title: string; subtitle?: string; children: React.ReactNode; initiallyOpen?: boolean; accent?: string }) {
  const [open, setOpen] = useState(!!initiallyOpen);
  return (
    <View style={styles.expandable}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
        onPress={() => setOpen((o) => !o)}
        style={styles.expandHeader}
      >
        {accent ? <View style={[styles.accentBar, { backgroundColor: accent }]} /> : null}
        <View style={styles.flex}>
          <Text variant="subheading">{title}</Text>
          {subtitle ? (
            <Text variant="bodySmall" tone="muted">
              {subtitle}
            </Text>
          ) : null}
        </View>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={20} color={colors.textMuted} />
      </Pressable>
      {open ? <View style={styles.expandBody}>{children}</View> : null}
    </View>
  );
}

export function EmptyState({ icon, title, body, action }: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string; action?: React.ReactNode }) {
  return (
    <View style={styles.empty}>
      <IconCircle name={icon} size={64} />
      <Text variant="heading" center>
        {title}
      </Text>
      <Text tone="muted" center>
        {body}
      </Text>
      {action}
    </View>
  );
}

export function Disclaimer({ style, compact }: { style?: ViewStyle; compact?: boolean }) {
  return (
    <View style={[styles.disclaimer, style]} accessibilityRole="text">
      <Ionicons name="sparkles-outline" size={16} color={colors.textSubtle} />
      <Text variant="caption" tone="subtle" style={{ flex: 1 }}>
        {compact
          ? 'For entertainment and self-reflection only.'
          : 'Palmistry and astrology are traditions for entertainment and self-reflection. They are not scientifically validated and are not medical, psychological, financial or legal advice.'}
      </Text>
    </View>
  );
}

export function SignGrid({ value, onChange, columns = 4 }: { value: ZodiacId | null; onChange: (id: ZodiacId) => void; columns?: number }) {
  return (
    <View style={styles.grid} accessibilityRole="radiogroup">
      {SIGNS.map((s) => {
        const selected = s.id === value;
        return (
          <Pressable
            key={s.id}
            testID={`sign-${s.id}`}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            accessibilityLabel={s.name}
            onPress={() => {
              haptic();
              onChange(s.id);
            }}
            style={[styles.gridItem, { width: `${100 / columns - 2}%` as `${number}%` }, selected && styles.gridItemOn]}
          >
            <ZodiacBadge signId={s.id} size={40} selected={selected} />
            <Text variant="caption" tone={selected ? 'gold' : 'muted'} numberOfLines={1}>
              {s.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Row({ children, style, gap = spacing.md }: { children: React.ReactNode; style?: ViewStyle; gap?: number }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap }, style]}>{children}</View>;
}

export function ListRow({
  icon, title, subtitle, onPress, right, testID, danger,
}: {
  icon?: keyof typeof Ionicons.glyphMap; title: string; subtitle?: string; onPress?: () => void; right?: React.ReactNode; testID?: string; danger?: boolean;
}) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.listRow, pressed && styles.pressed]}
    >
      {icon ? <Ionicons name={icon} size={22} color={danger ? colors.danger : colors.accent} /> : null}
      <View style={styles.flex}>
        <Text tone={danger ? 'danger' : 'default'}>{title}</Text>
        {subtitle ? (
          <Text variant="caption" tone="muted">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ?? (onPress ? <Ionicons name="chevron-forward" size={18} color={colors.textSubtle} /> : null)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  pressed: { opacity: 0.8 },
  sectionHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: spacing.sm },
  sectionAction: { minHeight: 32, justifyContent: 'center' },
  iconCircle: { backgroundColor: 'rgba(201,168,255,0.14)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  badge: { alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(232,199,122,0.1)', borderWidth: 1, borderColor: 'rgba(232,199,122,0.4)' },
  badgeSelected: { backgroundColor: colors.gold, borderColor: colors.gold },
  option: {
    minHeight: touchTarget + 8, flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
  },
  optionSelected: { borderColor: colors.accent, backgroundColor: 'rgba(201,168,255,0.16)' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.textSubtle, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: colors.accent },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accent },
  chip: { minHeight: 40, paddingHorizontal: spacing.lg, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', backgroundColor: colors.surface },
  chipOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  segmented: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.pill, padding: 4, borderWidth: 1, borderColor: colors.border },
  segment: { flex: 1, minHeight: 40, alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill },
  segmentOn: { backgroundColor: colors.accent },
  scoreRow: { gap: 6 },
  scoreHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  track: { height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  fill: { height: 8, borderRadius: 4 },
  dots: { flexDirection: 'row', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.15)' },
  dotOn: { backgroundColor: colors.gold },
  expandable: { borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bgElevated, overflow: 'hidden' },
  expandHeader: { minHeight: touchTarget + 12, flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  accentBar: { width: 4, alignSelf: 'stretch', borderRadius: 2 },
  expandBody: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, gap: spacing.sm },
  empty: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xxxl, paddingHorizontal: spacing.lg },
  disclaimer: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start', padding: spacing.md, borderRadius: radius.md, backgroundColor: 'rgba(255,255,255,0.04)' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'space-between' },
  gridItem: { alignItems: 'center', gap: 4, paddingVertical: spacing.sm, borderRadius: radius.md, borderWidth: 1, borderColor: 'transparent', minHeight: touchTarget },
  gridItemOn: { borderColor: colors.gold, backgroundColor: 'rgba(232,199,122,0.08)' },
  listRow: { minHeight: touchTarget + 8, flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
});
