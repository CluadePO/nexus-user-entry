import React, { useState } from 'react';
import { Heart, X, ChevronLeft, ChevronRight, Star, Clock, Building2, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';

interface Course {
  id: string;
  name: string;
  type: 'Sence' | 'No Sence';
  modality: 'Presencial' | 'Distancia' | 'E-learning';
  provider: string;
  price: number;
  hours: number;
  rating: number;
  participants: number;
  category: string;
  area: string;
  region: string;
  imageUrl: string;
  isFavorite: boolean;
}

interface FavoritesSidebarProps {
  favoriteCourses: Course[];
  onRemoveFavorite: (courseId: string) => void;
  formatPrice: (price: number) => string;
  isFavoritesViewActive: boolean;
  onShowFavorites: () => void;
  onShowAllCourses: () => void;
}

const FavoritesSidebar: React.FC<FavoritesSidebarProps> = ({
  favoriteCourses,
  onRemoveFavorite,
  formatPrice,
  isFavoritesViewActive,
  onShowFavorites,
  onShowAllCourses,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const getTypeColor = (type: string) => {
    return type === 'Sence' 
      ? 'bg-primary/10 text-primary border-primary/30' 
      : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
  };

  return (
    <>
      {/* Collapsed Tab - Always visible */}
      <div 
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 transition-all duration-300 ${
          isExpanded ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        <button
          onClick={() => {
            onShowFavorites();
          }}
          className="flex flex-col items-center gap-2 bg-primary text-primary-foreground px-3 py-4 rounded-l-lg shadow-lg hover:bg-primary/90 transition-colors"
        >
          <Heart className="h-5 w-5 fill-current" />
          <span 
            className="text-xs font-medium whitespace-nowrap"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
          >
            Mis Favoritos
          </span>
          {favoriteCourses.length > 0 && (
            <Badge className="bg-white text-primary text-xs px-1.5 py-0.5 min-w-[20px]">
              {favoriteCourses.length}
            </Badge>
          )}
        </button>
      </div>

      {/* Expanded Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full z-50 transition-transform duration-300 ${
          isExpanded ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Overlay */}
        {isExpanded && (
          <div 
            className="fixed inset-0 bg-black/30 -z-10"
            onClick={() => setIsExpanded(false)}
          />
        )}
        
        <div className="h-full w-80 bg-background border-l shadow-xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b bg-gradient-to-r from-primary/10 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary fill-primary" />
                <h2 className="font-semibold text-lg">Mis Favoritos</h2>
                <Badge variant="secondary" className="ml-1">
                  {favoriteCourses.length}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                {isFavoritesViewActive && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onShowAllCourses}
                    className="h-8 px-2 text-xs"
                  >
                    Ver todos
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(false)}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Favorite Courses List */}
          <ScrollArea className="flex-1 p-4 min-h-0">
            {favoriteCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 bg-muted rounded-full mb-4">
                  <Heart className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  No tienes cursos favoritos
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Haz clic en la estrella de un curso para agregarlo aquí
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {favoriteCourses.map((course) => (
                  <div
                    key={course.id}
                    className="group bg-card border rounded-lg p-3 hover:shadow-md transition-all hover:border-primary/30"
                  >
                    {/* Course Image */}
                    <div className="relative h-24 rounded-md overflow-hidden mb-3">
                      <img
                        src={course.imageUrl}
                        alt={course.name}
                        className="w-full h-full object-cover"
                      />
                      <Badge 
                        className={`absolute top-1.5 left-1.5 text-xs ${getTypeColor(course.type)}`} 
                        variant="outline"
                      >
                        {course.type}
                      </Badge>
                    </div>

                    {/* Course Info */}
                    <h4 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {course.name}
                    </h4>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <Building2 className="h-3 w-3" />
                      <span className="truncate">{course.provider}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{course.hours}h</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span>{course.rating}</span>
                      </div>
                    </div>

                    <p className="text-sm font-bold text-primary mb-3">
                      {formatPrice(course.price)}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 h-8 text-xs"
                        onClick={() => {
                          navigate(`/formacion/curso/${course.id}`);
                          setIsExpanded(false);
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver curso
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onRemoveFavorite(course.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Footer inside scroll area */}
                <div className="pt-4 mt-2 border-t">
                  <p className="text-xs text-muted-foreground text-center">
                    {favoriteCourses.length} curso{favoriteCourses.length !== 1 ? 's' : ''} en favoritos
                  </p>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </>
  );
};

export default FavoritesSidebar;
