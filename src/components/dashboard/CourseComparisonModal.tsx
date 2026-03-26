import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  X,
  Plus,
  Clock,
  Star,
  Building2,
  MapPin,
  DollarSign,
  CheckCircle2,
  XCircle,
  ArrowLeftRight,
  GripVertical,
  Sparkles,
} from 'lucide-react';

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

interface CourseComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourses: Course[];
  allCourses: Course[];
  onAddCourse: (course: Course) => void;
  onRemoveCourse: (courseId: string) => void;
  onSwapCourse: (oldCourseId: string, newCourse: Course) => void;
}

export const CourseComparisonModal: React.FC<CourseComparisonModalProps> = ({
  isOpen,
  onClose,
  selectedCourses,
  allCourses,
  onAddCourse,
  onRemoveCourse,
  onSwapCourse,
}) => {
  const [swappingSlot, setSwappingSlot] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getModalityColor = (modality: string) => {
    switch (modality) {
      case 'Presencial': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Distancia': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'E-learning': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'Sence'
      ? 'bg-primary/10 text-primary border-primary/30'
      : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
  };

  // Get recommended courses (not already selected)
  const recommendedCourses = allCourses.filter(
    course => !selectedCourses.find(sc => sc.id === course.id)
  ).slice(0, 6);

  // Comparison metrics
  const comparisonRows = [
    {
      label: 'Precio',
      icon: DollarSign,
      getValue: (course: Course) => formatPrice(course.price),
      compare: (courses: Course[]) => {
        const min = Math.min(...courses.map(c => c.price));
        return courses.map(c => c.price === min ? 'best' : 'normal');
      },
    },
    {
      label: 'Duración',
      icon: Clock,
      getValue: (course: Course) => `${course.hours} horas`,
      compare: (courses: Course[]) => courses.map(() => 'normal'),
    },
    {
      label: 'Valoración',
      icon: Star,
      getValue: (course: Course) => course.rating.toString(),
      compare: (courses: Course[]) => {
        const max = Math.max(...courses.map(c => c.rating));
        return courses.map(c => c.rating === max ? 'best' : 'normal');
      },
    },
    {
      label: 'Participantes',
      icon: Building2,
      getValue: (course: Course) => course.participants.toLocaleString(),
      compare: (courses: Course[]) => {
        const max = Math.max(...courses.map(c => c.participants));
        return courses.map(c => c.participants === max ? 'best' : 'normal');
      },
    },
    {
      label: 'Región',
      icon: MapPin,
      getValue: (course: Course) => course.region,
      compare: (courses: Course[]) => courses.map(() => 'normal'),
    },
    {
      label: 'Modalidad',
      icon: CheckCircle2,
      getValue: (course: Course) => course.modality,
      compare: (courses: Course[]) => courses.map(() => 'normal'),
    },
    {
      label: 'Tipo',
      icon: CheckCircle2,
      getValue: (course: Course) => course.type,
      compare: (courses: Course[]) => courses.map(c => c.type === 'Sence' ? 'best' : 'normal'),
    },
  ];

  const handleSelectForSwap = (course: Course) => {
    if (swappingSlot) {
      onSwapCourse(swappingSlot, course);
      setSwappingSlot(null);
    } else if (selectedCourses.length < 3) {
      onAddCourse(course);
    }
  };

  const emptySlots = 3 - selectedCourses.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-4 border-b bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ArrowLeftRight className="h-5 w-5 text-primary" />
            </div>
            Comparador de Cursos
            <Badge variant="secondary" className="ml-2">
              {selectedCourses.length}/3 cursos
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Main Comparison Area */}
          <div className="flex-1 overflow-auto p-6">
            {/* Course Headers */}
            <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `repeat(${Math.max(selectedCourses.length, 2)}, minmax(200px, 1fr))` }}>
              {selectedCourses.map((course, index) => (
                <div
                  key={course.id}
                  className={`relative group rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                    swappingSlot === course.id
                      ? 'border-primary ring-2 ring-primary/20 scale-[0.98]'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {/* Drag Handle */}
                  <div className="absolute top-2 left-2 p-1 rounded bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab z-10">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveCourse(course.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-destructive hover:text-white transition-all opacity-0 group-hover:opacity-100 z-10"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  {/* Swap Button */}
                  <button
                    onClick={() => setSwappingSlot(swappingSlot === course.id ? null : course.id)}
                    className={`absolute bottom-2 right-2 p-1.5 rounded-full transition-all z-10 ${
                      swappingSlot === course.id
                        ? 'bg-primary text-white'
                        : 'bg-background/80 hover:bg-primary/10 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                  </button>

                  {/* Course Image */}
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={course.imageUrl}
                      alt={course.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      <Badge className={`${getTypeColor(course.type)} text-xs`} variant="outline">
                        {course.type}
                      </Badge>
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-sm line-clamp-2 min-h-[40px] mb-2">
                      {course.name}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {course.provider}
                    </p>
                    <Badge className={`${getModalityColor(course.modality)} text-xs mt-2`}>
                      {course.modality}
                    </Badge>
                    <Button variant="link" size="sm" className="px-0 mt-2 gap-1 text-xs">
                      <Sparkles className="h-3 w-3" />
                      Solicitar cotización
                    </Button>
                  </div>
                </div>
              ))}

              {/* Empty Slots */}
              {Array.from({ length: emptySlots }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="rounded-xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center min-h-[200px] bg-muted/20 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
                  onClick={() => setSwappingSlot(null)}
                >
                  <div className="p-3 rounded-full bg-muted group-hover:bg-primary/10 transition-colors mb-2">
                    <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                    Agregar curso
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Selecciona del panel derecho
                  </p>
                </div>
              ))}
            </div>

            {/* Comparison Table */}
            {selectedCourses.length >= 2 && (
              <div className="rounded-xl border overflow-hidden">
                <div className="bg-muted/50 px-4 py-3 border-b">
                  <h4 className="font-semibold text-sm">Comparación detallada</h4>
                </div>
                <div className="divide-y">
                  {comparisonRows.map((row) => {
                    const comparisons = row.compare(selectedCourses);
                    return (
                      <div
                        key={row.label}
                        className="grid gap-4 px-4 py-3 hover:bg-muted/30 transition-colors"
                        style={{ gridTemplateColumns: `140px repeat(${selectedCourses.length}, 1fr)` }}
                      >
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <row.icon className="h-4 w-4" />
                          {row.label}
                        </div>
                        {selectedCourses.map((course, index) => (
                          <div
                            key={course.id}
                            className={`text-sm font-medium flex items-center gap-1 ${
                              comparisons[index] === 'best'
                                ? 'text-emerald-600'
                                : ''
                            }`}
                          >
                            {comparisons[index] === 'best' && (
                              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                            )}
                            {row.getValue(course)}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {selectedCourses.length >= 2 && (
              <div className="flex justify-center gap-4 mt-6 pt-6 border-t">
                <Button variant="outline" size="lg">
                  Descargar comparación
                </Button>
                <Button size="lg" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Solicitar cotización
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar - Recommended Courses */}
          <div className="w-80 border-l bg-muted/20 flex flex-col">
            <div className="p-4 border-b bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                {swappingSlot ? 'Selecciona un curso para cambiar' : 'Cursos recomendados'}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {swappingSlot
                  ? 'Haz clic en un curso para intercambiarlo'
                  : 'Haz clic para agregar a la comparación'}
              </p>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-3">
                {recommendedCourses.map((course) => (
                  <Card
                    key={course.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50 ${
                      swappingSlot ? 'hover:scale-[1.02]' : ''
                    } ${selectedCourses.length >= 3 && !swappingSlot ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => {
                      if (selectedCourses.length < 3 || swappingSlot) {
                        handleSelectForSwap(course);
                      }
                    }}
                  >
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        <img
                          src={course.imageUrl}
                          alt={course.name}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-sm line-clamp-2 mb-1">
                            {course.name}
                          </h5>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-0.5">
                              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                              {course.rating}
                            </span>
                            <span>•</span>
                            <span>{course.hours}h</span>
                          </div>
                          <p className="text-sm font-semibold text-primary mt-1">
                            {formatPrice(course.price)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1 mt-2">
                        <Badge className={`${getTypeColor(course.type)} text-xs`} variant="outline">
                          {course.type}
                        </Badge>
                        <Badge className={`${getModalityColor(course.modality)} text-xs`}>
                          {course.modality}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
