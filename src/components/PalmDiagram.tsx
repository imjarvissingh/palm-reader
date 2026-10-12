import React from 'react';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';
import type { LineId } from '@/features/palm/types';
import { colors } from '@/theme/tokens';

/** Original stylised right hand, palm facing the viewer. viewBox 0 0 200 260. */
export const HAND_PATH =
  'M60 252 C50 235 45 215 42 195 C30 180 15 160 10 135 C7 122 18 115 27 122 C38 132 46 148 52 152 ' +
  'L55 110 L55 45 C55 33 78 33 78 45 L79 105 L82 104 L82 32 C82 18 106 18 106 32 L107 104 ' +
  'L110 104 L110 40 C110 28 133 28 133 40 L134 108 L137 110 L138 64 C138 54 158 54 158 64 ' +
  'L160 120 C166 160 166 210 155 252 Z';

export const LINE_PATHS: Record<LineId, string[]> = {
  life: ['M57 128 C75 150 72 200 82 238'],
  head: ['M57 131 C85 140 115 150 142 168'],
  heart: ['M163 142 C140 129 110 119 86 117'],
  fate: ['M108 244 C106 200 102 150 100 114'],
  success: ['M131 205 C129 170 126 140 123 116'],
  marriage: ['M163 125 L150 126', 'M163 131 L152 132'],
  travel: ['M161 214 L145 211', 'M162 225 L148 222'],
};

const LABEL_POS: Record<LineId, [number, number]> = {
  life: [62, 200], head: [118, 146], heart: [128, 112], fate: [104, 185],
  success: [134, 182], marriage: [168, 122], travel: [166, 236],
};

interface Props {
  size?: number;
  highlight?: LineId | null;
  /** Which lines to draw; defaults to all. */
  lines?: LineId[];
  showLabels?: boolean;
  /** Mirror for a left hand. */
  mirrored?: boolean;
  outlineOpacity?: number;
}

export function PalmDiagram({ size = 200, highlight = null, lines, showLabels, mirrored, outlineOpacity = 0.9 }: Props) {
  const ids = lines ?? (Object.keys(LINE_PATHS) as LineId[]);
  return (
    <Svg width={size} height={size * 1.3} viewBox="0 0 200 260" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <G transform={mirrored ? 'translate(200,0) scale(-1,1)' : undefined}>
        <Path d={HAND_PATH} fill="rgba(201,168,255,0.08)" stroke={colors.accent} strokeOpacity={outlineOpacity} strokeWidth={1.6} />
        {ids.map((id) =>
          LINE_PATHS[id].map((d, i) => (
            <Path
              key={`${id}-${i}`}
              d={d}
              fill="none"
              stroke={colors.line[id]}
              strokeWidth={highlight === id ? 4.5 : 2.4}
              strokeOpacity={highlight && highlight !== id ? 0.22 : 1}
              strokeLinecap="round"
            />
          )),
        )}
      </G>
      {showLabels
        ? ids.map((id) => {
            const [x, y] = LABEL_POS[id];
            return (
              <SvgText key={id} x={mirrored ? 200 - x : x} y={y} fontSize={8} fill={colors.line[id]} textAnchor="middle" opacity={highlight && highlight !== id ? 0.3 : 1}>
                {id}
              </SvgText>
            );
          })
        : null}
    </Svg>
  );
}
