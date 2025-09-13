import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Calendar, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  value: number;
  type: "gain" | "expense";
  category?: string;
  company?: string;
  date: Date;
}

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (id: string, value: number, category?: string, company?: string) => void;
  onDelete: (id: string) => void;
}

export const TransactionList = ({ transactions, onEdit, onDelete }: TransactionListProps) => {
  const [filter, setFilter] = useState<"all" | "week" | "month" | "custom">("month"); // Fixo no mês atual
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "gain" | "expense">("all");
  const [subtypeFilter, setSubtypeFilter] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const { toast } = useToast();

  const getFilteredTransactions = () => {
    const now = new Date();
    let filtered = [...transactions];
    
    // Filtro por data
    switch (filter) {
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(t => new Date(t.date) >= weekAgo);
        break;
      case "month":
        const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
        filtered = filtered.filter(t => new Date(t.date) >= monthAgo);
        break;
      case "custom":
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999); // Incluir o dia inteiro
          filtered = filtered.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate >= start && transactionDate <= end;
          });
        }
        break;
    }

    // Filtro por tipo (ganho/despesa)
    if (typeFilter !== "all") {
      filtered = filtered.filter(t => t.type === typeFilter);
    }

    // Filtro por subtipo (empresa/categoria)
    if (subtypeFilter !== "all") {
      filtered = filtered.filter(t => {
        if (typeFilter === "gain") {
          return t.company === subtypeFilter;
        } else if (typeFilter === "expense") {
          return t.category === subtypeFilter;
        }
        return t.company === subtypeFilter || t.category === subtypeFilter;
      });
    }

    return filtered;
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditValue(transaction.value.toString());
    setEditCategory(transaction.category || "");
    setEditCompany(transaction.company || "");
  };

  const handleSaveEdit = () => {
    if (editingId && editValue) {
      const value = parseFloat(editValue);
      if (value > 0) {
        onEdit(editingId, value, editCategory, editCompany);
        setEditingId(null);
        setEditValue("");
        setEditCategory("");
        setEditCompany("");
        toast({
          title: "Transação editada!",
          description: "A transação foi atualizada com sucesso.",
        });
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue("");
    setEditCategory("");
    setEditCompany("");
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta transação?")) {
      onDelete(id);
      toast({
        title: "Transação excluída!",
        description: "A transação foi removida com sucesso.",
      });
    }
  };

  const getSubtypeOptions = () => {
    if (typeFilter === "gain") {
      const companies = [...new Set(transactions.filter(t => t.type === "gain" && t.company).map(t => t.company))];
      return companies;
    } else if (typeFilter === "expense") {
      const categories = [...new Set(transactions.filter(t => t.type === "expense" && t.category).map(t => t.category))];
      return categories;
    }
    return [];
  };

  const handleTypeFilter = (type: "all" | "gain" | "expense") => {
    setTypeFilter(type);
    setSubtypeFilter("all"); // Reset subtipo quando muda o tipo
  };

  const getTotals = () => {
    const filtered = getFilteredTransactions();
    const entradas = filtered.filter(t => t.type === "gain");
    const saidas = filtered.filter(t => t.type === "expense");
    
    return {
      entradas: {
        quantidade: entradas.length,
        valor: entradas.reduce((sum, t) => sum + t.value, 0)
      },
      saidas: {
        quantidade: saidas.length,
        valor: saidas.reduce((sum, t) => sum + t.value, 0)
      },
      total: {
        quantidade: filtered.length,
        valor: filtered.reduce((sum, t) => sum + (t.type === "gain" ? t.value : -t.value), 0)
      }
    };
  };

  const filteredTransactions = getFilteredTransactions();

  return (
    <Card className="bg-finance-card rounded-lg border border-border shadow-card">
      <CardHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-orbitron font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              Histórico de Transações - {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setTypeFilter("all");
                setSubtypeFilter("all");
              }}
              className="h-8 px-3"
            >
              <X className="w-4 h-4 mr-1" />
              Limpar Filtros
            </Button>
          </div>

          {/* Cards de Filtro por Tipo */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={typeFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => handleTypeFilter("all")}
              className="flex items-center gap-2"
            >
              <span>📊</span>
              Todas
            </Button>
            <Button
              variant={typeFilter === "gain" ? "default" : "outline"}
              size="sm"
              onClick={() => handleTypeFilter("gain")}
              className="flex items-center gap-2"
            >
              <span>💰</span>
              Lucros
            </Button>
            <Button
              variant={typeFilter === "expense" ? "default" : "outline"}
              size="sm"
              onClick={() => handleTypeFilter("expense")}
              className="flex items-center gap-2"
            >
              <span>💸</span>
              Despesas
            </Button>
          </div>

          {/* Filtro por Subtipo */}
          {typeFilter !== "all" && getSubtypeOptions().length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={subtypeFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSubtypeFilter("all")}
                className="text-xs"
              >
                Todos os {typeFilter === "gain" ? "apps" : "tipos"}
              </Button>
              {getSubtypeOptions().map((subtype) => (
                <Button
                  key={subtype}
                  variant={subtypeFilter === subtype ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSubtypeFilter(subtype)}
                  className="text-xs"
                >
                  {subtype}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground font-montserrat">
              Nenhuma transação encontrada para o período selecionado.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex justify-between items-center p-3 bg-background/50 rounded-lg"
              >
                {editingId === transaction.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-20 px-2 py-1 bg-background border border-border rounded text-foreground"
                      placeholder="R$ 0,00"
                      step="0.01"
                    />
                    <input
                      type="text"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-24 px-2 py-1 bg-background border border-border rounded text-foreground"
                      placeholder="Categoria"
                    />
                    <input
                      type="text"
                      value={editCompany}
                      onChange={(e) => setEditCompany(e.target.value)}
                      className="w-24 px-2 py-1 bg-background border border-border rounded text-foreground"
                      placeholder="Empresa"
                    />
                    <Button size="sm" onClick={handleSaveEdit} className="h-8">
                      Salvar
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit} className="h-8">
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        {transaction.type === "gain" ? "💰" : "💸"}
                      </span>
                      <div>
                        <p className="font-montserrat text-foreground">
                          {transaction.type === "gain" ? "Lucro" : transaction.category}
                          {transaction.company && ` (${transaction.company})`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.date).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-orbitron font-bold ${
                        transaction.type === "gain" ? "text-finance-gain" : "text-finance-expense"
                      }`}>
                        {transaction.type === "gain" ? "+" : "-"}
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(transaction.value)}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(transaction)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(transaction.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Linha de Total */}
        {filteredTransactions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-finance-gain/10 border border-finance-gain/20 rounded-lg">
                <p className="text-sm text-muted-foreground font-montserrat">Entradas</p>
                <p className="text-lg font-orbitron font-bold text-finance-gain">
                  {getTotals().entradas.quantidade}
                </p>
                <p className="text-sm font-montserrat text-finance-gain">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(getTotals().entradas.valor)}
                </p>
              </div>
              
              <div className="text-center p-3 bg-finance-expense/10 border border-finance-expense/20 rounded-lg">
                <p className="text-sm text-muted-foreground font-montserrat">Saídas</p>
                <p className="text-lg font-orbitron font-bold text-finance-expense">
                  {getTotals().saidas.quantidade}
                </p>
                <p className="text-sm font-montserrat text-finance-expense">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(getTotals().saidas.valor)}
                </p>
              </div>
              
              <div className="text-center p-3 bg-finance-profit/10 border border-finance-profit/20 rounded-lg shadow-neon">
                <p className="text-sm text-muted-foreground font-montserrat">Lucro</p>
                <p className="text-lg font-orbitron font-bold text-finance-profit">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(getTotals().total.valor)}
                </p>
                <p className="text-xs font-montserrat text-muted-foreground">
                  {getTotals().total.quantidade} transações
                </p>
              </div>
              
              <div className="text-center p-3 bg-background/50 border border-border/50 rounded-lg">
                <p className="text-sm text-muted-foreground font-montserrat">Total</p>
                <p className="text-lg font-orbitron font-bold text-foreground">
                  {getTotals().total.quantidade}
                </p>
                <p className="text-xs font-montserrat text-muted-foreground">
                  transações
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
