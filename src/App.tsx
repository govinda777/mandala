import MandalaGenerator from './components/MandalaGenerator'

function App() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center text-white mb-8">Mandala Generator</h1>
        <div className="flex justify-center">
          <MandalaGenerator />
        </div>
      </div>
    </div>
  )
}

export default App
