import { useState, useEffect, useRef } from 'react';
import { getNearestFibonacci, calculatePulse } from '../lib/mandala-math';
import { drawMandala, MandalaConfig } from '../lib/mandala-renderer';

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
  const [animating, setAnimating] = useState(false);

  const animationRef = useRef<number>();
  const configRef = useRef<MandalaConfig>();

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
  
  // Atualizar a ref de configuração sempre que o estado mudar
  useEffect(() => {
    const canvas = canvasRef.current;
    configRef.current = {
      numPetalas,
      numCamadas,
      corBase,
      complexidade,
      rotacao,
      width: canvas?.width || 400,
      height: canvas?.height || 400,
      flowerOfLife,
      goldenSpiral,
      fractalMode
    };
  }, [numPetalas, numCamadas, corBase, complexidade, rotacao, flowerOfLife, goldenSpiral, fractalMode]);

  // Função para desenhar a mandala
  const renderizarMandala = () => {
    // Se estiver animando, o loop de animação cuida do desenho
    if (animating) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (configRef.current) {
        drawMandala(ctx, configRef.current);
    }
  };

  // Loop de Animação
  useEffect(() => {
    if (!animating) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      renderizarMandala(); // Garantir que desenhe o estado estático ao parar
      return;
    }

    const startTime = Date.now();
    const animate = () => {
      const time = (Date.now() - startTime) / 1000;
      // Frequência de 0.2Hz (5 segundos por ciclo) e Amplitude 5%
      const pulse = calculatePulse(time, 0.2, 0.05);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && configRef.current) {
        drawMandala(ctx, { ...configRef.current, pulseScale: pulse });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animating]);

  // Redesenhar quando os parâmetros mudarem (e não estiver animando)
  useEffect(() => {
    renderizarMandala();
  }, [numPetalas, numCamadas, corBase, complexidade, rotacao, flowerOfLife, goldenSpiral, fractalMode]);

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
            id="animating"
            checked={animating}
            onChange={(e) => setAnimating(e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="animating" className="text-white">Animar (Respiração/Pulso)</label>
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
