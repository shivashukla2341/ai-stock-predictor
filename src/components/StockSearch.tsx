import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StockSearchProps {
  onSearch: (symbol: string) => void;
  isLoading: boolean;
}

const StockSearch = ({ onSearch, isLoading }: StockSearchProps) => {
  const [symbol, setSymbol] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symbol.trim()) {
      onSearch(symbol.trim().toUpperCase());
    }
  };

  const popularStocks = ["AAPL", "GOOGL", "MSFT", "TSLA", "NVDA", "AMZN"];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative glass-card p-2 animate-pulse-glow">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter stock symbol (e.g., AAPL)"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                className="pl-12 h-14 bg-secondary/50 border-0 text-lg font-mono placeholder:text-muted-foreground/50 focus-visible:ring-primary"
              />
            </div>
            <Button
              type="submit"
              variant="hero"
              size="xl"
              disabled={isLoading || !symbol.trim()}
              className="gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {isLoading ? "Analyzing..." : "Predict"}
            </Button>
          </div>
        </div>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <span className="text-sm text-muted-foreground mr-2">Popular:</span>
        {popularStocks.map((stock) => (
          <Button
            key={stock}
            variant="glass"
            size="sm"
            onClick={() => {
              setSymbol(stock);
              onSearch(stock);
            }}
            className="font-mono"
          >
            {stock}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default StockSearch;
