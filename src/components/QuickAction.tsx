import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface QuickActionProps {
  title: string;
  type: "gain" | "expense";
  icon: string;
  onAdd: (value: number, category?: string, company?: string) => void;
  categories?: string[];
  companies?: string[];
}

export const QuickAction = ({ title, type, icon, onAdd, categories, companies }: QuickActionProps) => {
  const [value, setValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories?.[0] || "");
  const [selectedCompany, setSelectedCompany] = useState(companies?.[0] || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numValue = parseFloat(value);
    if (numValue > 0) {
      onAdd(numValue, selectedCategory, selectedCompany);
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
          {companies && (
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground font-montserrat">Empresa:</label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger className="bg-background/50 border-border text-foreground">
                  <SelectValue placeholder="Selecione a empresa" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {categories && (
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground font-montserrat">Categoria:</label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    type="button"
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="text-xs"
                  >
                    {category}
                  </Button>
                ))}
              </div>
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
              variant={type === "gain" ? "default" : "destructive"}
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