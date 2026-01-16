import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface StockChartProps {
  symbol: string;
  currentPrice: number;
  predictedPrice: number;
}

const StockChart = ({ symbol, currentPrice, predictedPrice }: StockChartProps) => {
  const data = useMemo(() => {
    const points = [];
    const startPrice = currentPrice * 0.95;
    const volatility = currentPrice * 0.02;
    
    // Generate historical data (past 30 days)
    for (let i = 0; i < 30; i++) {
      const progress = i / 30;
      const trend = (currentPrice - startPrice) * progress;
      const noise = (Math.random() - 0.5) * volatility;
      points.push({
        day: i + 1,
        price: startPrice + trend + noise,
        type: "historical",
      });
    }
    
    // Add current price
    points.push({
      day: 31,
      price: currentPrice,
      type: "current",
    });
    
    // Generate prediction data (next 7 days)
    for (let i = 1; i <= 7; i++) {
      const progress = i / 7;
      const trend = (predictedPrice - currentPrice) * progress;
      const noise = (Math.random() - 0.5) * volatility * 0.5;
      points.push({
        day: 31 + i,
        price: currentPrice + trend + noise,
        predicted: currentPrice + trend + noise,
        type: "prediction",
      });
    }
    
    return points;
  }, [currentPrice, predictedPrice]);

  const isBullish = predictedPrice >= currentPrice;
  const minPrice = Math.min(...data.map(d => d.price || d.predicted || 0)) * 0.98;
  const maxPrice = Math.max(...data.map(d => d.price || d.predicted || 0)) * 1.02;

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Price Prediction Chart</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-line" />
            <span className="text-muted-foreground">Historical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isBullish ? 'bg-success' : 'bg-destructive'}`} />
            <span className="text-muted-foreground">Prediction</span>
          </div>
        </div>
      </div>
      
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(173, 80%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(173, 80%, 50%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isBullish ? "hsl(160, 84%, 45%)" : "hsl(0, 72%, 55%)"}
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor={isBullish ? "hsl(160, 84%, 45%)" : "hsl(0, 72%, 55%)"}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(222, 30%, 18%)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              stroke="hsl(215, 20%, 55%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                if (value === 1) return "30d ago";
                if (value === 31) return "Today";
                if (value === 38) return "+7d";
                return "";
              }}
            />
            <YAxis
              stroke="hsl(215, 20%, 55%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[minPrice, maxPrice]}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222, 47%, 10%)",
                border: "1px solid hsl(222, 30%, 18%)",
                borderRadius: "8px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
              labelStyle={{ color: "hsl(215, 20%, 55%)" }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
              labelFormatter={(label) => `Day ${label}`}
            />
            <ReferenceLine
              x={31}
              stroke="hsl(173, 80%, 50%)"
              strokeDasharray="5 5"
              strokeOpacity={0.5}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="hsl(173, 80%, 50%)"
              strokeWidth={2}
              fill="url(#colorPrice)"
              className="chart-line-glow"
            />
            <Area
              type="monotone"
              dataKey="predicted"
              stroke={isBullish ? "hsl(160, 84%, 45%)" : "hsl(0, 72%, 55%)"}
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="url(#colorPrediction)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockChart;
