import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface QuickActionProps {
  title: string;
  type: "gain" | "expense";
  icon: string;
  onAdd: (value: number, category?: string) => void;
  categories?: string[];
}

export const QuickAction = ({ title, type, icon, onAdd, categories }: QuickActionProps) => {
  const [value, setValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories?.[0] || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numValue = parseFloat(value);
    if (numValue > 0) {
      onAdd(numValue, selectedCategory);
      setValue("");
    }
  };

  return (
    <Card className="bg-finance-card border-border shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-foreground font-orbitron text-lg">
          <span className="text-xl">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {categories && (
            <div className="grid grid-cols-3 gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  type="button"
                  variant={selectedCategory === category ? "neon" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="text-xs"
                >
                  {category}
                </Button>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="R$ 0,00"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex-1 bg-background/50 border-border text-foreground"
              min="0"
              step="0.01"
            />
            <Button 
              type="submit" 
              variant={type === "gain" ? "gain" : "expense"}
              size="icon"
              disabled={!value || parseFloat(value) <= 0}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};