import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Check, X } from "lucide-react";

interface GoalCardProps {
  currentAmount: number;
  goalAmount: number;
  onGoalChange?: (newGoal: number) => void;
}

export const GoalCard = ({ currentAmount, goalAmount, onGoalChange }: GoalCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(goalAmount.toString());
  
  const percentage = Math.min((currentAmount / goalAmount) * 100, 100);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const handleSave = () => {
    const newGoal = parseFloat(editValue);
    if (newGoal > 0 && onGoalChange) {
      onGoalChange(newGoal);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(goalAmount.toString());
    setIsEditing(false);
  };

  return (
    <Card className="bg-finance-card border-border shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-foreground font-orbitron text-lg">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            Meta de Reserva
          </div>
          {onGoalChange && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-muted-foreground text-sm font-montserrat">Atual</p>
            <p className="text-xl font-orbitron font-bold text-finance-profit">
              {formatCurrency(currentAmount)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-sm font-montserrat">Meta</p>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-24 h-8 text-sm bg-background/50 border-border text-foreground"
                  min="0"
                  step="0.01"
                />
                <Button size="sm" onClick={handleSave} className="h-8 w-8 p-0">
                  <Check className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel} className="h-8 w-8 p-0">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <p className="text-lg font-orbitron text-foreground">
                {formatCurrency(goalAmount)}
              </p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Progress value={percentage} className="h-3 bg-background/50" />
          <p className="text-center text-sm font-montserrat">
            <span className="text-finance-profit font-bold">{percentage.toFixed(1)}%</span>
            <span className="text-muted-foreground"> alcançado</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};