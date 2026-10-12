import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { seededRandom } from '@/lib/random';

/** Decorative, deterministic star field. Hidden from screen readers. */
export function Starfield({ count = 45, seed = 7, height = 900 }: { count?: number; seed?: number; height?: number }) {
  const stars = useMemo(() => {
    const r = seededRandom(seed);
    // Stars sit in the top band and along the side margins so they never
    // land between letters of body text.
    return Array.from({ length: count }, (_, i) => {
      const inTopBand = i % 3 === 0;
      const side = r() < 0.5 ? r() * 4 : 96 + r() * 4;
      return {
        x: inTopBand ? r() * 100 : side,
        y: inTopBand ? r() * 36 : r() * height,
        size: 0.4 + r() * 1.1,
        opacity: 0.2 + r() * 0.5,
      };
    });
  }, [count, seed, height]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Svg width="100%" height={height}>
        {stars.map((s, i) => (
          <Circle key={i} cx={`${s.x}%`} cy={s.y} r={s.size} fill="#FFFFFF" opacity={s.opacity} />
        ))}
      </Svg>
    </View>
  );
}
