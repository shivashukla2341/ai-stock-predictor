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

interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface StockChartProps {
  symbol: string;
  currentPrice: number;
  predictedPrice: number;
  historicalData?: HistoricalDataPoint[];
}

const StockChart = ({ symbol, currentPrice, predictedPrice, historicalData }: StockChartProps) => {
  const data = useMemo(() => {
    const points: { day: number; price?: number; predicted?: number; type: string; date?: string }[] = [];
    
    if (historicalData && historicalData.length > 0) {
      // Use real historical data
      historicalData.forEach((point, index) => {
        points.push({
          day: index + 1,
          price: point.close,
          type: "historical",
          date: point.date,
        });
      });
      
      // Add current price
      const lastDay = points.length;
      points.push({
        day: lastDay + 1,
        price: currentPrice,
        type: "current",
      });
      
      // Generate prediction data (next 7 days)
      const volatility = currentPrice * 0.01;
      for (let i = 1; i <= 7; i++) {
        const progress = i / 7;
        const trend = (predictedPrice - currentPrice) * progress;
        const noise = (Math.random() - 0.5) * volatility * 0.5;
        points.push({
          day: lastDay + 1 + i,
          predicted: currentPrice + trend + noise,
          type: "prediction",
        });
      }
    } else {
      // Fallback to generated data
      const startPrice = currentPrice * 0.95;
      const volatility = currentPrice * 0.02;
      
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
      
      points.push({
        day: 31,
        price: currentPrice,
        type: "current",
      });
      
      for (let i = 1; i <= 7; i++) {
        const progress = i / 7;
        const trend = (predictedPrice - currentPrice) * progress;
        const noise = (Math.random() - 0.5) * volatility * 0.5;
        points.push({
          day: 31 + i,
          predicted: currentPrice + trend + noise,
          type: "prediction",
        });
      }
    }
    
    return points;
  }, [currentPrice, predictedPrice, historicalData]);

  const isBullish = predictedPrice >= currentPrice;
  const allValues = data.map(d => d.price ?? d.predicted ?? 0);
  const minPrice = Math.min(...allValues) * 0.98;
  const maxPrice = Math.max(...allValues) * 1.02;
  const todayIndex = data.findIndex(d => d.type === "current");

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
                const point = data.find(d => d.day === value);
                if (point?.type === "current") return "Today";
                if (point?.date) {
                  const date = new Date(point.date);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }
                if (value === data.length) return "+7d";
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
              labelFormatter={(label) => {
                const point = data.find(d => d.day === label);
                if (point?.date) return point.date;
                if (point?.type === "current") return "Today";
                return `Day ${label}`;
              }}
            />
            <ReferenceLine
              x={todayIndex + 1}
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
