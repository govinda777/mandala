import { useState, useEffect, useRef } from 'react';
import { getNearestFibonacci, calculatePulse } from '../lib/mandala-math';
import { drawMandala } from '../lib/mandala-renderer';

export default function MandalaGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [numPetalas, setNumPetalas] = useState(12);
  const [numCamadas, setNumCamadas] = useState(5);
  const [corBase, setCorBase] = useState(180);
  const [complexidade, setComplexidade] = useState(1);
  const [rotacao, setRotacao] = useState(0);
  const [modoFibonacci, setModoFibonacci] = useState(false);
  const [flowerOfLife, setFlowerOfLife] = useState(false);
  const [goldenSpiral, setGoldenSpiral] = useState(false);
  const [fractalMode, setFractalMode] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [pulseScale, setPulseScale] = useState(1);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isAnimating) {
      const startTime = Date.now();
      const animate = () => {
        const currentTime = (Date.now() - startTime) / 1000;
        // Pulse freq 0.2Hz (5 sec period), amplitude 0.05
        const scale = calculatePulse(currentTime, 0.2, 0.05);
        setPulseScale(scale);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setPulseScale(1);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isAnimating]);

  useEffect(() => {
    if (modoFibonacci) {
      setNumPetalas(prev => getNearestFibonacci(prev));
    }
  }, [modoFibonacci]);

  const handlePetalasChange = (valor: number) => {
    if (modoFibonacci) {
      setNumPetalas(getNearestFibonacci(valor));
    } else {
      setNumPetalas(valor);
    }
  };

  // Gerar mandala aleatória complexa
  const gerarMandalaAleatoria = () => {
    let novasPetalas = Math.floor(Math.random() * 18) + 6;
    if (modoFibonacci) {
      novasPetalas = getNearestFibonacci(novasPetalas);
    }
    setNumPetalas(novasPetalas); // 6-24 pétalas (ou Fibonacci)
    setNumCamadas(Math.floor(Math.random() * 6) + 4);  // 4-10 camadas
    setCorBase(Math.floor(Math.random() * 360));       // Cor base aleatória
    setComplexidade(Math.random() * 2 + 1);           // Complexidade entre 1-3
    setRotacao(Math.random() * 360);                  // Rotação aleatória
  };
  
  // Função para desenhar a mandala
  const renderizarMandala = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawMandala(ctx, {
      numPetalas,
      numCamadas,
      corBase,
      complexidade,
      rotacao,
      width: canvas.width,
      height: canvas.height,
      flowerOfLife,
      goldenSpiral,
      fractalMode,
      pulseScale
    });
  };

  // Redesenhar quando os parâmetros mudarem
  useEffect(() => {
    renderizarMandala();
  }, [numPetalas, numCamadas, corBase, complexidade, rotacao, flowerOfLife, goldenSpiral, fractalMode, pulseScale]);

  // Redesenhar quando o componente montar
  useEffect(() => {
    renderizarMandala();
  }, []);

  return (
    <div className="flex flex-col items-center bg-gray-800 p-6 rounded-lg">
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={400} 
        className="border border-gray-600 bg-gray-900 shadow-lg rounded-lg"
      />
      
      <div className="mt-4 space-y-4 w-full max-w-md">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="fibonacci-mode"
            checked={modoFibonacci}
            onChange={(e) => setModoFibonacci(e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="fibonacci-mode" className="text-white">Modo Fibonacci</label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="flower-of-life"
            checked={flowerOfLife}
            onChange={(e) => setFlowerOfLife(e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="flower-of-life" className="text-white">Flor da Vida (Geometria Sagrada)</label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="golden-spiral"
            checked={goldenSpiral}
            onChange={(e) => setGoldenSpiral(e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="golden-spiral" className="text-white">Espiral Áurea (Proporção de Ouro)</label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="fractal-mode"
            checked={fractalMode}
            onChange={(e) => setFractalMode(e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="fractal-mode" className="text-white">Modo Fractal (Círculos Recursivos)</label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="animation-mode"
            checked={isAnimating}
            onChange={(e) => setIsAnimating(e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="animation-mode" className="text-white">Animação (Respiração)</label>
        </div>

        <div>
          <label htmlFor="petals-input" className="block text-white mb-2">
            Pétalas: {numPetalas}
          </label>
          <input 
            id="petals-input"
            type="range" 
            min="3" 
            max="24" 
            value={numPetalas} 
            onChange={(e) => handlePetalasChange(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-white mb-2">
            Camadas: {numCamadas}
          </label>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={numCamadas} 
            onChange={(e) => setNumCamadas(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-white mb-2">
            Cor Base: {corBase}°
          </label>
          <input 
            type="range" 
            min="0" 
            max="360" 
            value={corBase} 
            onChange={(e) => setCorBase(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-white mb-2">
            Complexidade: {complexidade.toFixed(1)}
          </label>
          <input 
            type="range" 
            min="1" 
            max="3" 
            step="0.1" 
            value={complexidade} 
            onChange={(e) => setComplexidade(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-white mb-2">
            Rotação: {rotacao}°
          </label>
          <input 
            type="range" 
            min="0" 
            max="360" 
            value={rotacao} 
            onChange={(e) => setRotacao(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        
        <button 
          onClick={gerarMandalaAleatoria}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
        >
          Gerar Mandala Aleatória
        </button>
      </div>
    </div>
  );
}
