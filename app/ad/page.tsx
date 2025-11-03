"use client";

import { useEffect, useRef, useState } from 'react';

const WIDTH = 1280;
const HEIGHT = 720;
const FPS = 30;
const DURATION = 20; // seconds

function clamp(n: number, min: number, max: number) { return Math.min(max, Math.max(min, n)); }
function easeInOutQuad(x: number) { return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function drawBackground(ctx: CanvasRenderingContext2D, t: number) {
  const w = WIDTH, h = HEIGHT;
  ctx.clearRect(0, 0, w, h);

  // Animated gradient background
  const g = ctx.createLinearGradient(0, 0, w, h);
  const shift = Math.sin(t * 0.2) * 0.2 + 0.2;
  g.addColorStop(0, `hsl(${lerp(210, 260, shift)}, 60%, 14%)`);
  g.addColorStop(1, `hsl(${lerp(260, 300, 1 - shift)}, 55%, 10%)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Soft radial highlight
  const rg = ctx.createRadialGradient(w * 0.5, h * 0.35, 50, w * 0.5, h * 0.35, Math.max(w, h));
  rg.addColorStop(0, 'rgba(255,255,255,0.06)');
  rg.addColorStop(1, 'rgba(255,255,255,0.0)');
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, w, h);

  // Vignette
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath();
  ctx.rect(0, 0, w, h);
  ctx.lineWidth = 60;
  ctx.strokeStyle = 'rgba(0,0,0,0.35)';
  ctx.stroke();
}

function drawCenteredText(ctx: CanvasRenderingContext2D, text: string, size: number, y: number, alpha = 1, weight = 700, letterSpacing = 0) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${weight} ${size}px system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji"`;
  // Basic letter spacing effect by drawing per-character
  if (letterSpacing !== 0) {
    const chars = Array.from(text);
    const totalWidth = chars.reduce((w, c) => w + ctx.measureText(c).width, 0) + letterSpacing * (chars.length - 1);
    let x = WIDTH / 2 - totalWidth / 2;
    for (const c of chars) {
      ctx.fillText(c, x + ctx.measureText(c).width / 2, y);
      x += ctx.measureText(c).width + letterSpacing;
    }
  } else {
    ctx.fillText(text, WIDTH / 2, y);
  }
  ctx.restore();
}

function drawBullets(ctx: CanvasRenderingContext2D, items: string[], yStart: number, tLocal: number) {
  const lineHeight = 44;
  items.forEach((it, i) => {
    const appear = clamp((tLocal - i * 0.4) / 0.6, 0, 1);
    const alpha = easeInOutQuad(appear);
    const y = yStart + i * lineHeight;
    drawCenteredText(ctx, `? ${it}`, 28, y, alpha, 500);
  });
}

function renderFrame(ctx: CanvasRenderingContext2D, t: number) {
  drawBackground(ctx, t);

  // Scene timings (seconds)
  // 0-3: Brand intro
  // 3-7: Services
  // 7-12: Value props
  // 12-17: Contact
  // 17-20: Outro

  if (t < 3) {
    const a = easeInOutQuad(clamp(t / 2, 0, 1));
    drawCenteredText(ctx, 'SWARGAYATRA', 84, HEIGHT * 0.38, a, 800, 1.5);
    drawCenteredText(ctx, 'Dignified Farewells in Bangalore', 34, HEIGHT * 0.50, clamp((t - 0.5) / 2, 0, 1));
    drawCenteredText(ctx, '24?7 Compassionate Support', 28, HEIGHT * 0.58, clamp((t - 1.1) / 2, 0, 1), 600);
  } else if (t < 7) {
    const tLocal = t - 3;
    drawCenteredText(ctx, 'Complete Funeral Care', 52, HEIGHT * 0.28, easeInOutQuad(clamp(tLocal / 0.8, 0, 1)), 800);
    drawBullets(ctx, [
      'Hearse van & mortuary coordination',
      'Priests, rituals, and materials',
      'Documentation & permits assistance',
      'Electric & traditional cremation'
    ], HEIGHT * 0.42, tLocal);
  } else if (t < 12) {
    const tLocal = t - 7;
    drawCenteredText(ctx, 'Why Families Trust Us', 48, HEIGHT * 0.30, easeInOutQuad(clamp(tLocal / 0.8, 0, 1)), 800);
    drawBullets(ctx, [
      'Pan-Bangalore rapid response',
      'Transparent, fair pricing',
      'Dedicated coordinator end-to-end',
      'Culturally sensitive care'
    ], HEIGHT * 0.44, tLocal);
  } else if (t < 17) {
    const tLocal = t - 12;
    drawCenteredText(ctx, 'We?re Here, 24?7', 56, HEIGHT * 0.34, easeInOutQuad(clamp(tLocal / 0.8, 0, 1)), 800);
    drawCenteredText(ctx, 'Call +91 99999 99999', 46, HEIGHT * 0.48, clamp((tLocal - 0.4) / 1.0, 0, 1), 700);
    drawCenteredText(ctx, 'swargayatra.in', 36, HEIGHT * 0.58, clamp((tLocal - 0.9) / 1.0, 0, 1), 600);
  } else {
    const tLocal = t - 17;
    const a = 1 - clamp((tLocal - 2) / 1, 0, 1) * 0.2; // slight fade
    drawCenteredText(ctx, 'SWARGAYATRA', 86, HEIGHT * 0.42, a, 900, 1.8);
    drawCenteredText(ctx, 'Bangalore ? Serving with compassion', 32, HEIGHT * 0.54, a, 600);
  }
}

export default function AdPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    canvas.width = WIDTH * dpr;
    canvas.height = HEIGHT * dpr;
    canvas.style.width = WIDTH + 'px';
    canvas.style.height = HEIGHT + 'px';
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    let raf = 0;
    const start = performance.now();
    const loop = () => {
      const now = performance.now();
      const t = ((now - start) / 1000) % DURATION;
      renderFrame(ctx, t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const generateVideo = async () => {
    if (isRecording) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    setDownloadUrl(null);
    setIsRecording(true);

    const stream = canvas.captureStream(FPS);
    const chunks: BlobPart[] = [];
    const options: MediaRecorderOptions = { mimeType: 'video/webm;codecs=vp9' };
    const rec = new MediaRecorder(stream, options);
    mediaRecorderRef.current = rec;
    rec.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunks.push(e.data); };
    rec.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setIsRecording(false);
    };

    rec.start();

    // Ensure deterministic timeline by driving frames for exactly DURATION seconds
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let frame = 0;
    const totalFrames = DURATION * FPS;
    const tick = () => {
      const t = frame / FPS;
      renderFrame(ctx, t);
      frame++;
      if (frame < totalFrames) {
        setTimeout(tick, 1000 / FPS);
      } else {
        rec.stop();
      }
    };
    tick();
  };

  return (
    <main className="container">
      <h1 className="pageTitle">SwargaYatra ? Video Ad</h1>
      <p className="pageNote">Preview plays in real-time below. Click Generate Video to export a 20s WebM file.</p>
      <div className="canvasWrap">
        <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
      </div>
      <div className="cta">
        <button className="button" onClick={generateVideo} disabled={isRecording}>
          {isRecording ? 'Rendering?' : 'Generate & Download Video'}
        </button>
        {downloadUrl && (
          <a className="button secondary" href={downloadUrl} download="swargayatra-ad.webm">Download Video</a>
        )}
      </div>
    </main>
  );
}
