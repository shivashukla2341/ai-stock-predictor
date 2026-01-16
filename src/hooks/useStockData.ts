import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface StockData {
  symbol: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  historicalData: {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
}

export interface PredictionData {
  symbol: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  timeframe: string;
  change: number;
  changePercent: number;
  historicalData: StockData["historicalData"];
}

export const useStockData = () => {
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStockData = async (symbol: string): Promise<void> => {
    setIsLoading(true);
    setPrediction(null);

    try {
      const { data, error } = await supabase.functions.invoke("stock-data", {
        body: { symbol },
      });

      if (error) {
        throw new Error(error.message || "Failed to fetch stock data");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const stockData = data as StockData;

      // Generate AI prediction based on historical trends
      const historicalPrices = stockData.historicalData.map((d) => d.close);
      const avgChange = calculateAverageChange(historicalPrices);
      const volatility = calculateVolatility(historicalPrices);
      
      // Simple prediction model: trend + momentum
      const trendFactor = avgChange * 7; // 7-day projection
      const momentumFactor = stockData.changePercent * 0.3; // Recent momentum
      const predictedChange = trendFactor + momentumFactor;
      const predictedPrice = stockData.currentPrice * (1 + predictedChange / 100);
      
      // Confidence based on volatility (lower volatility = higher confidence)
      const baseConfidence = 85;
      const volatilityPenalty = Math.min(volatility * 2, 20);
      const confidence = Math.max(60, Math.round(baseConfidence - volatilityPenalty));

      setPrediction({
        symbol: stockData.symbol,
        currentPrice: stockData.currentPrice,
        predictedPrice,
        confidence,
        timeframe: "7 Days",
        change: stockData.change,
        changePercent: stockData.changePercent,
        historicalData: stockData.historicalData,
      });

      toast.success(`Live data loaded for ${stockData.symbol}`);
    } catch (error) {
      console.error("Error fetching stock data:", error);
      toast.error(error instanceof Error ? error.message : "Failed to fetch stock data");
    } finally {
      setIsLoading(false);
    }
  };

  return { prediction, isLoading, fetchStockData };
};

function calculateAverageChange(prices: number[]): number {
  if (prices.length < 2) return 0;
  let totalChange = 0;
  for (let i = 1; i < prices.length; i++) {
    totalChange += ((prices[i] - prices[i - 1]) / prices[i - 1]) * 100;
  }
  return totalChange / (prices.length - 1);
}

function calculateVolatility(prices: number[]): number {
  if (prices.length < 2) return 0;
  const changes: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    changes.push(((prices[i] - prices[i - 1]) / prices[i - 1]) * 100);
  }
  const mean = changes.reduce((a, b) => a + b, 0) / changes.length;
  const squaredDiffs = changes.map((c) => Math.pow(c - mean, 2));
  return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length);
}
