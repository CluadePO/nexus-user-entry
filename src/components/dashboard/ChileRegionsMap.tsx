import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, TrendingUp } from 'lucide-react';

interface RegionData {
  id: string;
  name: string;
  trend: string;
  searches: number;
  isTrending: boolean;
}

const regionsData: RegionData[] = [
  { id: 'arica', name: 'Arica y Parinacota', trend: 'Minería', searches: 145, isTrending: false },
  { id: 'tarapaca', name: 'Tarapacá', trend: 'Logística', searches: 267, isTrending: true },
  { id: 'antofagasta', name: 'Antofagasta', trend: 'Minería', searches: 456, isTrending: true },
  { id: 'atacama', name: 'Atacama', trend: 'Energía Solar', searches: 189, isTrending: false },
  { id: 'coquimbo', name: 'Coquimbo', trend: 'Agricultura', searches: 178, isTrending: false },
  { id: 'valparaiso', name: 'Valparaíso', trend: 'Tecnología', searches: 534, isTrending: true },
  { id: 'metropolitana', name: 'Metropolitana', trend: 'Liderazgo', searches: 1267, isTrending: true },
  { id: 'ohiggins', name: "O'Higgins", trend: 'Agroindustria', searches: 198, isTrending: false },
  { id: 'maule', name: 'Maule', trend: 'Agroindustria', searches: 187, isTrending: false },
  { id: 'nuble', name: 'Ñuble', trend: 'Comercio', searches: 156, isTrending: false },
  { id: 'biobio', name: 'Biobío', trend: 'Industria', searches: 389, isTrending: true },
  { id: 'araucania', name: 'La Araucanía', trend: 'Turismo', searches: 178, isTrending: false },
  { id: 'rios', name: 'Los Ríos', trend: 'Silvicultura', searches: 145, isTrending: false },
  { id: 'lagos', name: 'Los Lagos', trend: 'Acuicultura', searches: 223, isTrending: true },
  { id: 'aysen', name: 'Aysén', trend: 'Turismo', searches: 134, isTrending: false },
  { id: 'magallanes', name: 'Magallanes', trend: 'Energía Eólica', searches: 128, isTrending: false },
];

// Colors matching sidebar theme
const BASE_COLOR = 'hsl(186, 30%, 75%)'; // Neutral teal - lighter
const TRENDING_COLOR = 'hsl(186, 69%, 28%)'; // Dark teal - matches sidebar
const HOVER_BASE = 'hsl(186, 35%, 65%)';
const HOVER_TRENDING = 'hsl(186, 69%, 23%)';

