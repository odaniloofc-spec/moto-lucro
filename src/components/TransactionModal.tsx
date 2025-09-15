import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Filter, X } from "lucide-react";

interface Transaction {
  id: string;
  value: number;
  type: "gain" | "expense";
  category?: string;
  company?: string;
  date: Date;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  type: "gain" | "expense";
  title: string;
}

export const TransactionModal = ({ isOpen, onClose, transactions, type, title }: TransactionModalProps) => {
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [dateFilter, setDateFilter] = useState<"all" | "week" | "month" | "custom">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let filtered = transactions.filter(t => t.type === type);

    // Aplicar filtro de data
    const now = new Date();
    switch (dateFilter) {
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

    // Aplicar filtro de busca
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  }, [transactions, type, dateFilter, startDate, endDate, searchTerm]);

  const getTotalAmount = () => {
    return filteredTransactions.reduce((sum, t) => sum + t.value, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDateFilterLabel = () => {
    switch (dateFilter) {
      case "week": return "Última semana";
      case "month": return "Este mês";
      case "custom": 
        if (startDate && endDate) {
          return `${new Date(startDate).toLocaleDateString('pt-BR')} - ${new Date(endDate).toLocaleDateString('pt-BR')}`;
        }
        return "Intervalo de datas";
      default: return "Todas as datas";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-finance-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-orbitron font-bold text-foreground flex items-center gap-2">
            <span className="text-2xl">{type === "gain" ? "💰" : "💸"}</span>
            {title}
            <span className="text-lg font-montserrat text-muted-foreground ml-auto">
              Total: {formatCurrency(getTotalAmount())}
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-background/50 rounded-lg border border-border/50">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Select value={dateFilter} onValueChange={(value: "all" | "week" | "month" | "custom") => setDateFilter(value)}>
              <SelectTrigger className="w-40 bg-background border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as datas</SelectItem>
                <SelectItem value="week">Última semana</SelectItem>
                <SelectItem value="month">Este mês</SelectItem>
                <SelectItem value="custom">Intervalo de datas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {dateFilter === "custom" && (
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-40 bg-background border-border text-foreground"
                placeholder="Data inicial"
              />
              <span className="text-muted-foreground">até</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-40 bg-background border-border text-foreground"
                placeholder="Data final"
              />
            </div>
          )}

          <div className="flex items-center gap-2 flex-1">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por categoria ou empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-background border-border text-foreground"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setDateFilter("all");
              setStartDate("");
              setEndDate("");
              setSearchTerm("");
            }}
            className="whitespace-nowrap"
          >
            <X className="w-4 h-4 mr-1" />
            Limpar
          </Button>
        </div>

        {/* Lista de Transações */}
        <div className="flex-1 overflow-y-auto">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground font-montserrat">
                Nenhuma transação encontrada para os filtros selecionados.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex justify-between items-center p-4 bg-background/50 rounded-lg border border-border/50 hover:bg-background/70 transition-smooth"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-lg">
                        {transaction.type === "gain" ? "💰" : "💸"}
                      </span>
                    </div>
                    <div>
                      <p className="font-montserrat text-foreground font-medium">
                        {transaction.type === "gain" ? "Valor" : transaction.category}
                        {transaction.company && (
                          <span className="text-muted-foreground ml-2">
                            ({transaction.company})
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground font-montserrat">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-orbitron font-bold text-lg ${
                      transaction.type === "gain" ? "text-finance-gain" : "text-finance-expense"
                    }`}>
                      {transaction.type === "gain" ? "+" : "-"}
                      {formatCurrency(transaction.value)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resumo */}
        {filteredTransactions.length > 0 && (
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground font-montserrat">Total de Transações</p>
                <p className="text-xl font-orbitron font-bold text-foreground">
                  {filteredTransactions.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-montserrat">Valor Total</p>
                <p className={`text-xl font-orbitron font-bold ${
                  type === "gain" ? "text-finance-gain" : "text-finance-expense"
                }`}>
                  {type === "gain" ? "+" : "-"}
                  {formatCurrency(getTotalAmount())}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-montserrat">Valor Médio</p>
                <p className="text-xl font-orbitron font-bold text-foreground">
                  {formatCurrency(getTotalAmount() / filteredTransactions.length)}
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
