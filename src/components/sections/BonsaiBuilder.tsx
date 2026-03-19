import { useState, useEffect, useCallback, useRef } from 'react';
import { TreePine, Scissors, Droplets, Sun, Wind, RotateCcw, Save, Leaf } from 'lucide-react';
import styles from './BonsaiBuilder.module.css';

interface Branch {
  id: number;
  x: number;
  y: number;
  angle: number;
  length: number;
  width: number;
  generation: number;
  hasLeaves: boolean;
}

interface BonsaiState {
  health: number;
  water: number;
  sunlight: number;
  pruned: number;
  age: number;
  style: 'formal' | 'informal' | 'cascade' | 'windswept';
}

const BONSAI_STYLES = {
  formal: { name: 'Chokkan', desc: 'Formal upright', angleMod: 0 },
  informal: { name: 'Moyogi', desc: 'Informal upright', angleMod: 15 },
  cascade: { name: 'Kengai', desc: 'Cascade', angleMod: -45 },
  windswept: { name: 'Fukinagashi', desc: 'Windswept', angleMod: 30 },
};

export default function BonsaiBuilder() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [bonsai, setBonsai] = useState<BonsaiState>({
    health: 80,
    water: 60,
    sunlight: 70,
    pruned: 0,
    age: 1,
    style: 'informal',
  });
  const [isGrowing, setIsGrowing] = useState(false);
  const [selectedTool, setSelectedTool] = useState<'prune' | 'water' | 'sun' | 'wind'>('water');
  const [message, setMessage] = useState('');
  const canvasRef = useRef<HTMLDivElement>(null);

  // Generate initial trunk
  useEffect(() => {
    generateTree();
  }, [bonsai.style]);

  const generateTree = useCallback(() => {
    const newBranches: Branch[] = [];
    const styleMod = BONSAI_STYLES[bonsai.style].angleMod;
    
    // Main trunk
    newBranches.push({
      id: 0,
      x: 150,
      y: 280,
      angle: -90 + styleMod * 0.3,
      length: 60,
      width: 8,
      generation: 0,
      hasLeaves: true,
    });

    // Generate branches recursively
    const generateBranches = (parentId: number, generation: number) => {
      if (generation > 4) return;
      
      const parent = newBranches[parentId];
      const numBranches = generation === 0 ? 2 : Math.random() > 0.3 ? 2 : 1;
      
      for (let i = 0; i < numBranches; i++) {
        const angleOffset = i === 0 ? -25 - Math.random() * 15 : 25 + Math.random() * 15;
        const newAngle = parent.angle + angleOffset + styleMod * (generation * 0.2);
        const newLength = parent.length * (0.7 - generation * 0.1);
        const newWidth = Math.max(1, parent.width - 2);
        
        const endX = parent.x + Math.cos((parent.angle * Math.PI) / 180) * parent.length;
        const endY = parent.y + Math.sin((parent.angle * Math.PI) / 180) * parent.length;
        
        const newBranch: Branch = {
          id: newBranches.length,
          x: endX,
          y: endY,
          angle: newAngle,
          length: newLength,
          width: newWidth,
          generation,
          hasLeaves: generation >= 2,
        };
        
        newBranches.push(newBranch);
        generateBranches(newBranch.id, generation + 1);
      }
    };

    generateBranches(0, 1);
    setBranches(newBranches);
  }, [bonsai.style]);

  const handleToolAction = useCallback(() => {
    switch (selectedTool) {
      case 'prune':
        showMessage('Click a branch to prune it');
        break;
      case 'water':
        setBonsai(prev => ({ ...prev, water: Math.min(100, prev.water + 15) }));
        showMessage('Watered with love 💧');
        break;
      case 'sun':
        setBonsai(prev => ({ ...prev, sunlight: Math.min(100, prev.sunlight + 15) }));
        showMessage('Basking in sunlight ☀️');
        break;
      case 'wind':
        setBranches(prev => prev.map(b => ({
          ...b,
          angle: b.angle + (Math.random() - 0.5) * 10,
        })));
        showMessage('Gentle breeze passes 🍃');
        break;
    }
  }, [selectedTool]);

  const pruneBranch = useCallback((branchId: number) => {
    if (selectedTool !== 'prune' || branchId === 0) return;
    setBranches(prev => prev.filter(b => b.id !== branchId));
    setBonsai(prev => ({ ...prev, pruned: prev.pruned + 1, health: Math.min(100, prev.health + 2) }));
    showMessage('Branch pruned with care');
  }, [selectedTool]);

  const isDescendant = (allBranches: Branch[], checkId: number, parentId: number): boolean => {
    const branch = allBranches.find(b => b.id === checkId);
    if (!branch) return false;
    // Simplified check - in a real implementation, we'd track parent references
    return false;
  };

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 2000);
  };

  const growTree = useCallback(() => {
    if (bonsai.water < 20 || bonsai.sunlight < 20) {
      showMessage('Needs more water and sunlight to grow!');
      return;
    }
    
    setIsGrowing(true);
    setBonsai(prev => ({
      ...prev,
      age: prev.age + 1,
      water: Math.max(20, prev.water - 20),
      health: Math.min(100, prev.health + 5),
    }));
    
    // Regenerate with slightly different parameters
    setTimeout(() => {
      generateTree();
      setIsGrowing(false);
      showMessage('Your bonsai has grown! 🌳');
    }, 1000);
  }, [bonsai.water, bonsai.sunlight, generateTree]);

  const resetBonsai = () => {
    setBonsai({
      health: 80,
      water: 60,
      sunlight: 70,
      pruned: 0,
      age: 1,
      style: 'informal',
    });
    generateTree();
    showMessage('New bonsai planted');
  };

  // Calculate branch end points
  const getBranchEnd = (branch: Branch) => ({
    x: branch.x + Math.cos((branch.angle * Math.PI) / 180) * branch.length,
    y: branch.y + Math.sin((branch.angle * Math.PI) / 180) * branch.length,
  });

  return (
    <section className={styles.bonsaiBuilder}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          <TreePine className={styles.icon} size={28} />
          Bonsai Builder
          <TreePine className={styles.icon} size={28} />
        </h2>
        <p className={styles.subtitle}>
          Cultivate your virtual bonsai. Prune, water, and shape with patience.
        </p>
      </header>

      <div className={styles.styleSelector}>
        {Object.entries(BONSAI_STYLES).map(([key, style]) => (
          <button
            key={key}
            className={`${styles.styleButton} ${bonsai.style === key ? styles.active : ''}`}
            onClick={() => setBonsai(prev => ({ ...prev, style: key as BonsaiState['style'] }))}
          >
            <span className={styles.styleName}>{style.name}</span>
            <span className={styles.styleDesc}>{style.desc}</span>
          </button>
        ))}
      </div>

      <div className={styles.mainContent}>
        <div className={styles.canvasContainer} ref={canvasRef}>
          <svg className={styles.canvas} viewBox="0 0 300 320">
            {/* Pot */}
            <defs>
              <linearGradient id="potGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B4513" />
                <stop offset="50%" stopColor="#A0522D" />
                <stop offset="100%" stopColor="#8B4513" />
              </linearGradient>
              <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4A3728" />
                <stop offset="50%" stopColor="#5D4037" />
                <stop offset="100%" stopColor="#4A3728" />
              </linearGradient>
              <radialGradient id="leafGradient">
                <stop offset="0%" stopColor="#7CB342" />
                <stop offset="100%" stopColor="#558B2F" />
              </radialGradient>
            </defs>
            
            {/* Pot */}
            <ellipse cx="150" cy="295" rx="60" ry="15" fill="#3E2723" />
            <path d="M 95 280 L 100 310 Q 150 325 200 310 L 205 280 Q 150 295 95 280" fill="url(#potGradient)" />
            <ellipse cx="150" cy="280" rx="55" ry="12" fill="#5D4037" />
            
            {/* Soil */}
            <ellipse cx="150" cy="282" rx="50" ry="10" fill="#3E2723" />
            
            {/* Branches */}
            {branches.map((branch) => {
              const end = getBranchEnd(branch);
              return (
                <g key={branch.id}>
                  <line
                    x1={branch.x}
                    y1={branch.y}
                    x2={end.x}
                    y2={end.y}
                    stroke="url(#trunkGradient)"
                    strokeWidth={branch.width}
                    strokeLinecap="round"
                    className={`${styles.branch} ${selectedTool === 'prune' ? styles.prunable : ''}`}
                    onClick={() => pruneBranch(branch.id)}
                  />
                  {branch.hasLeaves && (
                    <>
                      <circle cx={end.x} cy={end.y} r={6} fill="url(#leafGradient)" opacity={0.9}>
                        <animate attributeName="r" values="6;7;6" dur="3s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={end.x - 4} cy={end.y - 3} r={4} fill="#8BC34A" opacity={0.7} />
                      <circle cx={end.x + 4} cy={end.y - 2} r={5} fill="#689F38" opacity={0.8} />
                    </>
                  )}
                </g>
              );
            })}
          </svg>
          
          {message && <div className={styles.message}>{message}</div>}
        </div>

        <div className={styles.sidebar}>
          <div className={styles.tools}>
            <h3 className={styles.sectionTitle}>Tools</h3>
            <div className={styles.toolGrid}>
              <button
                className={`${styles.toolButton} ${selectedTool === 'prune' ? styles.active : ''}`}
                onClick={() => setSelectedTool('prune')}
              >
                <Scissors size={20} />
                <span>Prune</span>
              </button>
              <button
                className={`${styles.toolButton} ${selectedTool === 'water' ? styles.active : ''}`}
                onClick={() => setSelectedTool('water')}
              >
                <Droplets size={20} />
                <span>Water</span>
              </button>
              <button
                className={`${styles.toolButton} ${selectedTool === 'sun' ? styles.active : ''}`}
                onClick={() => setSelectedTool('sun')}
              >
                <Sun size={20} />
                <span>Sun</span>
              </button>
              <button
                className={`${styles.toolButton} ${selectedTool === 'wind' ? styles.active : ''}`}
                onClick={() => setSelectedTool('wind')}
              >
                <Wind size={20} />
                <span>Wind</span>
              </button>
            </div>
            
            <button 
              className={styles.actionButton}
              onClick={handleToolAction}
              disabled={selectedTool === 'prune'}
            >
              <Leaf size={18} />
              Apply {selectedTool === 'prune' ? '(click branch)' : selectedTool}
            </button>
          </div>

          <div className={styles.stats}>
            <h3 className={styles.sectionTitle}>Vitals</h3>
            <div className={styles.statBar}>
              <span className={styles.statLabel}>Health</span>
              <div className={styles.bar}>
                <div className={styles.barFill} style={{ width: `${bonsai.health}%`, background: '#4CAF50' }} />
              </div>
              <span className={styles.statValue}>{bonsai.health}%</span>
            </div>
            <div className={styles.statBar}>
              <span className={styles.statLabel}>Water</span>
              <div className={styles.bar}>
                <div className={styles.barFill} style={{ width: `${bonsai.water}%`, background: '#2196F3' }} />
              </div>
              <span className={styles.statValue}>{bonsai.water}%</span>
            </div>
            <div className={styles.statBar}>
              <span className={styles.statLabel}>Sunlight</span>
              <div className={styles.bar}>
                <div className={styles.barFill} style={{ width: `${bonsai.sunlight}%`, background: '#FF9800' }} />
              </div>
              <span className={styles.statValue}>{bonsai.sunlight}%</span>
            </div>
          </div>

          <div className={styles.info}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Age</span>
              <span className={styles.infoValue}>{bonsai.age} year{bonsai.age > 1 ? 's' : ''}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Pruned</span>
              <span className={styles.infoValue}>{bonsai.pruned} branches</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Style</span>
              <span className={styles.infoValue}>{BONSAI_STYLES[bonsai.style].name}</span>
            </div>
          </div>

          <div className={styles.actions}>
            <button 
              className={`${styles.growButton} ${isGrowing ? styles.growing : ''}`}
              onClick={growTree}
              disabled={isGrowing}
            >
              {isGrowing ? 'Growing...' : 'Grow Tree'}
            </button>
            <button className={styles.resetButton} onClick={resetBonsai}>
              <RotateCcw size={16} />
              New Bonsai
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
