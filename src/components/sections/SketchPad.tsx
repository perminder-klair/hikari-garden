import { useState, useRef, useCallback } from 'react';
import { Pencil, Eraser, Trash2, Download, Palette, Undo } from 'lucide-react';
import styles from './SketchPad.module.css';

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
  width: number;
}

const COLORS = ['#1a1a1a', '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#f4d03f', '#ffffff'];
const BRUSH_SIZES = [2, 4, 8, 12, 20];

export default function SketchPad() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [color, setColor] = useState('#1a1a1a');
  const [brushSize, setBrushSize] = useState(4);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;
    
    setIsDrawing(true);
    setCurrentStroke({
      points: [coords],
      color: tool === 'eraser' ? '#f5f5f5' : color,
      width: brushSize
    });
  }, [color, brushSize, tool]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || !currentStroke) return;
    
    const coords = getCoordinates(e);
    if (!coords) return;
    
    setCurrentStroke({
      ...currentStroke,
      points: [...currentStroke.points, coords]
    });
  }, [isDrawing, currentStroke]);

  const stopDrawing = useCallback(() => {
    if (currentStroke) {
      setStrokes([...strokes, currentStroke]);
    }
    setIsDrawing(false);
    setCurrentStroke(null);
  }, [currentStroke, strokes]);

  const clearCanvas = () => {
    setStrokes([]);
    setCurrentStroke(null);
  };

  const undo = () => {
    setStrokes(strokes.slice(0, -1));
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `sketch-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  // Render canvas
  const renderCanvas = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    [...strokes, currentStroke].filter(Boolean).forEach((stroke) => {
      if (!stroke || stroke.points.length < 2) return;
      
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      stroke.points.slice(1).forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    });
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <Pencil className={styles.sectionIcon} />
        <h2 className={styles.sectionTitle}>Sketch Pad</h2>
        <p className={styles.sectionSubtitle}>Capture ideas visually</p>
      </div>

      <div className={styles.container}>
        <div className={styles.toolbar}>
          <div className={styles.toolGroup}>
            <button
              className={styles.toolButton}
              data-active={tool === 'pen'}
              onClick={() => setTool('pen')}
              title="Pen"
            >
              <Pencil size={20} />
            </button>
            <button
              className={styles.toolButton}
              data-active={tool === 'eraser'}
              onClick={() => setTool('eraser')}
              title="Eraser"
            >
              <Eraser size={20} />
            </button>
          </div>

          <div className={styles.toolGroup}>
            {COLORS.map((c) => (
              <button
                key={c}
                className={styles.colorButton}
                data-active={color === c && tool === 'pen'}
                style={{ background: c }}
                onClick={() => {
                  setColor(c);
                  setTool('pen');
                }}
              />
            ))}
          </div>

          <div className={styles.toolGroup}>
            {BRUSH_SIZES.map((size) => (
              <button
                key={size}
                className={styles.sizeButton}
                data-active={brushSize === size}
                onClick={() => setBrushSize(size)}
                title={`${size}px`}
              >
                <div 
                  className={styles.sizePreview}
                  style={{ 
                    width: size, 
                    height: size, 
                    background: tool === 'eraser' ? '#ccc' : color 
                  }}
                />
              </button>
            ))}
          </div>

          <div className={styles.toolGroup}>
            <button className={styles.actionButton} onClick={undo} disabled={strokes.length === 0}>
              <Undo size={18} />
            </button>
            <button className={styles.actionButton} onClick={clearCanvas}>
              <Trash2 size={18} />
            </button>
            <button className={styles.actionButton} onClick={download}>
              <Download size={18} />
            </button>
          </div>
        </div>

        <div className={styles.canvasContainer}>
          <canvas
            ref={(canvas) => {
              if (canvas) {
                canvasRef.current = canvas;
                renderCanvas(canvas);
              }
            }}
            width={800}
            height={500}
            className={styles.canvas}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>

        <div className={styles.info}>
          <Palette size={16} />
          <span>{strokes.length} strokes captured</span>
        </div>
      </div>
    </section>
  );
}
