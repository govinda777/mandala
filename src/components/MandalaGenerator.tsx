import { useState, useEffect, useRef } from 'react';

export default function MandalaGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [numPetalas, setNumPetalas] = useState(12);
  const [numCamadas, setNumCamadas] = useState(5);
  const [corBase, setCorBase] = useState(180);
  const [complexidade, setComplexidade] = useState(1);
  const [rotacao, setRotacao] = useState(0);
  const [modoFibonacci, setModoFibonacci] = useState(false);

  // Fibonacci numbers up to standard petal range
  const fibonacciNumbers = [3, 5, 8, 13, 21, 34, 55, 89];

  // Helper to find nearest Fibonacci number
  const getNearestFibonacci = (n: number) => {
    return fibonacciNumbers.reduce((prev, curr) =>
      Math.abs(curr - n) < Math.abs(prev - n) ? curr : prev
    );
  };

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
  const desenharMandala = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tamanho = Math.min(400, 400) * 0.9 / 2;
    
    // Limpar o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Mover para o centro do canvas
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotacao * Math.PI / 180);
    
    // Desenhar camadas da mandala
    for (let camada = 1; camada <= numCamadas; camada++) {
      // Calcular raio da camada atual
      const raio = (tamanho / numCamadas) * camada;
      
      // Definir cores para esta camada
      const matiz = (corBase + camada * 360 / numCamadas) % 360;
      const corInterna = `hsl(${matiz}, 70%, 50%)`;
      const corExterna = `hsl(${(matiz + 30) % 360}, 70%, 50%)`;
      
      // Aumentar num de pétalas com base na complexidade para camadas mais internas
      const petalasCamada = Math.floor(numPetalas * (1 + (complexidade - 1) * (1 - camada/numCamadas) * 0.5));
      
      // Desenhar pétalas para esta camada
      desenharPetalas(ctx, petalasCamada, raio, raio * 0.8, corInterna, corExterna, complexidade);
      
      // Desenhar círculo interno desta camada
      ctx.beginPath();
      ctx.arc(0, 0, raio * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${(matiz + 60) % 360}, 70%, 50%, 0.5)`;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Adicionar detalhes extras baseados em complexidade
      if (complexidade > 1.5 && camada % 2 === 0) {
        desenharPadraoDetalhes(ctx, petalasCamada * 2, raio * 0.6, matiz);
      }
    }
    
    // Desenhar círculos concêntricos decorativos
    desenharCirculosCentrais(ctx, numCamadas, tamanho, complexidade);
    
    // Restaurar a transformação
    ctx.restore();
  };

  // Função auxiliar para desenhar pétalas em uma camada
  const desenharPetalas = (ctx: CanvasRenderingContext2D, numPetalas: number, raioExterno: number, raioInterno: number, corInterna: string, corExterna: string, complexidade: number) => {
    const anguloIncremento = (Math.PI * 2) / numPetalas;
    
    for (let i = 0; i < numPetalas; i++) {
      const angulo = i * anguloIncremento;
      
      // Criar um gradiente para cada pétala
      const gradiente = ctx.createRadialGradient(0, 0, raioInterno * 0.2, 0, 0, raioExterno);
      gradiente.addColorStop(0, corInterna);
      gradiente.addColorStop(1, corExterna);
      
      // Desenhar uma pétala
      ctx.beginPath();
      ctx.moveTo(0, 0);
      
      // Ajustar forma das pétalas baseado em complexidade
      const ajusteForma = 1 + (complexidade - 1) * 0.4;
      
      // Calcular pontos de controle para a curva de Bézier
      const x1 = Math.cos(angulo - anguloIncremento / 4) * raioExterno;
      const y1 = Math.sin(angulo - anguloIncremento / 4) * raioExterno;
      const x2 = Math.cos(angulo + anguloIncremento / 4) * raioExterno;
      const y2 = Math.sin(angulo + anguloIncremento / 4) * raioExterno;
      const xm = Math.cos(angulo) * raioExterno * ajusteForma;
      const ym = Math.sin(angulo) * raioExterno * ajusteForma;
      
      // Desenhar a curva
      ctx.quadraticCurveTo(xm, ym, x1, y1);
      ctx.lineTo(0, 0);
      ctx.quadraticCurveTo(xm, ym, x2, y2);
      ctx.lineTo(0, 0);
      
      // Preencher e contornar a pétala
      ctx.fillStyle = gradiente;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Desenhar detalhes adicionais
      if (raioExterno > 50) {
        // Adicionar pontos decorativos
        ctx.beginPath();
        ctx.arc(Math.cos(angulo) * raioExterno * 0.7, 
                Math.sin(angulo) * raioExterno * 0.7, 
                raioExterno * 0.05, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
        
        // Adicionar linhas decorativas baseadas na complexidade
        if (complexidade > 1.2) {
          const numLinhas = Math.floor(complexidade);
          for (let j = 1; j <= numLinhas; j++) {
            const raioLinha = raioExterno * (0.3 + j * 0.2);
            if (raioLinha < raioExterno) {
              ctx.beginPath();
              ctx.moveTo(Math.cos(angulo) * raioLinha * 0.7, Math.sin(angulo) * raioLinha * 0.7);
              ctx.lineTo(Math.cos(angulo + anguloIncremento * 0.3) * raioLinha * 0.8, 
                          Math.sin(angulo + anguloIncremento * 0.3) * raioLinha * 0.8);
              ctx.strokeStyle = `hsla(${parseInt(corInterna.slice(4)) + 30}, 80%, 60%, 0.4)`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }
      }
    }
  };

  const desenharPadraoDetalhes = (ctx: CanvasRenderingContext2D, numElementos: number, raio: number, matiz: number) => {
    const anguloIncremento = (Math.PI * 2) / numElementos;
    
    for (let i = 0; i < numElementos; i++) {
      const angulo = i * anguloIncremento;
      const x = Math.cos(angulo) * raio;
      const y = Math.sin(angulo) * raio;
      
      // Desenhar pequenos círculos ou outras formas
      ctx.beginPath();
      
      // Alternar entre diferentes formas decorativas
      if (i % 3 === 0) {
        // Pequeno círculo
        ctx.arc(x, y, raio * 0.05, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${(matiz + 120) % 360}, 70%, 60%, 0.6)`;
        ctx.fill();
      } else if (i % 3 === 1) {
        // Pequeno losango
        ctx.moveTo(x, y - raio * 0.06);
        ctx.lineTo(x + raio * 0.06, y);
        ctx.lineTo(x, y + raio * 0.06);
        ctx.lineTo(x - raio * 0.06, y);
        ctx.closePath();
        ctx.fillStyle = `hsla(${(matiz + 60) % 360}, 70%, 60%, 0.6)`;
        ctx.fill();
      } else {
        // Linha radiante
        ctx.moveTo(x * 0.8, y * 0.8);
        ctx.lineTo(x * 1.1, y * 1.1);
        ctx.strokeStyle = `hsla(${(matiz + 180) % 360}, 70%, 60%, 0.6)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  };

  // Função para desenhar círculos concêntricos decorativos no centro
  const desenharCirculosCentrais = (ctx: CanvasRenderingContext2D, numCamadas: number, tamanho: number, complexidade: number) => {
    // Número de círculos baseado na complexidade
    const numCirculos = Math.floor(numCamadas * complexidade);
    
    // Desenhar círculos concêntricos no centro
    for (let i = 0; i < numCirculos; i++) {
      const raio = tamanho * (0.1 - i * 0.015 / Math.sqrt(complexidade));
      if (raio <= 0) break;
      
      ctx.beginPath();
      ctx.arc(0, 0, raio, 0, Math.PI * 2);
      
      // Cores mais variadas baseadas na complexidade
      if (complexidade > 2 && i % 3 === 0) {
        ctx.fillStyle = `hsla(${(corBase + i * 30) % 360}, 70%, 50%, 0.4)`;
      } else if (i % 2 === 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      }
      
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    // Adicionar um ponto central
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    
    // Adicionar padrão radiante no centro quando complexidade alta
    if (complexidade > 1.7) {
      const numRaios = Math.floor(numPetalas * 1.5);
      const anguloRaio = (Math.PI * 2) / numRaios;
      const raioInt = tamanho * 0.15;
      
      for (let i = 0; i < numRaios; i++) {
        const angulo = i * anguloRaio;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angulo) * raioInt * 0.5, Math.sin(angulo) * raioInt * 0.5);
        ctx.lineTo(Math.cos(angulo) * raioInt, Math.sin(angulo) * raioInt);
        ctx.strokeStyle = `hsla(${(corBase + i * 10) % 360}, 80%, 60%, 0.6)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  };

  // Redesenhar quando os parâmetros mudarem
  useEffect(() => {
    desenharMandala();
  }, [numPetalas, numCamadas, corBase, complexidade, rotacao]);

  // Redesenhar quando o componente montar
  useEffect(() => {
    desenharMandala();
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
