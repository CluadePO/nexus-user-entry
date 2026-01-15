import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, TrendingUp } from 'lucide-react';

interface RegionData {
  id: string;
  name: string;
  trend: string;
  courses: number;
  growth: number;
  color: string;
}

const regionsData: RegionData[] = [
  { id: 'arica', name: 'Arica y Parinacota', trend: 'Minería', courses: 45, growth: 12, color: '#10B981' },
  { id: 'tarapaca', name: 'Tarapacá', trend: 'Logística', courses: 67, growth: 8, color: '#3B82F6' },
  { id: 'antofagasta', name: 'Antofagasta', trend: 'Minería', courses: 156, growth: 23, color: '#10B981' },
  { id: 'atacama', name: 'Atacama', trend: 'Energía Solar', courses: 89, growth: 35, color: '#F59E0B' },
  { id: 'coquimbo', name: 'Coquimbo', trend: 'Agricultura', courses: 78, growth: 15, color: '#84CC16' },
  { id: 'valparaiso', name: 'Valparaíso', trend: 'Tecnología', courses: 234, growth: 28, color: '#8B5CF6' },
  { id: 'metropolitana', name: 'Metropolitana', trend: 'Liderazgo', courses: 567, growth: 18, color: '#EF4444' },
  { id: 'ohiggins', name: "O'Higgins", trend: 'Agroindustria', courses: 98, growth: 14, color: '#84CC16' },
  { id: 'maule', name: 'Maule', trend: 'Agroindustria', courses: 87, growth: 11, color: '#84CC16' },
  { id: 'nuble', name: 'Ñuble', trend: 'Comercio', courses: 56, growth: 9, color: '#EC4899' },
  { id: 'biobio', name: 'Biobío', trend: 'Industria', courses: 189, growth: 16, color: '#06B6D4' },
  { id: 'araucania', name: 'La Araucanía', trend: 'Turismo', courses: 78, growth: 22, color: '#F97316' },
  { id: 'rios', name: 'Los Ríos', trend: 'Silvicultura', courses: 45, growth: 13, color: '#22C55E' },
  { id: 'lagos', name: 'Los Lagos', trend: 'Acuicultura', courses: 123, growth: 19, color: '#0EA5E9' },
  { id: 'aysen', name: 'Aysén', trend: 'Turismo', courses: 34, growth: 25, color: '#F97316' },
  { id: 'magallanes', name: 'Magallanes', trend: 'Energía Eólica', courses: 28, growth: 31, color: '#A855F7' },
];

