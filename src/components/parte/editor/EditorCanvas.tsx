'use client';

import Konva from 'konva';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Circle, Group, Image as KonvaImage, Layer, Rect, Stage, Text, Transformer } from 'react-konva';

import { ParteDraft, ParteSlot, ParteTemplate, ParteTextSlot } from '@/types/parte';
import { resolveFontCss } from '@/utils/parte/fonts';

/* eslint-disable no-unused-vars */
export interface EditorCanvasHandle {
  exportPng: (pixelRatio?: number) => string | null;
}

interface EditorCanvasProps {
  template: ParteTemplate;
  draft: ParteDraft;
  selectedSlotId: string | null;
  onSelectSlot: (slotId: string | null) => void;
  onOverlayMove: (kind: 'portrait' | 'cross', x: number, y: number) => void;
  scale?: number;
}
/* eslint-enable no-unused-vars */

const loadImage = (source: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', () => reject(new Error('Image load failed')));
    img.src = source;
  });

interface PhotoNodeProps {
  slot: Extract<ParteSlot, { type: 'photo' }>;
  src: string | undefined;
  selected: boolean;
  onSelect: () => void;
}

const PhotoNode = ({ slot, src, selected, onSelect }: PhotoNodeProps) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!src) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImage(null);
      return;
    }
    let cancelled = false;
    loadImage(src)
      .then((img) => {
        if (!cancelled) setImage(img);
      })
      .catch(() => {
        if (!cancelled) setImage(null);
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  // object-fit: cover — compute draw rect preserving image aspect ratio
  let drawX = slot.x;
  let drawY = slot.y;
  let drawWidth = slot.width;
  let drawHeight = slot.height;
  if (image) {
    const imageAspect = image.width / image.height;
    const slotAspect = slot.width / slot.height;
    if (imageAspect > slotAspect) {
      drawHeight = slot.height;
      drawWidth = slot.height * imageAspect;
      drawX = slot.x + (slot.width - drawWidth) / 2;
      drawY = slot.y;
    } else {
      drawWidth = slot.width;
      drawHeight = slot.width / imageAspect;
      drawX = slot.x;
      drawY = slot.y + (slot.height - drawHeight) / 2;
    }
  }

  if (slot.shape === 'circle') {
    const cx = slot.x + slot.width / 2;
    const cy = slot.y + slot.height / 2;
    const r = Math.min(slot.width, slot.height) / 2;

    if (!image) {
      return (
        <Group
          onClick={onSelect}
          onTap={onSelect}
        >
          <Circle
            x={cx}
            y={cy}
            radius={r}
            fill='#e6e1d8'
            stroke={selected ? '#5b3280' : '#b8b0a0'}
            strokeWidth={selected ? 2 : 1}
            dash={[4, 4]}
          />
          <Text
            x={slot.x}
            y={cy - 7}
            width={slot.width}
            text='Fotografie'
            fontSize={11}
            fill='#8a8070'
            align='center'
            fontFamily='Inter, sans-serif'
          />
        </Group>
      );
    }

    return (
      <Group
        onClick={onSelect}
        onTap={onSelect}
      >
        <Group
          clipFunc={(context) => {
            context.arc(cx, cy, r, 0, Math.PI * 2, false);
          }}
        >
          <KonvaImage
            image={image}
            x={drawX}
            y={drawY}
            width={drawWidth}
            height={drawHeight}
          />
        </Group>
        {selected && (
          <Circle
            x={cx}
            y={cy}
            radius={r}
            stroke='#5b3280'
            strokeWidth={2}
            listening={false}
          />
        )}
      </Group>
    );
  }

  if (!image) {
    return (
      <Group
        onClick={onSelect}
        onTap={onSelect}
      >
        <Rect
          x={slot.x}
          y={slot.y}
          width={slot.width}
          height={slot.height}
          fill='#e6e1d8'
          stroke={selected ? '#5b3280' : '#b8b0a0'}
          strokeWidth={selected ? 2 : 1}
          dash={[4, 4]}
        />
        <Text
          x={slot.x}
          y={slot.y + slot.height / 2 - 6}
          width={slot.width}
          text='Fotografie'
          fontSize={11}
          fill='#8a8070'
          align='center'
          fontFamily='Inter, sans-serif'
        />
      </Group>
    );
  }

  return (
    <Group
      onClick={onSelect}
      onTap={onSelect}
    >
      <Group
        clipFunc={(context) => {
          context.rect(slot.x, slot.y, slot.width, slot.height);
        }}
      >
        <KonvaImage
          image={image}
          x={drawX}
          y={drawY}
          width={drawWidth}
          height={drawHeight}
        />
      </Group>
      {selected && (
        <Rect
          x={slot.x}
          y={slot.y}
          width={slot.width}
          height={slot.height}
          stroke='#5b3280'
          strokeWidth={2}
          listening={false}
        />
      )}
    </Group>
  );
};

/* eslint-disable no-unused-vars */
interface OverlayImageProps {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zoom?: number;
  shape?: 'circle' | 'rectangle';
  selected: boolean;
  stageWidth: number;
  stageHeight: number;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
}
/* eslint-enable no-unused-vars */

const OverlayImage = ({
  src,
  x,
  y,
  width,
  height,
  zoom = 1,
  shape = 'rectangle',
  selected,
  stageWidth,
  stageHeight,
  onSelect,
  onDragEnd,
}: OverlayImageProps) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadImage(src)
      .then((img) => {
        if (!cancelled) setImage(img);
      })
      .catch(() => {
        if (!cancelled) setImage(null);
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (!image) return null;

  const clampDrag = (pos: { x: number; y: number }) => ({
    x: Math.max(0, Math.min(pos.x, stageWidth - width)),
    y: Math.max(0, Math.min(pos.y, stageHeight - height)),
  });

  // object-fit: cover — preserve image aspect ratio, fill the slot, crop excess
  const imageAspect = image.width / image.height;
  const slotAspect = width / height;
  let drawWidth: number;
  let drawHeight: number;
  if (imageAspect > slotAspect) {
    drawHeight = height;
    drawWidth = height * imageAspect;
  } else {
    drawWidth = width;
    drawHeight = width / imageAspect;
  }
  // apply zoom multiplier and re-center
  drawWidth *= zoom;
  drawHeight *= zoom;
  const drawX = (width - drawWidth) / 2;
  const drawY = (height - drawHeight) / 2;

  if (shape === 'circle') {
    const r = Math.min(width, height) / 2;

    return (
      <Group
        x={x}
        y={y}
        draggable
        dragBoundFunc={clampDrag}
        onDragEnd={(event) => onDragEnd(event.target.x(), event.target.y())}
        onClick={onSelect}
        onTap={onSelect}
      >
        <Group
          clipFunc={(context) => {
            context.arc(r, r, r, 0, Math.PI * 2, false);
          }}
        >
          <KonvaImage
            image={image}
            x={drawX}
            y={drawY}
            width={drawWidth}
            height={drawHeight}
          />
        </Group>
        {selected && (
          <Circle
            x={r}
            y={r}
            radius={r}
            stroke='#5b3280'
            strokeWidth={2}
            dash={[4, 4]}
            listening={false}
          />
        )}
      </Group>
    );
  }

  return (
    <Group
      x={x}
      y={y}
      draggable
      dragBoundFunc={clampDrag}
      onDragEnd={(event) => onDragEnd(event.target.x(), event.target.y())}
      onClick={onSelect}
      onTap={onSelect}
    >
      <Group
        clipFunc={(context) => {
          context.rect(0, 0, width, height);
        }}
      >
        <KonvaImage
          image={image}
          x={drawX}
          y={drawY}
          width={drawWidth}
          height={drawHeight}
        />
      </Group>
      {selected && (
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          stroke='#5b3280'
          strokeWidth={2}
          dash={[4, 4]}
          listening={false}
        />
      )}
    </Group>
  );
};

interface TextNodeProps {
  slot: ParteTextSlot;
  text: string;
  selected: boolean;
  onSelect: () => void;
}

const resolveFontStyle = (style: ParteTextSlot['style']) => {
  if (style.fontStyle === 'bold') return 'bold';
  if (style.fontStyle === 'italic') return 'italic';
  return 'normal';
};

const TextNode = ({ slot, text, selected, onSelect }: TextNodeProps) => {
  const fontStyle = resolveFontStyle(slot.style);

  return (
    <Group
      onClick={onSelect}
      onTap={onSelect}
    >
      {selected && (
        <Rect
          x={slot.x - 4}
          y={slot.y - 4}
          width={slot.width + 8}
          height={slot.height + 8}
          stroke='#5b3280'
          strokeWidth={1.5}
          dash={[4, 4]}
          listening={false}
        />
      )}
      <Text
        x={slot.x}
        y={slot.y}
        width={slot.width}
        height={slot.height}
        text={text}
        fontSize={slot.style.fontSize}
        fill={slot.style.color}
        fontFamily={resolveFontCss(slot.style)}
        fontStyle={fontStyle}
        align={slot.style.align}
        verticalAlign='top'
        lineHeight={1.25}
      />
    </Group>
  );
};

const EditorCanvas = forwardRef<EditorCanvasHandle, EditorCanvasProps>(
  ({ template, draft, selectedSlotId, onSelectSlot, onOverlayMove, scale = 1 }, ref) => {
    const stageRef = useRef<Konva.Stage | null>(null);

    useImperativeHandle(ref, () => ({
      exportPng: (pixelRatio = 4) => {
        if (!stageRef.current) return null;
        return stageRef.current.toDataURL({ pixelRatio, mimeType: 'image/png' });
      },
    }));

    const width = template.width * scale;
    const height = template.height * scale;

    return (
      <Stage
        width={width}
        height={height}
        scaleX={scale}
        scaleY={scale}
        ref={stageRef}
        style={{ background: template.background.color }}
        onClick={(event) => {
          if (event.target === event.target.getStage()) onSelectSlot(null);
        }}
        onTap={(event) => {
          if (event.target === event.target.getStage()) onSelectSlot(null);
        }}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            width={template.width}
            height={template.height}
            fill={template.background.color}
          />
          {template.border && (
            <Rect
              x={template.border.inset}
              y={template.border.inset}
              width={template.width - template.border.inset * 2}
              height={template.height - template.border.inset * 2}
              stroke={template.border.color}
              strokeWidth={template.border.width}
              listening={false}
            />
          )}
          {template.slots.map((slot) => {
            if (slot.type === 'photo') {
              return (
                <PhotoNode
                  key={slot.id}
                  slot={slot}
                  src={draft.photos[slot.id]}
                  selected={selectedSlotId === slot.id}
                  onSelect={() => onSelectSlot(slot.id)}
                />
              );
            }
            return (
              <TextNode
                key={slot.id}
                slot={slot}
                text={draft.texts[slot.id] ?? slot.defaultText}
                selected={selectedSlotId === slot.id}
                onSelect={() => onSelectSlot(slot.id)}
              />
            );
          })}

          {draft.crossOverlay && (
            <OverlayImage
              src={draft.crossOverlay.src}
              x={draft.crossOverlay.x}
              y={draft.crossOverlay.y}
              width={draft.crossOverlay.width}
              height={draft.crossOverlay.height}
              zoom={draft.crossOverlay.zoom}
              selected={selectedSlotId === '__cross_overlay__'}
              stageWidth={template.width}
              stageHeight={template.height}
              onSelect={() => onSelectSlot('__cross_overlay__')}
              onDragEnd={(x, y) => onOverlayMove('cross', x, y)}
            />
          )}
          {draft.portraitOverlay && (
            <OverlayImage
              src={draft.portraitOverlay.src}
              x={draft.portraitOverlay.x}
              y={draft.portraitOverlay.y}
              width={draft.portraitOverlay.width}
              height={draft.portraitOverlay.height}
              zoom={draft.portraitOverlay.zoom}
              shape='circle'
              selected={selectedSlotId === '__portrait_overlay__'}
              stageWidth={template.width}
              stageHeight={template.height}
              onSelect={() => onSelectSlot('__portrait_overlay__')}
              onDragEnd={(x, y) => onOverlayMove('portrait', x, y)}
            />
          )}
        </Layer>
      </Stage>
    );
  }
);

EditorCanvas.displayName = 'EditorCanvas';

export default EditorCanvas;
