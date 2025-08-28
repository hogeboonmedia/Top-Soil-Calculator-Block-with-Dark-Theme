import React, { useState } from 'react';
import { Calculator, ArrowRight } from 'lucide-react';
interface CalculationResult {
  volume: number;
  bags: number;
  tons: number;
}
export const TopsoilCalculator = () => {
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [depth, setDepth] = useState<string>('');
  const [unit, setUnit] = useState<string>('feet');
  const [depthUnit, setDepthUnit] = useState<string>('inches');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string>('');
  const calculateTopsoil = () => {
    setError('');
    // Validate inputs
    if (!length || !width || !depth) {
      setError('Please fill in all dimensions');
      return;
    }
    const lengthNum = parseFloat(length);
    const widthNum = parseFloat(width);
    const depthNum = parseFloat(depth);
    if (isNaN(lengthNum) || isNaN(widthNum) || isNaN(depthNum)) {
      setError('Please enter valid numbers');
      return;
    }
    if (lengthNum <= 0 || widthNum <= 0 || depthNum <= 0) {
      setError('Dimensions must be greater than zero');
      return;
    }
    // Convert all to cubic feet first
    let volumeInCubicFeet = 0;
    if (unit === 'feet') {
      volumeInCubicFeet = lengthNum * widthNum;
    } else if (unit === 'yards') {
      volumeInCubicFeet = lengthNum * widthNum * 9; // 1 yard = 3 feet, so 3x3 = 9 sq feet
    } else if (unit === 'meters') {
      volumeInCubicFeet = lengthNum * widthNum * 10.764; // 1 sq meter = 10.764 sq feet
    }
    // Add depth to calculation
    if (depthUnit === 'inches') {
      volumeInCubicFeet = volumeInCubicFeet * (depthNum / 12); // Convert inches to feet
    } else if (depthUnit === 'feet') {
      volumeInCubicFeet = volumeInCubicFeet * depthNum;
    } else if (depthUnit === 'yards') {
      volumeInCubicFeet = volumeInCubicFeet * (depthNum * 3); // Convert yards to feet
    }
    // Convert to cubic yards (27 cubic feet = 1 cubic yard)
    const volumeInCubicYards = volumeInCubicFeet / 27;
    // Estimate bags (1 bag ≈ 0.5 cubic feet)
    const bagsEstimate = Math.ceil(volumeInCubicFeet / 0.5);
    // Estimate tons (1 cubic yard ≈ 1.4 tons, depends on moisture and composition)
    const tonsEstimate = volumeInCubicYards * 1.4;
    setResult({
      volume: parseFloat(volumeInCubicYards.toFixed(2)),
      bags: bagsEstimate,
      tons: parseFloat(tonsEstimate.toFixed(2))
    });
  };
  const resetCalculator = () => {
    setLength('');
    setWidth('');
    setDepth('');
    setUnit('feet');
    setDepthUnit('inches');
    setResult(null);
    setError('');
  };
  return <div className="w-full bg-black text-white border border-gray-700 rounded-lg p-6 max-w-md mx-auto">
      <div className="flex items-center mb-6 border-b border-dashed border-gray-700 pb-4">
        <Calculator className="mr-3 text-red-500" />
        <h2 className="text-xl font-bold">Topsoil Calculator</h2>
      </div>
      <div className="space-y-4">
        {/* Length and Width inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Length</label>
            <input type="number" value={length} onChange={e => setLength(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-2 focus:outline-none focus:border-red-500" placeholder="Length" />
          </div>
          <div>
            <label className="block text-sm mb-1">Width</label>
            <input type="number" value={width} onChange={e => setWidth(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-2 focus:outline-none focus:border-red-500" placeholder="Width" />
          </div>
        </div>
        {/* Unit selector */}
        <div>
          <label className="block text-sm mb-1">Unit</label>
          <select value={unit} onChange={e => setUnit(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-2 focus:outline-none focus:border-red-500">
            <option value="feet">Feet</option>
            <option value="yards">Yards</option>
            <option value="meters">Meters</option>
          </select>
        </div>
        {/* Depth input */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Depth</label>
            <input type="number" value={depth} onChange={e => setDepth(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-2 focus:outline-none focus:border-red-500" placeholder="Depth" />
          </div>
          <div>
            <label className="block text-sm mb-1">Depth Unit</label>
            <select value={depthUnit} onChange={e => setDepthUnit(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-2 focus:outline-none focus:border-red-500">
              <option value="inches">Inches</option>
              <option value="feet">Feet</option>
              <option value="yards">Yards</option>
            </select>
          </div>
        </div>
        {/* Error message */}
        {error && <div className="border border-dashed border-gray-700 rounded p-3 bg-gray-900">
            <p className="text-red-500 text-sm">{error}</p>
          </div>}
        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button onClick={resetCalculator} className="border border-gray-700 rounded py-2 px-4 hover:bg-gray-900">
            Reset
          </button>
          <button onClick={calculateTopsoil} className="bg-red-600 text-white rounded py-2 px-4 hover:bg-red-700 flex items-center justify-center">
            Calculate <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
        {/* Results */}
        {result && <div className="mt-6 border border-dashed border-gray-700 rounded p-4 bg-gray-900">
            <h3 className="text-lg font-bold mb-3 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              Results
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Volume:</span>
                <span className="font-bold">{result.volume} cubic yards</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Estimated Bags:</span>
                <span className="font-bold">{result.bags} bags</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Estimated Weight:</span>
                <span className="font-bold">{result.tons} tons</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Note: Actual amounts may vary based on soil composition and
              moisture content.
            </div>
          </div>}
      </div>
    </div>;
};