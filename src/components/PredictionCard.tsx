import { TrendingUp, TrendingDown, Target, Brain, Zap, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PredictionCardProps {
  symbol: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  timeframe: string;
}

const PredictionCard = ({
  symbol,
  currentPrice,
  predictedPrice,
  confidence,
  timeframe,
}: PredictionCardProps) => {
  const priceChange = predictedPrice - currentPrice;
  const percentChange = ((priceChange / currentPrice) * 100).toFixed(2);
  const isBullish = priceChange >= 0;

  return (
    <div className="glass-card p-8 animate-fade-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold font-mono">{symbol}</h2>
            <span className={cn(
              "px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1",
              isBullish ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
            )}>
              {isBullish ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {isBullish ? "Bullish" : "Bearish"}
            </span>
          </div>
          <p className="text-muted-foreground">AI Prediction for {timeframe}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
          <Brain className="w-5 h-5 text-primary" />
          <span className="text-primary font-medium">{confidence}% Confidence</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm">Current Price</span>
          </div>
          <p className="text-3xl font-bold font-mono">${currentPrice.toFixed(2)}</p>
        </div>

        <div className={cn(
          "stat-card border",
          isBullish ? "border-success/30 glow-success" : "border-destructive/30 glow-destructive"
        )}>
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Target className="w-4 h-4" />
            <span className="text-sm">Predicted Price</span>
          </div>
          <p className={cn(
            "text-3xl font-bold font-mono",
            isBullish ? "text-bullish" : "text-bearish"
          )}>
            ${predictedPrice.toFixed(2)}
          </p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Zap className="w-4 h-4" />
            <span className="text-sm">Expected Change</span>
          </div>
          <p className={cn(
            "text-3xl font-bold font-mono",
            isBullish ? "text-bullish" : "text-bearish"
          )}>
            {isBullish ? "+" : ""}{percentChange}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default PredictionCard;
