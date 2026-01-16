import { Brain, TrendingUp, Shield, Zap, LineChart, Clock } from "lucide-react";
import Header from "@/components/Header";
import StockSearch from "@/components/StockSearch";
import PredictionCard from "@/components/PredictionCard";
import StockChart from "@/components/StockChart";
import FeatureCard from "@/components/FeatureCard";
import { useStockData } from "@/hooks/useStockData";

const Index = () => {
  const { prediction, isLoading, fetchStockData } = useStockData();

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
          
          <StockSearch onSearch={fetchStockData} isLoading={isLoading} />
        </section>

        {/* Prediction Results */}
        {prediction && (
          <section className="space-y-6 mb-16">
            <PredictionCard {...prediction} />
            <StockChart
              symbol={prediction.symbol}
              currentPrice={prediction.currentPrice}
              predictedPrice={prediction.predictedPrice}
              historicalData={prediction.historicalData}
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
              <strong className="text-foreground">Disclaimer:</strong> This application uses real market data from Alpha Vantage. 
              Stock predictions are algorithmic projections and should not be used for real investment decisions. 
              Always consult with a qualified financial advisor before making investment choices.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
