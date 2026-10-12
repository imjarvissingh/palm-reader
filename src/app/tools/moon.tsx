import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Eyebrow, Row } from '@/components/ui';
import { getMonthCalendar, getMoonPhase, nextPhaseDate } from '@/features/astro/moon';
import { formatLongDate, MONTH_NAMES } from '@/lib/date';
import { colors, radius } from '@/theme/tokens';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function MoonCalendar() {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() + 1 });
  const [selected, setSelected] = useState(today.getDate());
  const days = useMemo(() => getMonthCalendar(cursor.year, cursor.month), [cursor]);
  const lead = (new Date(cursor.year, cursor.month - 1, 1).getDay() + 6) % 7; // Monday first
  const sel = days.find((d) => d.day === selected) ?? days[0]!;
  const isCurrentMonth = cursor.year === today.getFullYear() && cursor.month === today.getMonth() + 1;
  const nowPhase = getMoonPhase(today);

  const shift = (delta: number) => {
    const d = new Date(cursor.year, cursor.month - 1 + delta, 1);
    setCursor({ year: d.getFullYear(), month: d.getMonth() + 1 });
    setSelected(1);
  };

  return (
    <Screen edgeTop={false} testID="moon">
      <Card glow>
        <Eyebrow>Tonight</Eyebrow>
        <Row>
          <Text style={{ fontSize: 48, lineHeight: 56 }}>{nowPhase.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text variant="heading">{nowPhase.name}</Text>
            <Text variant="caption" tone="muted">
              {Math.round(nowPhase.illumination * 100)}% lit · {nowPhase.waxing ? 'waxing' : 'waning'}
            </Text>
          </View>
        </Row>
        <Text variant="bodySmall" tone="muted">
          Next full moon: {formatLongDate(nextPhaseDate(today, 'full'))} · Next new moon: {formatLongDate(nextPhaseDate(today, 'new'))}
        </Text>
      </Card>

      <Row style={{ justifyContent: 'space-between' }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Previous month" onPress={() => shift(-1)} style={styles.nav}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <Text variant="heading">
          {MONTH_NAMES[cursor.month - 1]} {cursor.year}
        </Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Next month" onPress={() => shift(1)} style={styles.nav}>
          <Ionicons name="chevron-forward" size={22} color={colors.text} />
        </Pressable>
      </Row>

      <View style={styles.grid}>
        {WEEKDAYS.map((w, i) => (
          <View key={`w${i}`} style={styles.cell}>
            <Text variant="caption" tone="subtle">
              {w}
            </Text>
          </View>
        ))}
        {Array.from({ length: lead }, (_, i) => (
          <View key={`b${i}`} style={styles.cell} />
        ))}
        {days.map((d) => {
          const isToday = isCurrentMonth && d.day === today.getDate();
          const isSel = d.day === selected;
          return (
            <Pressable
              key={d.day}
              accessibilityRole="button"
              accessibilityLabel={`${MONTH_NAMES[cursor.month - 1]} ${d.day}: ${d.phase.name}`}
              accessibilityState={{ selected: isSel }}
              onPress={() => setSelected(d.day)}
              style={[styles.cell, styles.day, isSel && styles.daySel, isToday && styles.dayToday]}
            >
              <Text style={{ fontSize: 18, lineHeight: 22 }}>{d.phase.emoji}</Text>
              <Text variant="caption" tone={isSel ? 'gold' : 'muted'}>
                {d.day}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Card>
        <Eyebrow>{`${MONTH_NAMES[cursor.month - 1]} ${sel.day}`}</Eyebrow>
        <Text variant="heading">{sel.phase.name}</Text>
        <Text variant="caption" tone="muted">
          {Math.round(sel.phase.illumination * 100)}% illuminated · moon age {sel.phase.age.toFixed(1)} days
        </Text>
        <Text variant="bodySmall">{sel.phase.guidance}</Text>
      </Card>
      <Text variant="caption" tone="subtle">
        Phases are calculated from the average lunar cycle and can differ from an almanac by up to a day.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  nav: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, alignItems: 'center', justifyContent: 'center', paddingVertical: 4 },
  day: { minHeight: 52, borderRadius: radius.md, borderWidth: 1, borderColor: 'transparent' },
  daySel: { borderColor: colors.gold, backgroundColor: 'rgba(232,199,122,0.08)' },
  dayToday: { backgroundColor: 'rgba(201,168,255,0.14)' },
});