export const ChileRegionsMap: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(regionsData[6]); // Metropolitana by default
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const getRegionColor = (regionId: string) => {
    const region = regionsData.find(r => r.id === regionId);
    if (!region) return BASE_COLOR;
    
    const isHovered = hoveredRegion === regionId;
    const isSelected = selectedRegion?.id === regionId;
    
    if (region.isTrending) {
      return isHovered || isSelected ? HOVER_TRENDING : TRENDING_COLOR;
    }
    return isHovered || isSelected ? HOVER_BASE : BASE_COLOR;
  };

  const handleRegionClick = (regionId: string) => {
    const region = regionsData.find(r => r.id === regionId);
    if (region) setSelectedRegion(region);
  };

  const trendingRegions = regionsData.filter(r => r.isTrending).sort((a, b) => b.searches - a.searches);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="h-4 w-4 text-primary" />
          Tendencias de capacitación por región
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          {/* Chile Map SVG - More realistic shape */}
          <div className="flex-shrink-0 w-20">
            <svg 
              viewBox="0 0 80 450" 
              className="w-full h-[380px]"
              style={{ filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.1))' }}
            >
              {/* Arica y Parinacota - XV */}
              <path
                d="M35 8 Q42 5 48 8 L50 12 Q48 16 45 18 L38 18 Q35 16 33 12 Z"
                fill={getRegionColor('arica')}
                stroke="white"
                strokeWidth="0.8"
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleRegionClick('arica')}
                onMouseEnter={() => setHoveredRegion('arica')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              {/* Tarapacá - I */}
              <path
                d="M33 18 L45 18 Q50 22 52 28 L53 38 Q50 42 47 44 L36 44 Q32 40 30 35 L30 25 Q31 20 33 18 Z"
                fill={getRegionColor('tarapaca')}
                stroke="white"
                strokeWidth="0.8"
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleRegionClick('tarapaca')}
                onMouseEnter={() => setHoveredRegion('tarapaca')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              {/* Antofagasta - II */}
              <path
                d="M30 44 L47 44 Q52 48 55 55 L57 75 Q55 85 52 90 L45 92 L32 92 Q27 88 25 80 L24 60 Q26 50 30 44 Z"
                fill={getRegionColor('antofagasta')}
                stroke="white"
                strokeWidth="0.8"
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleRegionClick('antofagasta')}
                onMouseEnter={() => setHoveredRegion('antofagasta')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              {/* Atacama - III */}
              <path
                d="M25 92 L45 92 Q50 95 52 100 L54 120 Q52 130 48 135 L38 137 L28 135 Q23 130 22 120 L22 100 Q23 95 25 92 Z"
                fill={getRegionColor('atacama')}
                stroke="white"
                strokeWidth="0.8"
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleRegionClick('atacama')}
                onMouseEnter={() => setHoveredRegion('atacama')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              {/* Coquimbo - IV */}
              <path
                d="M22 137 L48 137 Q53 142 55 150 L56 165 Q54 172 50 176 L42 178 L30 177 Q24 173 22 165 L20 150 Q21 142 22 137 Z"
                fill={getRegionColor('coquimbo')}
                stroke="white"
                strokeWidth="0.8"
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleRegionClick('coquimbo')}
                onMouseEnter={() => setHoveredRegion('coquimbo')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              {/* Valparaíso - V */}
              <path
                d="M20 178 L50 178 Q56 182 58 188 L60 200 Q58 206 54 210 L44 212 L32 211 Q26 208 24 202 L22 190 Q20 183 20 178 Z"
                fill={getRegionColor('valparaiso')}
                stroke="white"
                strokeWidth="0.8"
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleRegionClick('valparaiso')}
                onMouseEnter={() => setHoveredRegion('valparaiso')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              {/* Metropolitana - RM */}
              <path
                d="M32 200 L48 200 Q52 203 53 208 L53 218 Q51 223 47 225 L35 225 Q30 222 29 217 L29 207 Q30 202 32 200 Z"
                fill={getRegionColor('metropolitana')}
                stroke="white"
                strokeWidth="0.8"
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleRegionClick('metropolitana')}
                onMouseEnter={() => setHoveredRegion('metropolitana')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              {/* O'Higgins - VI */}
              <path
                d="M24 212 L32 211 L29 217 L29 225 L47 225 L53 218 L54 210 L60 206 Q62 212 62 220 L60 235 Q57 242 52 245 L42 247 L30 246 Q24 242 22 235 L20 220 Q22 214 24 212 Z"
                fill={getRegionColor('ohiggins')}
                stroke="white"
                strokeWidth="0.8"
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleRegionClick('ohiggins')}
                onMouseEnter={() => setHoveredRegion('ohiggins')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              {/* Maule - VII */}
              <path
                d="M20 247 L52 247 Q58 252 60 260 L61 278 Q59 286 54 290 L44 292 L32 291 Q25 287 23 278 L21 260 Q20 252 20 247 Z"
                fill={getRegionColor('maule')}
                stroke="white"
                strokeWidth="0.8"
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleRegionClick('maule')}
                onMouseEnter={() => setHoveredRegion('maule')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              {/* Ñuble - XVI */}
              <path
                d="M23 292 L54 292 Q58 295 59 300 L59 308 Q57 313 53 315 L45 316 L33 315 Q27 312 25 306 L24 298 Q24 294 23 292 Z"
                fill={getRegionColor('nuble')}
                stroke="white"
                strokeWidth="0.8"
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleRegionClick('nuble')}
                onMouseEnter={() => setHoveredRegion('nuble')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              {/* Biobío - VIII */}
              <path
                d="M25 316 L53 316 Q58 320 60 328 L61 345 Q59 353 54 357 L44 359 L32 358 Q25 354 23 345 L22 328 Q23 320 25 316 Z"
                fill={getRegionColor('biobio')}
                stroke="white"
                strokeWidth="0.8"
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleRegionClick('biobio')}
                onMouseEnter={() => setHoveredRegion('biobio')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              {/* La Araucanía - IX */}
              <path
                d="M23 359 L54 359 Q58 363 59 370 L59 382 Q57 388 52 391 L43 393 L33 392 Q27 389 25 382 L24 370 Q24 364 23 359 Z"
                fill={getRegionColor('araucania')}
                stroke="white"
                strokeWidth="0.8"
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleRegionClick('araucania')}
                onMouseEnter={() => setHoveredRegion('araucania')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              {/* Los Ríos - XIV */}
              <path
                d="M25 393 L52 393 Q56 396 57 401 L57 410 Q55 415 51 417 L43 418 L34 417 Q29 414 27 409 L26 400 Q26 396 25 393 Z"
                fill={getRegionColor('rios')}
                stroke="white"
                strokeWidth="0.8"
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleRegionClick('rios')}
                onMouseEnter={() => setHoveredRegion('rios')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              {/* Los Lagos - X */}
              <path
                d="M27 418 L51 418 Q55 421 56 426 L55 438 Q53 444 48 447 L40 448 L33 447 Q28 444 27 438 L26 426 Q27 421 27 418 Z"
                fill={getRegionColor('lagos')}
                stroke="white"
                strokeWidth="0.8"
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleRegionClick('lagos')}
                onMouseEnter={() => setHoveredRegion('lagos')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
            </svg>
            
            {/* Legend */}
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2 text-[10px]">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: TRENDING_COLOR }} />
                <span className="text-muted-foreground">En tendencia</span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: BASE_COLOR }} />
                <span className="text-muted-foreground">Normal</span>
              </div>
            </div>
          </div>

          {/* Region Info */}
          <div className="flex-1 space-y-3">
            {selectedRegion && (
              <div className="p-3 bg-muted/50 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">{selectedRegion.name}</h4>
                  {selectedRegion.isTrending && (
                    <Badge className="bg-primary/20 text-primary text-[10px] border-primary/30">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Tendencia
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Búsquedas</p>
                    <p className="font-bold text-lg">{selectedRegion.searches}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tema popular</p>
                    <p className="font-semibold text-sm mt-1">{selectedRegion.trend}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Trending Regions List */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground mb-2">Regiones en tendencia</p>
              {trendingRegions.map((region) => (
                <div 
                  key={region.id}
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors text-xs ${
                    selectedRegion?.id === region.id 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedRegion(region)}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: TRENDING_COLOR }}
                    />
                    <span className="truncate max-w-[90px]">{region.name}</span>
                  </div>
                  <span className="text-muted-foreground font-medium">{region.searches}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
