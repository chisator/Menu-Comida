"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Shuffle, ChefHat, Calendar, StickyNote } from "lucide-react";

interface Meal {
  id: string;
  name: string;
  note: string;
  completed: boolean;
}

interface WeeklyMeals {
  [key: string]: Meal | null;
}

const DAYS_OF_WEEK = [
  { key: "monday", label: "Lunes" },
  { key: "tuesday", label: "Martes" },
  { key: "wednesday", label: "Miércoles" },
  { key: "thursday", label: "Jueves" },
  { key: "friday", label: "Viernes" },
  { key: "saturday", label: "Sábado" },
  { key: "sunday", label: "Domingo" },
];

const MEAL_SUGGESTIONS = [
  "Pollo a la plancha con verduras",
  "Pasta con salsa boloñesa",
  "Ensalada César con pollo",
  "Salmón al horno con papas",
  "Tacos de pescado",
  "Risotto de champiñones",
  "Curry de pollo con arroz",
  "Pizza casera",
  "Sopa de lentejas",
  "Hamburguesas caseras",
  "Paella de mariscos",
  "Lasaña de verduras",
  "Pollo teriyaki con arroz",
  "Quesadillas de pollo",
  "Estofado de carne",
];

export default function MealPlannerApp() {
  const [meals, setMeals] = useState<WeeklyMeals>({});
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [mealName, setMealName] = useState("");
  const [mealNote, setMealNote] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [randomSuggestion, setRandomSuggestion] = useState("");

  const addMeal = () => {
    if (!selectedDay || !mealName.trim()) return;

    const newMeal: Meal = {
      id: Date.now().toString(),
      name: mealName.trim(),
      note: mealNote.trim(),
      completed: false,
    };

    setMeals((prev) => ({
      ...prev,
      [selectedDay]: newMeal,
    }));

    setMealName("");
    setMealNote("");
    setSelectedDay("");
    setIsDialogOpen(false);
  };

  const toggleMealCompleted = (day: string) => {
    setMeals((prev) => {
      const meal = prev[day];
      if (!meal) return prev;

      return {
        ...prev,
        [day]: { ...meal, completed: !meal.completed },
      };
    });
  };

  const removeMeal = (day: string) => {
    setMeals((prev) => {
      const newMeals = { ...prev };
      delete newMeals[day];
      return newMeals;
    });
  };

  const generateRandomSuggestion = () => {
    const randomIndex = Math.floor(Math.random() * MEAL_SUGGESTIONS.length);
    setRandomSuggestion(MEAL_SUGGESTIONS[randomIndex]);
  };

  const useRandomSuggestion = () => {
    if (randomSuggestion && selectedDay) {
      setMealName(randomSuggestion);
      setRandomSuggestion("");
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ChefHat className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Planificador de Menús
            </h1>
          </div>
          <p className="text-muted-foreground">
            Organiza tus comidas semanales de forma fácil y atractiva
          </p>
        </div>

        {/* Random Suggestion Card */}
        <Card className="mb-6 border-accent/20 bg-gradient-to-r from-card to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent">
              <Shuffle className="h-5 w-5" />
              Sugerencia del día
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                {randomSuggestion ? (
                  <p className="text-lg font-medium">{randomSuggestion}</p>
                ) : (
                  <p className="text-muted-foreground">
                    Haz clic en el botón para obtener una sugerencia
                  </p>
                )}
              </div>
              <Button
                onClick={generateRandomSuggestion}
                variant="outline"
                size="sm"
              >
                <Shuffle className="h-4 w-4 mr-2" />
                Sugerir
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {DAYS_OF_WEEK.map((day) => {
            const meal = meals[day.key];
            return (
              <Card
                key={day.key}
                className="relative hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    {day.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {meal ? (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <Checkbox
                            checked={meal.completed}
                            onCheckedChange={() => toggleMealCompleted(day.key)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <p
                              className={`font-medium ${
                                meal.completed
                                  ? "line-through text-muted-foreground"
                                  : ""
                              }`}
                            >
                              {meal.name}
                            </p>
                            {meal.note && (
                              <div className="flex items-start gap-1 mt-1">
                                <StickyNote className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-muted-foreground">
                                  {meal.note}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        {meal.completed && (
                          <Badge variant="secondary" className="text-xs">
                            ✓ Preparado
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMeal(day.key)}
                        className="w-full text-destructive hover:text-destructive"
                      >
                        Eliminar
                      </Button>
                    </>
                  ) : (
                    <Dialog
                      open={isDialogOpen && selectedDay === day.key}
                      onOpenChange={setIsDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-20 border-dashed border-2 hover:border-primary hover:bg-primary/5 bg-transparent"
                          onClick={() => setSelectedDay(day.key)}
                        >
                          <Plus className="h-5 w-5 mr-2" />
                          Agregar comida
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Add Meal Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Agregar comida para{" "}
                {DAYS_OF_WEEK.find((d) => d.key === selectedDay)?.label}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Nombre de la comida
                </label>
                <Input
                  placeholder="Ej: Pollo a la plancha con verduras"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Nota (opcional)
                </label>
                <Textarea
                  placeholder="Ej: Comprar pan, usar aceite de oliva..."
                  value={mealNote}
                  onChange={(e) => setMealNote(e.target.value)}
                  rows={3}
                />
              </div>
              {randomSuggestion && (
                <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-sm text-accent font-medium mb-2">
                    Sugerencia disponible:
                  </p>
                  <p className="text-sm mb-2">{randomSuggestion}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={useRandomSuggestion}
                  >
                    Usar esta sugerencia
                  </Button>
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={addMeal}
                  disabled={!mealName.trim()}
                  className="flex-1"
                >
                  Agregar comida
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
