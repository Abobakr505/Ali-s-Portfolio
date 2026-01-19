import React, { useEffect, useRef } from 'react';

interface FuzzyTextProps {
  children: React.ReactNode;
  fontSize?: number | string;
  fontWeight?: string | number;
  fontFamily?: string;
  color?: string;
  enableHover?: boolean;
  baseIntensity?: number;
  hoverIntensity?: number;
  textAlign?: 'left' | 'center' | 'right';
}

const FuzzyText: React.FC<FuzzyTextProps> = ({
  children,
  fontSize = 'clamp(2rem, 8vw, 8rem)',
  fontWeight = 900,
  fontFamily = 'inherit',
  color = '#fff',
  enableHover = true,
  baseIntensity = 0.18,
  hoverIntensity = 0.5,
  textAlign = 'center',
}) => {
  const canvasRef = useRef<HTMLCanvasElement & { cleanupFuzzyText?: () => void }>(null);

  useEffect(() => {
    let animationFrameId = 0;
    let isCancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const init = async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      if (isCancelled) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const computedFontFamily =
        fontFamily === 'inherit'
          ? window.getComputedStyle(canvas).fontFamily || 'sans-serif'
          : fontFamily;

      const fontSizeStr = typeof fontSize === 'number' ? `${fontSize}px` : fontSize;

      let numericFontSize: number;
      if (typeof fontSize === 'number') {
        numericFontSize = fontSize;
      } else {
        const temp = document.createElement('span');
        temp.style.fontSize = fontSize;
        document.body.appendChild(temp);
        numericFontSize = parseFloat(window.getComputedStyle(temp).fontSize);
        document.body.removeChild(temp);
      }

      const text = React.Children.toArray(children).join('');

      // ---------- Offscreen canvas ----------
      const offscreen = document.createElement('canvas');
      const offCtx = offscreen.getContext('2d');
      if (!offCtx) return;

      offCtx.font = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;
      offCtx.textBaseline = 'alphabetic';

      const metrics = offCtx.measureText(text);
      const actualLeft = metrics.actualBoundingBoxLeft ?? 0;
      const actualRight = metrics.actualBoundingBoxRight ?? metrics.width;
      const actualAscent = metrics.actualBoundingBoxAscent ?? numericFontSize;
      const actualDescent = metrics.actualBoundingBoxDescent ?? numericFontSize * 0.2;

      const textWidth = Math.ceil(actualLeft + actualRight);
      const textHeight = Math.ceil(actualAscent + actualDescent);

      const paddingX = 10;
      offscreen.width = textWidth + paddingX;
      offscreen.height = textHeight;

      offCtx.font = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;
      offCtx.textBaseline = 'alphabetic';
      offCtx.fillStyle = color;
      offCtx.fillText(text, paddingX / 2 - actualLeft, actualAscent);

      // ---------- Main canvas ----------
      const marginX = 50;
      canvas.width = offscreen.width + marginX * 2;
      canvas.height = offscreen.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (textAlign === 'center') {
        ctx.translate(marginX, 0);
      } else if (textAlign === 'right') {
        ctx.translate(canvas.width - offscreen.width - marginX, 0);
      } else {
        ctx.translate(marginX, 0);
      }

      let isHovering = false;
      const fuzzRange = 30;

      const run = () => {
        if (isCancelled) return;

        ctx.clearRect(-fuzzRange, -fuzzRange, offscreen.width + fuzzRange * 2, offscreen.height + fuzzRange * 2);

        const intensity = isHovering ? hoverIntensity : baseIntensity;

        for (let y = 0; y < offscreen.height; y++) {
          const dx = Math.floor((Math.random() - 0.5) * fuzzRange * intensity);
          ctx.drawImage(offscreen, 0, y, offscreen.width, 1, dx, y, offscreen.width, 1);
        }

        animationFrameId = requestAnimationFrame(run);
      };

      run();

      const rectContains = (x: number, y: number) =>
        x >= 0 && x <= offscreen.width && y >= 0 && y <= offscreen.height;

      const onMove = (x: number, y: number) => {
        isHovering = rectContains(x, y);
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!enableHover) return;
        const rect = canvas.getBoundingClientRect();
        onMove(e.clientX - rect.left, e.clientY - rect.top);
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!enableHover) return;
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const t = e.touches[0];
        onMove(t.clientX - rect.left, t.clientY - rect.top);
      };

      const cleanup = () => {
        cancelAnimationFrame(animationFrameId);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('touchmove', handleTouchMove);
      };

      if (enableHover) {
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      }

      canvas.cleanupFuzzyText = cleanup;
    };

    init();

    return () => {
      isCancelled = true;
      cancelAnimationFrame(animationFrameId);
      canvas?.cleanupFuzzyText?.();
    };
  }, [
    children,
    fontSize,
    fontWeight,
    fontFamily,
    color,
    enableHover,
    baseIntensity,
    hoverIntensity,
    textAlign,
  ]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        margin:
          textAlign === 'center'
            ? '0 auto'
            : textAlign === 'right'
            ? '0 0 0 auto'
            : '0 auto 0 0',
      }}
    />
  );
};

export default FuzzyText;
