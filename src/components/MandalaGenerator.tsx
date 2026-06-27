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
  const [cymaticsMode, setCymaticsMode] = useState(false);
  const [cymaticsN, setCymaticsN] = useState(3);
  const [cymaticsM, setCymaticsM] = useState(5);
  const [bioluminescenceMode, setBioluminescenceMode] = useState(false);
  const [polarCurveType, setPolarCurveType] = useState<'smooth' | 'sharp' | 'generative'>('generative');
  const [activeAccordion, setActiveAccordion] = useState<string>('estrutura');

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
      eixosSimetria,
      cymaticsMode,
      cymaticsN,
      cymaticsM,
      bioluminescenceMode,
      polarCurveType: polarCurveType !== 'generative' ? polarCurveType : undefined
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
      eixosSimetria,
      cymaticsMode,
      cymaticsN,
      cymaticsM,
      bioluminescenceMode,
      polarCurveType: polarCurveType !== 'generative' ? polarCurveType : undefined
    });
  };

  // Redesenhar quando os parâmetros mudarem
  useEffect(() => {
    renderizarMandala();
  }, [numPetalas, numCamadas, corBase, complexidade, rotacao, currentAutoRotation, formaBase, flowerOfLife, goldenSpiral, fractalMode, tessellation, currentPulseScale, useMoonPhase, moonPhaseAge, modoFibonacciAvancado, simetriaPersonalizada, eixosSimetria, cymaticsMode, cymaticsN, cymaticsM, bioluminescenceMode, polarCurveType]);

  // Redesenhar quando o componente montar
  useEffect(() => {
    renderizarMandala();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 h-full w-full">
      {/* Coluna Esquerda - Controles */}
      <div className="md:col-span-4 h-full overflow-y-auto bg-slate-900/50 backdrop-blur-md border-r border-slate-800 p-6 custom-scrollbar">
        <h2 className="text-xl font-bold mb-6 text-white text-center tracking-wider">MANDALA GENERATOR</h2>

        <div className="space-y-3 w-full">

          {/* Accordion: Estrutura & Geometria */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
            <button
              className="w-full px-4 py-3 flex justify-between items-center bg-slate-800 hover:bg-slate-700 transition-colors"
              onClick={() => setActiveAccordion(activeAccordion === 'estrutura' ? '' : 'estrutura')}
            >
              <span className="font-semibold text-sm">🛠️ Estrutura Geral</span>
              <span>{activeAccordion === 'estrutura' ? '▼' : '▶'}</span>
            </button>

            {activeAccordion === 'estrutura' && (
              <div className="p-4 space-y-4 text-sm bg-slate-900/30">
                <div className="flex flex-col space-y-1">
                  <label className="text-slate-300">Forma Base (Simetria)</label>
                  <select
                    value={formaBase}
                    onChange={(e) => setFormaBase(parseInt(e.target.value))}
                    className="bg-slate-800 text-slate-100 p-1.5 rounded border border-slate-600 focus:ring-purple-500 focus:border-purple-500 text-sm"
                  >
                    <option value={0}>Círculo</option>
                    <option value={3}>Triângulo</option>
                    <option value={4}>Quadrado</option>
                    <option value={5}>Pentágono</option>
                    <option value={6}>Hexágono</option>
                    <option value={8}>Octógono</option>
                    <option value={12}>Dodecágono</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-slate-300 mb-1 text-sm">Formato da Pétala</label>
                  <select
                    value={polarCurveType}
                    onChange={(e) => setPolarCurveType(e.target.value as 'smooth' | 'sharp' | 'generative')}
                    className="bg-slate-800 text-slate-100 p-1.5 rounded border border-slate-600 focus:ring-purple-500 focus:border-purple-500 text-sm"
                  >
                    <option value="generative">Generativo (Cartesiano)</option>
                    <option value="smooth">Suave (Rosa Polar)</option>
                    <option value="sharp">Afiado (Rosa Polar)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label htmlFor="petals-input" className="text-slate-300">Pétalas</label>
                    <span className="text-slate-400">{numPetalas}</span>
                  </div>
                  <input
                    id="petals-input"
                    type="range" min="3" max="24"
                    value={numPetalas}
                    onChange={(e) => handlePetalasChange(parseInt(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-slate-300">Camadas</label>
                    <span className="text-slate-400">{numCamadas}</span>
                  </div>
                  <input
                    type="range" min="1" max="10"
                    value={numCamadas}
                    onChange={(e) => setNumCamadas(parseInt(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-slate-300">Complexidade</label>
                    <span className="text-slate-400">{complexidade.toFixed(1)}</span>
                  </div>
                  <input
                    type="range" min="1" max="3" step="0.1"
                    value={complexidade}
                    onChange={(e) => setComplexidade(parseFloat(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox" id="simetria-personalizada"
                    checked={simetriaPersonalizada}
                    onChange={(e) => setSimetriaPersonalizada(e.target.checked)}
                    className="w-4 h-4 accent-purple-500 bg-slate-800 border-slate-600 rounded"
                  />
                  <label htmlFor="simetria-personalizada" className="text-slate-300">Simetria de Espelho</label>
                </div>

                {simetriaPersonalizada && (
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-slate-300">Eixos</label>
                      <span className="text-slate-400">{eixosSimetria}</span>
                    </div>
                    <input
                      type="range" min="1" max="12" step="1"
                      value={eixosSimetria}
                      onChange={(e) => setEixosSimetria(parseInt(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Accordion: Geometria & Fractais */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
            <button
              className="w-full px-4 py-3 flex justify-between items-center bg-slate-800 hover:bg-slate-700 transition-colors"
              onClick={() => setActiveAccordion(activeAccordion === 'geometria' ? '' : 'geometria')}
            >
              <span className="font-semibold text-sm">📐 Geometria & Fractais</span>
              <span>{activeAccordion === 'geometria' ? '▼' : '▶'}</span>
            </button>

            {activeAccordion === 'geometria' && (
              <div className="p-4 space-y-3 text-sm bg-slate-900/30">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={flowerOfLife} onChange={(e) => setFlowerOfLife(e.target.checked)} className="w-4 h-4 accent-purple-500 rounded" />
                  <span className="text-slate-300">Flor da Vida</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={goldenSpiral} onChange={(e) => setGoldenSpiral(e.target.checked)} className="w-4 h-4 accent-purple-500 rounded" />
                  <span className="text-slate-300">Espiral Áurea</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={tessellation} onChange={(e) => setTessellation(e.target.checked)} className="w-4 h-4 accent-purple-500 rounded" />
                  <span className="text-slate-300">Grade Hexagonal</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={fractalMode} onChange={(e) => setFractalMode(e.target.checked)} className="w-4 h-4 accent-purple-500 rounded" />
                  <span className="text-slate-300">Modo Fractal</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={modoFibonacci} onChange={(e) => setModoFibonacci(e.target.checked)} className="w-4 h-4 accent-purple-500 rounded" />
                  <span className="text-slate-300">Pétalas em Fibonacci</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={modoFibonacciAvancado} onChange={(e) => setModoFibonacciAvancado(e.target.checked)} className="w-4 h-4 accent-purple-500 rounded" />
                  <span className="text-slate-300">Raio em Fibonacci</span>
                </label>
              </div>
            )}
          </div>

          {/* Accordion: Cores & Preenchimento */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
            <button
              className="w-full px-4 py-3 flex justify-between items-center bg-slate-800 hover:bg-slate-700 transition-colors"
              onClick={() => setActiveAccordion(activeAccordion === 'cores' ? '' : 'cores')}
            >
              <span className="font-semibold text-sm">🎨 Cores & Efeitos</span>
              <span>{activeAccordion === 'cores' ? '▼' : '▶'}</span>
            </button>

            {activeAccordion === 'cores' && (
              <div className="p-4 space-y-4 text-sm bg-slate-900/30">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-slate-300">Matiz Base (Hue)</label>
                    <span className="text-slate-400">{corBase}°</span>
                  </div>
                  <input
                    type="range" min="0" max="360"
                    value={corBase}
                    onChange={(e) => setCorBase(parseInt(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-slate-300">Frequência Planetária</label>
                  <select
                    onChange={handlePlanetChange}
                    className="bg-slate-800 text-slate-100 p-1.5 rounded border border-slate-600 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    defaultValue=""
                  >
                    <option value="" disabled>Selecione...</option>
                    {Object.keys(PLANETARY_DATA).map(planet => (
                      <option key={planet} value={planet}>{planet}</option>
                    ))}
                  </select>
                </div>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={bioluminescenceMode} onChange={(e) => setBioluminescenceMode(e.target.checked)} className="w-4 h-4 accent-purple-500 rounded" />
                  <span className="text-slate-300">Bioluminescência (Neon)</span>
                </label>
              </div>
            )}
          </div>

          {/* Accordion: Render & Animação */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
            <button
              className="w-full px-4 py-3 flex justify-between items-center bg-slate-800 hover:bg-slate-700 transition-colors"
              onClick={() => setActiveAccordion(activeAccordion === 'animacao' ? '' : 'animacao')}
            >
              <span className="font-semibold text-sm">✨ Renderização & Animação</span>
              <span>{activeAccordion === 'animacao' ? '▼' : '▶'}</span>
            </button>

            {activeAccordion === 'animacao' && (
              <div className="p-4 space-y-4 text-sm bg-slate-900/30">

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-slate-300">Rotação Estática</label>
                    <span className="text-slate-400">{rotacao}°</span>
                  </div>
                  <input
                    type="range" min="0" max="360"
                    value={rotacao}
                    onChange={(e) => setRotacao(parseInt(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>

                <div className="pt-2 border-t border-slate-700">
                  <label className="flex items-center space-x-2 cursor-pointer mb-2">
                    <input type="checkbox" checked={rotating} onChange={(e) => setRotating(e.target.checked)} className="w-4 h-4 accent-purple-500 rounded" />
                    <span className="text-slate-300">Auto Rotação</span>
                  </label>
                  {rotating && (
                    <input type="range" min="-10" max="10" step="0.5" value={rotationSpeedRPM} onChange={(e) => setRotationSpeedRPM(parseFloat(e.target.value))} className="w-full accent-purple-500" />
                  )}
                </div>

                <div className="pt-2 border-t border-slate-700">
                  <label className="flex items-center space-x-2 cursor-pointer mb-2">
                    <input type="checkbox" checked={pulsing} onChange={(e) => setPulsing(e.target.checked)} className="w-4 h-4 accent-purple-500 rounded" />
                    <span className="text-slate-300">Pulsação / Respiração</span>
                  </label>
                  {pulsing && (
                    <input type="range" min="0.1" max="2.0" step="0.1" value={pulseFrequency} onChange={(e) => setPulseFrequency(parseFloat(e.target.value))} className="w-full accent-purple-500" />
                  )}
                </div>

                <div className="pt-2 border-t border-slate-700">
                  <label className="flex items-center space-x-2 cursor-pointer mb-2">
                    <input type="checkbox" checked={useMoonPhase} onChange={(e) => setUseMoonPhase(e.target.checked)} className="w-4 h-4 accent-purple-500 rounded" />
                    <span className="text-slate-300">Fase da Lua ({getMoonPhaseName(moonPhaseAge)})</span>
                  </label>
                  {useMoonPhase && (
                    <div className="space-y-2">
                      <div className="flex justify-end">
                        <button onClick={() => setMoonPhaseAge(calculateMoonPhase())} className="text-[10px] bg-slate-700 hover:bg-slate-600 text-white py-1 px-2 rounded">Fase de Hoje</button>
                      </div>
                      <input type="range" min="0" max="29.53" step="0.1" value={moonPhaseAge} onChange={(e) => setMoonPhaseAge(parseFloat(e.target.value))} className="w-full accent-purple-500" />
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-700">
                  <label className="flex items-center space-x-2 cursor-pointer mb-2">
                    <input type="checkbox" checked={cymaticsMode} onChange={(e) => setCymaticsMode(e.target.checked)} className="w-4 h-4 accent-purple-500 rounded" />
                    <span className="text-slate-300">Cimática (Chladni)</span>
                  </label>
                  {cymaticsMode && (
                    <div className="space-y-2 pl-6">
                      <div className="flex justify-between">
                        <label className="text-xs text-slate-400">Freq N</label>
                        <span className="text-xs text-slate-400">{cymaticsN}</span>
                      </div>
                      <input type="range" min="1" max="10" step="1" value={cymaticsN} onChange={(e) => setCymaticsN(parseInt(e.target.value))} className="w-full accent-purple-500" />
                      <div className="flex justify-between">
                        <label className="text-xs text-slate-400">Freq M</label>
                        <span className="text-xs text-slate-400">{cymaticsM}</span>
                      </div>
                      <input type="range" min="1" max="10" step="1" value={cymaticsM} onChange={(e) => setCymaticsM(parseInt(e.target.value))} className="w-full accent-purple-500" />
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

        </div>
      </div>

      {/* Coluna Direita - Visualização */}
      <div className="md:col-span-8 h-full relative flex flex-col items-center justify-center bg-slate-950 p-4 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={1024}
          height={1024}
          className="w-full max-w-[85vh] aspect-square rounded-2xl shadow-2xl border border-slate-800 bg-black/50"
        />
        
        {/* Floating Action Bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 bg-slate-900/80 backdrop-blur-md border border-slate-700 p-3 rounded-2xl shadow-2xl z-10">
          <button
            onClick={gerarMandalaAleatoria}
            className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold py-2.5 px-6 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)]"
          >
            🎲 Gerar Aleatória
          </button>
          <button
            onClick={handleDownload}
            className="bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold py-2.5 px-6 rounded-xl transition-all duration-300"
          >
            💾 Exportar PNG
          </button>
        </div>
      </div>
    </div>
  );
}