export const ChileRegionsMap: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(regionsData[6]); // Metropolitana by default
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const getRegionColor = (regionId: string) => {
    const region = regionsData.find(r => r.id === regionId);
    if (!region) return '#94A3B8';
    
    if (hoveredRegion === regionId || selectedRegion?.id === regionId) {
      return region.color;
    }
    return `${region.color}99`; // Add transparency
  };

  const handleRegionClick = (regionId: string) => {
    const region = regionsData.find(r => r.id === regionId);
    if (region) setSelectedRegion(region);
  };

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
          {/* Chile Map SVG */}
          <div className="flex-shrink-0 w-24">
            <svg 
              viewBox="0 0 100 400" 
              className="w-full h-[340px]"
              style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.1))' }}
            >
              {/* Arica y Parinacota */}
              <path
                d="M45 5 L55 5 L58 15 L42 15 Z"
                fill={getRegionColor('arica')}
                stroke="white"
                strokeWidth="0.5"
                className="cursor-pointer transition-all duration-200 hover:brightness-110"
                onClick={() => handleRegionClick('arica')}
                onMouseEnter={() => setHoveredRegion('arica')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              {/* Tarapacá */}
              <path
                d="M42 15 L58 15 L60 30 L40 30 Z"
                fill={getRegionColor('tarapaca')}
                stroke="white"
                strokeWidth="0.5"
                className="cursor-pointer transition-all duration-200 hover:brightness-110"
                onClick={() => handleRegionClick('tarapaca')}
                onMouseEnter={() => setHoveredRegion('tarapaca')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              {/* Antofagasta */}
              <path
                d="M40 30 L60 30 L65 60 L35 60 Z"
                fill={getRegionColor('antofagasta')}
                stroke="white"
                strokeWidth="0.5"
                className="cursor-pointer transition-all duration-200 hover:brightness-110"
                onClick={() => handleRegionClick('antofagasta')}
                onMouseEnter={() => setHoveredRegion('antofagasta')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              {/* Atacama */}
              <path
                d="M35 60 L65 60 L68 90 L32 90 Z"
                fill={getRegionColor('atacama')}
                stroke="white"
                strokeWidth="0.5"
                className="cursor-pointer transition-all duration-200 hover:brightness-110"
                onClick={() => handleRegionClick('atacama')}
                onMouseEnter={() => setHoveredRegion('atacama')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              {/* Coquimbo */}
              <path
                d="M32 90 L68 90 L70 115 L30 115 Z"
                fill={getRegionColor('coquimbo')}
                stroke="white"
                strokeWidth="0.5"
                className="cursor-pointer transition-all duration-200 hover:brightness-110"
                onClick={() => handleRegionClick('coquimbo')}
                onMouseEnter={() => setHoveredRegion('coquimbo')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              {/* Valparaíso */}
              <path
                d="M30 115 L70 115 L72 135 L28 135 Z"
                fill={getRegionColor('valparaiso')}
                stroke="white"
                strokeWidth="0.5"
                className="cursor-pointer transition-all duration-200 hover:brightness-110"
                onClick={() => handleRegionClick('valparaiso')}
                onMouseEnter={() => setHoveredRegion('valparaiso')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              {/* Metropolitana */}
              <path
                d="M35 135 L65 135 L67 150 L33 150 Z"
                fill={getRegionColor('metropolitana')}
                stroke="white"
                strokeWidth="0.5"
                className="cursor-pointer transition-all duration-200 hover:brightness-110"
                onClick={() => handleRegionClick('metropolitana')}
                onMouseEnter={() => setHoveredRegion('metropolitana')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              {/* O'Higgins */}
              <path
                d="M28 135 L35 135 L33 150 L67 150 L72 135 L75 160 L25 160 Z"
                fill={getRegionColor('ohiggins')}
                stroke="white"
                strokeWidth="0.5"
                className="cursor-pointer transition-all duration-200 hover:brightness-110"
                onClick={() => handleRegionClick('ohiggins')}
                onMouseEnter={() => setHoveredRegion('ohiggins')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              {/* Maule */}
              <path
                d="M25 160 L75 160 L78 185 L22 185 Z"
                fill={getRegionColor('maule')}
                stroke="white"
                strokeWidth="0.5"
                className="cursor-pointer transition-all duration-200 hover:brightness-110"
                onClick={() => handleRegionClick('maule')}
                onMouseEnter={() => setHoveredRegion('maule')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              {/* Ñuble */}
              <path
                d="M22 185 L78 185 L80 200 L20 200 Z"
                fill={getRegionColor('nuble')}
                stroke="white"
                strokeWidth="0.5"
                className="cursor-pointer transition-all duration-200 hover:brightness-110"
                onClick={() => handleRegionClick('nuble')}
                onMouseEnter={() => setHoveredRegion('nuble')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              {/* Biobío */}
              <path
                d="M20 200 L80 200 L82 225 L18 225 Z"
                fill={getRegionColor('biobio')}
                stroke="white"
                strokeWidth="0.5"
                className="cursor-pointer transition-all duration-200 hover:brightness-110"
                onClick={() => handleRegionClick('biobio')}
                onMouseEnter={() => setHoveredRegion('biobio')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              {/* La Araucanía */}
              <path
                d="M18 225 L82 225 L80 250 L20 250 Z"
                fill={getRegionColor('araucania')}
                stroke="white"
                strokeWidth="0.5"
                className="cursor-pointer transition-all duration-200 hover:brightness-110"
                onClick={() => handleRegionClick('araucania')}
                onMouseEnter={() => setHoveredRegion('araucania')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              {/* Los Ríos */}
              <path
                d="M20 250 L80 250 L78 270 L22 270 Z"
                fill={getRegionColor('rios')}
                stroke="white"
                strokeWidth="0.5"
                className="cursor-pointer transition-all duration-200 hover:brightness-110"
                onClick={() => handleRegionClick('rios')}
                onMouseEnter={() => setHoveredRegion('rios')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              {/* Los Lagos */}
              <path
                d="M22 270 L78 270 L75 310 L25 310 Z"
                fill={getRegionColor('lagos')}
                stroke="white"
                strokeWidth="0.5"
                className="cursor-pointer transition-all duration-200 hover:brightness-110"
                onClick={() => handleRegionClick('lagos')}
                onMouseEnter={() => setHoveredRegion('lagos')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              {/* Aysén */}
              <path
                d="M25 310 L75 310 L70 355 L30 355 Z"
                fill={getRegionColor('aysen')}
                stroke="white"
                strokeWidth="0.5"
                className="cursor-pointer transition-all duration-200 hover:brightness-110"
                onClick={() => handleRegionClick('aysen')}
                onMouseEnter={() => setHoveredRegion('aysen')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              {/* Magallanes */}
              <path
                d="M30 355 L70 355 L65 395 L35 395 Z"
                fill={getRegionColor('magallanes')}
                stroke="white"
                strokeWidth="0.5"
                className="cursor-pointer transition-all duration-200 hover:brightness-110"
                onClick={() => handleRegionClick('magallanes')}
                onMouseEnter={() => setHoveredRegion('magallanes')}
                onMouseLeave={() => setHoveredRegion(null)}
              />
            </svg>
          </div>

          {/* Region Info */}
          <div className="flex-1 space-y-3">
            {selectedRegion && (
              <div className="p-3 bg-muted/50 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">{selectedRegion.name}</h4>
                  <Badge 
                    style={{ backgroundColor: selectedRegion.color, color: 'white' }}
                    className="text-xs"
                  >
                    {selectedRegion.trend}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Cursos disponibles</p>
                    <p className="font-bold text-lg">{selectedRegion.courses}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Crecimiento</p>
                    <p className="font-bold text-lg text-emerald-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +{selectedRegion.growth}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Top Regions List */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground mb-2">Top regiones</p>
              {regionsData
                .sort((a, b) => b.courses - a.courses)
                .slice(0, 5)
                .map((region) => (
                  <div 
                    key={region.id}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors text-xs ${
                      selectedRegion?.id === region.id 
                        ? 'bg-muted' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedRegion(region)}
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: region.color }}
                      />
                      <span className="truncate max-w-[100px]">{region.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px] px-1.5">
                      {region.trend}
                    </Badge>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
