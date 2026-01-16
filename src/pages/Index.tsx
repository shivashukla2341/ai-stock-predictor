import { useState } from "react";
import { Brain, TrendingUp, Shield, Zap, LineChart, Clock } from "lucide-react";
import Header from "@/components/Header";
import StockSearch from "@/components/StockSearch";
import PredictionCard from "@/components/PredictionCard";
import StockChart from "@/components/StockChart";
import FeatureCard from "@/components/FeatureCard";

interface PredictionData {
  symbol: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  timeframe: string;
}

// Mock stock data for demo purposes
const mockStockData: Record<string, { price: number }> = {
  AAPL: { price: 178.52 },
  GOOGL: { price: 141.80 },
  MSFT: { price: 378.91 },
  TSLA: { price: 248.50 },
  NVDA: { price: 495.22 },
  AMZN: { price: 178.25 },
  META: { price: 505.75 },
  NFLX: { price: 628.40 },
};

const Index = () => {
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (symbol: string) => {
    setIsLoading(true);
    
    // Simulate AI prediction delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const stockData = mockStockData[symbol] || { price: 100 + Math.random() * 400 };
    const currentPrice = stockData.price;
    
    // Generate mock prediction (random but realistic)
    const changePercent = (Math.random() - 0.4) * 15; // Slight bullish bias
    const predictedPrice = currentPrice * (1 + changePercent / 100);
    const confidence = Math.floor(70 + Math.random() * 25);
    
    setPrediction({
      symbol,
      currentPrice,
      predictedPrice,
      confidence,
      timeframe: "7 Days",
    });
    
    setIsLoading(false);
  };

  const features = [
    {
      icon: Brain,
      title: "Deep Learning Models",
      description: "Advanced neural networks trained on decades of market data for accurate predictions.",
    },
    {
      icon: TrendingUp,
      title: "Real-time Analysis",
      description: "Continuous market monitoring with instant prediction updates as conditions change.",
    },
    {
      icon: Shield,
      title: "Risk Assessment",
      description: "Comprehensive risk metrics and confidence scores for informed decision making.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get predictions in seconds with our optimized AI infrastructure.",
    },
    {
      icon: LineChart,
      title: "Technical Indicators",
      description: "Integration of 50+ technical indicators for comprehensive market analysis.",
    },
    {
      icon: Clock,
      title: "Multiple Timeframes",
      description: "Predictions for short-term trades to long-term investments.",
    },
  ];

  return (
    <div className="min-h-screen hero-gradient">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Hero Section */}
        <section className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Powered by Advanced AI</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Predict Stock Prices
            <br />
            <span className="text-gradient">with AI Precision</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Harness the power of machine learning to forecast market movements. 
            Get data-driven insights for smarter investment decisions.
          </p>
          
          <StockSearch onSearch={handleSearch} isLoading={isLoading} />
        </section>

        {/* Prediction Results */}
        {prediction && (
          <section className="space-y-6 mb-16">
            <PredictionCard {...prediction} />
            <StockChart
              symbol={prediction.symbol}
              currentPrice={prediction.currentPrice}
              predictedPrice={prediction.predictedPrice}
            />
          </section>
        )}

        {/* Features Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="text-gradient">StockAI</span>?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our cutting-edge AI technology provides you with the insights you need to stay ahead of the market.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                delay={index * 100}
              />
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="text-center">
          <div className="glass-card p-6 max-w-2xl mx-auto">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Disclaimer:</strong> This is a demo application. 
              Stock predictions are simulated and should not be used for real investment decisions. 
              Always consult with a qualified financial advisor before making investment choices.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
