import "https://deno.land/x/xhr@0.3.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbol } = await req.json();
    const apiKey = Deno.env.get("ALPHA_VANTAGE_API_KEY");

    if (!apiKey) {
      throw new Error("Alpha Vantage API key not configured");
    }

    if (!symbol) {
      throw new Error("Stock symbol is required");
    }

    // Fetch current quote
    const quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
    const quoteResponse = await fetch(quoteUrl);
    const quoteData = await quoteResponse.json();

    // Fetch daily time series for historical data
    const timeSeriesUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${apiKey}`;
    const timeSeriesResponse = await fetch(timeSeriesUrl);
    const timeSeriesData = await timeSeriesResponse.json();

    // Check for API errors
    if (quoteData["Error Message"] || timeSeriesData["Error Message"]) {
      throw new Error("Invalid stock symbol or API error");
    }

    if (quoteData["Note"] || timeSeriesData["Note"]) {
      throw new Error("API rate limit reached. Please try again in a minute.");
    }

    const globalQuote = quoteData["Global Quote"];
    if (!globalQuote || Object.keys(globalQuote).length === 0) {
      throw new Error("No data found for this symbol");
    }

    const currentPrice = parseFloat(globalQuote["05. price"]);
    const previousClose = parseFloat(globalQuote["08. previous close"]);
    const change = parseFloat(globalQuote["09. change"]);
    const changePercent = parseFloat(globalQuote["10. change percent"]?.replace("%", "") || "0");
    const volume = parseInt(globalQuote["06. volume"]);
    const high = parseFloat(globalQuote["03. high"]);
    const low = parseFloat(globalQuote["04. low"]);

    // Process historical data
    const timeSeries = timeSeriesData["Time Series (Daily)"] || {};
    const historicalData = Object.entries(timeSeries)
      .slice(0, 30) // Last 30 days
      .map(([date, values]: [string, any]) => ({
        date,
        open: parseFloat(values["1. open"]),
        high: parseFloat(values["2. high"]),
        low: parseFloat(values["3. low"]),
        close: parseFloat(values["4. close"]),
        volume: parseInt(values["5. volume"]),
      }))
      .reverse();

    return new Response(
      JSON.stringify({
        symbol: symbol.toUpperCase(),
        currentPrice,
        previousClose,
        change,
        changePercent,
        volume,
        high,
        low,
        historicalData,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Stock data error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
