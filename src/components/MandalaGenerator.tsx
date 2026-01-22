import { useState, useEffect, useRef, useCallback } from 'react';
import { getNearestFibonacci, calculatePulseScale } from '../lib/mandala-math';
import { drawMandala } from '../lib/mandala-renderer';

export default function MandalaGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const [numPetalas, setNumPetalas] = useState(12);
  const [numCamadas, setNumCamadas] = useState(5);
  const [corBase, setCorBase] = useState(180);
  const [complexidade, setComplexidade] = useState(1);
  const [rotacao, setRotacao] = useState(0);
  const [modoFibonacci, setModoFibonacci] = useState(false);
  const [flowerOfLife, setFlowerOfLife] = useState(false);
  const [goldenSpiral, setGoldenSpiral] = useState(false);
  const [fractalMode, setFractalMode] = useState(false);
  const [animar, setAnimar] = useState(false);

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
  const renderizarMandala = useCallback((time: number = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let pulseScale = 1;
    if (animar) {
      pulseScale = calculatePulseScale(time, 0.002, 0.95, 1.05);
    }

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
  }, [numPetalas, numCamadas, corBase, complexidade, rotacao, flowerOfLife, goldenSpiral, fractalMode, animar]);

  const animate = useCallback((time: number) => {
    renderizarMandala(time);
    requestRef.current = requestAnimationFrame(animate);
  }, [renderizarMandala]);

  useEffect(() => {
    if (animar) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      renderizarMandala(0);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animar, animate, renderizarMandala]);

  // Redesenhar quando os parâmetros mudarem (se não estiver animando)
  useEffect(() => {
    if (!animar) {
      renderizarMandala(0);
    }
  }, [renderizarMandala, animar]);

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
            id="animar-mode"
            checked={animar}
            onChange={(e) => setAnimar(e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="animar-mode" className="text-white">Animar (Respiração)</label>
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
