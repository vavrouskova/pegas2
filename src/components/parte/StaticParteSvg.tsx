import { ParteDraft, ParteTemplate, ParteTextSlot } from '@/types/parte';
import { mergeTemplateWithDraft } from '@/utils/parte/effective-template';
import { resolveFontCss } from '@/utils/parte/fonts';

interface StaticParteSvgProps {
  template: ParteTemplate;
  draft?: ParteDraft;
  className?: string;
}

const computeAnchorX = (slot: ParteTextSlot) => {
  if (slot.style.align === 'left') return slot.x;
  if (slot.style.align === 'right') return slot.x + slot.width;
  return slot.x + slot.width / 2;
};

const computeTextAnchor = (slot: ParteTextSlot) => {
  if (slot.style.align === 'left') return 'start';
  if (slot.style.align === 'right') return 'end';
  return 'middle';
};

const renderTextSlot = (slot: ParteTextSlot, text: string) => {
  const lines = text.split('\n');
  const lineHeight = slot.style.fontSize * 1.25;
  const anchorX = computeAnchorX(slot);
  const textAnchor = computeTextAnchor(slot);
  const fontStyle = slot.style.fontStyle === 'italic' ? 'italic' : 'normal';
  const fontWeight = slot.style.fontStyle === 'bold' ? 700 : 400;

  return (
    <text
      key={slot.id}
      x={anchorX}
      y={slot.y + slot.style.fontSize}
      fontFamily={resolveFontCss(slot.style)}
      fontSize={slot.style.fontSize}
      fill={slot.style.color}
      textAnchor={textAnchor}
      fontStyle={fontStyle}
      fontWeight={fontWeight}
    >
      {lines.map((line, index) => (
        <tspan
          key={`${slot.id}-${index}`}
          x={anchorX}
          dy={index === 0 ? 0 : lineHeight}
        >
          {line || '\u00A0'}
        </tspan>
      ))}
    </text>
  );
};

const StaticParteSvg = ({ template: rawTemplate, draft, className }: StaticParteSvgProps) => {
  const template = mergeTemplateWithDraft(rawTemplate, draft);
  const { width, height, background, border } = template;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      preserveAspectRatio='xMidYMid meet'
    >
      <rect
        width={width}
        height={height}
        fill={background.color}
      />

      {border && (
        <rect
          x={border.inset}
          y={border.inset}
          width={width - border.inset * 2}
          height={height - border.inset * 2}
          fill='none'
          stroke={border.color}
          strokeWidth={border.width}
        />
      )}

      {template.slots.map((slot) => {
        if (slot.type === 'photo') {
          const photoUrl = draft?.photos[slot.id];
          if (slot.shape === 'circle') {
            const cx = slot.x + slot.width / 2;
            const cy = slot.y + slot.height / 2;
            const r = Math.min(slot.width, slot.height) / 2;
            if (!photoUrl) {
              return (
                <g key={slot.id}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill='#e6e1d8'
                    stroke='#b8b0a0'
                    strokeDasharray='4 4'
                  />
                  <text
                    x={cx}
                    y={cy + 4}
                    fontSize={11}
                    fill='#8a8070'
                    textAnchor='middle'
                    fontFamily='sans-serif'
                  >
                    Fotografie
                  </text>
                </g>
              );
            }
            return (
              <g key={slot.id}>
                <defs>
                  <clipPath id={`clip-${slot.id}`}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r}
                    />
                  </clipPath>
                </defs>
                <image
                  href={photoUrl}
                  x={slot.x}
                  y={slot.y}
                  width={slot.width}
                  height={slot.height}
                  clipPath={`url(#clip-${slot.id})`}
                  preserveAspectRatio='xMidYMid slice'
                />
              </g>
            );
          }
          if (!photoUrl) {
            return (
              <g key={slot.id}>
                <rect
                  x={slot.x}
                  y={slot.y}
                  width={slot.width}
                  height={slot.height}
                  fill='#e6e1d8'
                  stroke='#b8b0a0'
                  strokeDasharray='4 4'
                />
                <text
                  x={slot.x + slot.width / 2}
                  y={slot.y + slot.height / 2 + 4}
                  fontSize={11}
                  fill='#8a8070'
                  textAnchor='middle'
                  fontFamily='sans-serif'
                >
                  Fotografie
                </text>
              </g>
            );
          }
          return (
            <image
              key={slot.id}
              href={photoUrl}
              x={slot.x}
              y={slot.y}
              width={slot.width}
              height={slot.height}
              preserveAspectRatio='xMidYMid slice'
            />
          );
        }

        const text = draft?.texts[slot.id] ?? slot.defaultText;
        return renderTextSlot(slot, text);
      })}
    </svg>
  );
};

export default StaticParteSvg;
