import { useState, useEffect, useRef } from 'react';
import { getNearestFibonacci, calculatePulseScale, calculateAutoRotation, getPlanetaryConfig, PLANETARY_DATA, calculateMoonPhase, getMoonPhaseName } from '../lib/mandala-math';
import { drawMandala } from '../lib/mandala-renderer';
import { generateHighResDataURL, triggerDownload } from '../lib/mandala-export';

export default function MandalaGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [numPetalas, setNumPetalas] = useState(12);
  const [numCamadas, setNumCamadas] = useState(5);
  const [corBase, setCorBase] = useState(180);
  const [complexidade, setComplexidade] = useState(1);
  const [rotacao, setRotacao] = useState(0);
  const [modoFibonacci, setModoFibonacci] = useState(false);
  const [modoFibonacciAvancado, setModoFibonacciAvancado] = useState(false);
  const [flowerOfLife, setFlowerOfLife] = useState(false);
  const [goldenSpiral, setGoldenSpiral] = useState(false);
  const [fractalMode, setFractalMode] = useState(false);
  const [tessellation, setTessellation] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const [pulseFrequency, setPulseFrequency] = useState(0.2); // Hz
  const [currentPulseScale, setCurrentPulseScale] = useState(1);
  const [rotating, setRotating] = useState(false);
  const [rotationSpeedRPM, setRotationSpeedRPM] = useState(1); // RPM
  const [currentAutoRotation, setCurrentAutoRotation] = useState(0);
  const [useMoonPhase, setUseMoonPhase] = useState(false);
  const [moonPhaseAge, setMoonPhaseAge] = useState(14.76); // Full moon by default
  const [formaBase, setFormaBase] = useState(0); // 0 = Circle
  const [simetriaPersonalizada, setSimetriaPersonalizada] = useState(false);
  const [eixosSimetria, setEixosSimetria] = useState(2);

  // Animation Loop
  useEffect(() => {
    let animationId: number;
    let startTime: number | null = null;
    let initialRotation = currentAutoRotation; // Keep track of the rotation when we paused/resumed

    const animate = (time: number) => {
      let requiresNextFrame = false;

      if (pulsing) {
        const scale = calculatePulseScale(time, pulseFrequency);
        setCurrentPulseScale(scale);
        requiresNextFrame = true;
      }

      if (rotating) {
        if (startTime === null) startTime = time;
        const elapsed = time - startTime;
        const additionalRotation = calculateAutoRotation(elapsed, rotationSpeedRPM);
        setCurrentAutoRotation((initialRotation + additionalRotation) % 360);
        requiresNextFrame = true;
      }

      if (requiresNextFrame) {
        animationId = requestAnimationFrame(animate);
      }
    };

    if (pulsing || rotating) {
      animationId = requestAnimationFrame(animate);
    } else {
      if (!pulsing) setCurrentPulseScale(1);
      // We don't reset currentAutoRotation so it stops where it is
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [pulsing, pulseFrequency, rotating, rotationSpeedRPM]); // Removed initialRotation and currentAutoRotation to avoid reset loops

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

  const handlePlanetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const planetName = e.target.value;
    if (!planetName) return;

    const config = getPlanetaryConfig(planetName);
    if (config) {
      setCorBase(config.baseHue);
      setPulseFrequency(config.frequencyHz);
      setPulsing(true);
    }
  };

  const handleDownload = async () => {
    const config = {
      numPetalas,
      numCamadas,
      corBase,
      complexidade,
      rotacao,
      width: 0, // Will be overridden
      height: 0, // Will be overridden
      formaBase: formaBase > 0 ? formaBase : undefined,
      flowerOfLife,
      goldenSpiral,
      fractalMode,
      tessellation,
      pulseScale: currentPulseScale,
      moonPhaseAge: useMoonPhase ? moonPhaseAge : undefined,
      fibonacciAdvancedMode: modoFibonacciAvancado,
      simetriaPersonalizada,
      eixosSimetria
    };

    const width = 2048;
    const height = 2048;
    const dataUrl = await generateHighResDataURL(config, width, height);
    triggerDownload(dataUrl, `mandala-${Date.now()}.png`);
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
      rotacao: rotacao + currentAutoRotation,
      width: canvas.width,
      height: canvas.height,
      formaBase: formaBase > 0 ? formaBase : undefined,
      flowerOfLife,
      goldenSpiral,
      fractalMode,
      tessellation,
      pulseScale: currentPulseScale,
      moonPhaseAge: useMoonPhase ? moonPhaseAge : undefined,
      fibonacciAdvancedMode: modoFibonacciAvancado,
      simetriaPersonalizada,
      eixosSimetria
    });
  };

  // Redesenhar quando os parâmetros mudarem
  useEffect(() => {
    renderizarMandala();
  }, [numPetalas, numCamadas, corBase, complexidade, rotacao, currentAutoRotation, formaBase, flowerOfLife, goldenSpiral, fractalMode, tessellation, currentPulseScale, useMoonPhase, moonPhaseAge, modoFibonacciAvancado, simetriaPersonalizada, eixosSimetria]);

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
        <div className="flex flex-col space-y-2">
          <label className="text-white">Forma Base (Simetria Poligonal)</label>
          <select
            value={formaBase}
            onChange={(e) => setFormaBase(parseInt(e.target.value))}
            className="bg-gray-700 text-white p-2 rounded border border-gray-600 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value={0}>Círculo (Padrão)</option>
            <option value={3}>Triângulo</option>
            <option value={4}>Quadrado</option>
            <option value={5}>Pentágono</option>
            <option value={6}>Hexágono</option>
            <option value={8}>Octógono</option>
            <option value={12}>Dodecágono</option>
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-white">Frequência Planetária</label>
          <select
            onChange={handlePlanetChange}
            className="bg-gray-700 text-white p-2 rounded border border-gray-600 focus:ring-purple-500 focus:border-purple-500"
            defaultValue=""
          >
            <option value="" disabled>Selecione um Planeta</option>
            {Object.keys(PLANETARY_DATA).map(planet => (
              <option key={planet} value={planet}>{planet}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="simetria-personalizada"
            checked={simetriaPersonalizada}
            onChange={(e) => setSimetriaPersonalizada(e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="simetria-personalizada" className="text-white">Simetria Personalizada (Caleidoscópio)</label>
        </div>

        {simetriaPersonalizada && (
          <div>
            <label className="block text-white mb-2">
              Eixos de Simetria: {eixosSimetria}
            </label>
            <input
              type="range"
              min="1"
              max="12"
              step="1"
              value={eixosSimetria}
              onChange={(e) => setEixosSimetria(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="rotating-mode"
            checked={rotating}
            onChange={(e) => setRotating(e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="rotating-mode" className="text-white">Animação de Rotação (Girar)</label>
        </div>

        {rotating && (
          <div>
            <label className="block text-white mb-2">
              Velocidade de Rotação: {rotationSpeedRPM} RPM
            </label>
            <input
              type="range"
              min="-10"
              max="10"
              step="0.5"
              value={rotationSpeedRPM}
              onChange={(e) => setRotationSpeedRPM(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="tessellation-mode"
            checked={tessellation}
            onChange={(e) => setTessellation(e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="tessellation-mode" className="text-white">Tesselação (Grade Hexagonal)</label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="fibonacci-mode"
            checked={modoFibonacci}
            onChange={(e) => setModoFibonacci(e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="fibonacci-mode" className="text-white">Modo Fibonacci (Pétalas)</label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="fibonacci-advanced-mode"
            checked={modoFibonacciAvancado}
            onChange={(e) => setModoFibonacciAvancado(e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="fibonacci-advanced-mode" className="text-white">Modo Fibonacci Avançado (Raio)</label>
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
          <label>
            <input
              type="checkbox"
              checked={goldenSpiral}
              onChange={(e) => setGoldenSpiral(e.target.checked)}
              className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 mr-2"
            />
            <span className="text-white">Exibir Espiral Áurea</span>
          </label>
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
            id="pulsing-mode"
            checked={pulsing}
            onChange={(e) => setPulsing(e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="pulsing-mode" className="text-white">Animação de Respiração/Pulsação</label>
        </div>

        {pulsing && (
          <div>
            <label className="block text-white mb-2">
              Velocidade da Respiração: {pulseFrequency} Hz
            </label>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.1"
              value={pulseFrequency}
              onChange={(e) => setPulseFrequency(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="moon-phase-mode"
            checked={useMoonPhase}
            onChange={(e) => setUseMoonPhase(e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="moon-phase-mode" className="text-white">Influência da Fase da Lua</label>
        </div>

        {useMoonPhase && (
          <div className="bg-gray-700 p-3 rounded-lg border border-gray-600">
            <div className="flex justify-between items-center mb-2">
              <label className="text-white">
                Fase: {getMoonPhaseName(moonPhaseAge)} ({(moonPhaseAge).toFixed(1)} dias)
              </label>
              <button
                onClick={() => setMoonPhaseAge(calculateMoonPhase())}
                className="text-xs bg-purple-600 hover:bg-purple-700 text-white font-semibold py-1 px-2 rounded transition-colors duration-300"
              >
                Fase de Hoje
              </button>
            </div>
            <input
              type="range"
              min="0"
              max="29.53"
              step="0.1"
              value={moonPhaseAge}
              onChange={(e) => setMoonPhaseAge(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        )}

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

        <button
          onClick={handleDownload}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
        >
          Baixar Alta Resolução (PNG)
        </button>
      </div>
    </div>
  );
}
