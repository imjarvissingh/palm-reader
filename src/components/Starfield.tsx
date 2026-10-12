import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { seededRandom } from '@/lib/random';

/** Decorative, deterministic star field. Hidden from screen readers. */
export function Starfield({ count = 60, seed = 7, height = 900 }: { count?: number; seed?: number; height?: number }) {
  const stars = useMemo(() => {
    const r = seededRandom(seed);
    return Array.from({ length: count }, () => ({
      x: r() * 100,
      y: r() * height,
      size: 0.4 + r() * 1.3,
      opacity: 0.25 + r() * 0.6,
    }));
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
