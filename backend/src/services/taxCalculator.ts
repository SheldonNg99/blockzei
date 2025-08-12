// backend/src/services/taxCalculator.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TaxEvent {
  date: Date;
  pair: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  costBasis?: number;
  gainLoss?: number;
  fee: number;
}

interface TaxSummary {
  totalCapitalGains: number;
  totalCapitalLosses: number;
  netCapitalGains: number;
  totalFees: number;
  japanTaxOwed: number;
  events: TaxEvent[];
}

export class TaxCalculator {
  private holdings: Map<string, Array<{amount: number, price: number, date: Date}>> = new Map();
  
  async calculateTaxes(year: number = 2024): Promise<TaxSummary> {
    // Get all transactions for the tax year
    const transactions = await prisma.transaction.findMany({
      where: {
        date: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`)
        }
      },
      orderBy: { date: 'asc' }
    });

    const events: TaxEvent[] = [];
    let totalCapitalGains = 0;
    let totalCapitalLosses = 0;
    let totalFees = 0;

    for (const tx of transactions) {
      const baseAsset = this.getBaseAsset(tx.pair);
      
      totalFees += tx.fee;

      if (tx.side === 'BUY') {
        this.addToHoldings(baseAsset, tx.amount, tx.price, tx.date);
        
        events.push({
          date: tx.date,
          pair: tx.pair,
          type: 'buy',
          amount: tx.amount,
          price: tx.price,
          fee: tx.fee
        });
      } else if (tx.side === 'SELL') {
        const { costBasis, gainLoss } = this.calculateSellGainLoss(
          baseAsset, 
          tx.amount, 
          tx.price
        );

        if (gainLoss > 0) {
          totalCapitalGains += gainLoss;
        } else {
          totalCapitalLosses += Math.abs(gainLoss);
        }

        events.push({
          date: tx.date,
          pair: tx.pair,
          type: 'sell',
          amount: tx.amount,
          price: tx.price,
          costBasis,
          gainLoss,
          fee: tx.fee
        });
      }
    }

    const netCapitalGains = totalCapitalGains - totalCapitalLosses;
    
    // Japan crypto tax calculation (miscellaneous income, progressive rates)
    // For simplicity, using 20% rate (actual rates vary by income bracket)
    const japanTaxOwed = Math.max(0, netCapitalGains * 0.20);

    return {
      totalCapitalGains,
      totalCapitalLosses,
      netCapitalGains,
      totalFees,
      japanTaxOwed,
      events
    };
  }

  private getBaseAsset(pair: string): string {
    // Extract base asset from trading pair (e.g., BTCUSDT -> BTC)
    const baseAssets = ['BTC', 'ETH', 'ADA', 'SOL', 'MATIC', 'DOT', 'LINK', 'UNI'];
    for (const asset of baseAssets) {
      if (pair.startsWith(asset)) {
        return asset;
      }
    }
    return pair.replace('USDT', '').replace('BUSD', '').replace('BTC', '');
  }

  private addToHoldings(asset: string, amount: number, price: number, date: Date) {
    if (!this.holdings.has(asset)) {
      this.holdings.set(asset, []);
    }
    
    this.holdings.get(asset)!.push({ amount, price, date });
  }

  private calculateSellGainLoss(asset: string, sellAmount: number, sellPrice: number) {
    const holdings = this.holdings.get(asset) || [];
    
    if (holdings.length === 0) {
      // No holdings - assume cost basis of 0 (shouldn't happen with good data)
      return {
        costBasis: 0,
        gainLoss: sellAmount * sellPrice
      };
    }

    let remainingToSell = sellAmount;
    let totalCostBasis = 0;
    
    // FIFO method - sell oldest holdings first
    while (remainingToSell > 0 && holdings.length > 0) {
      const oldest = holdings[0];
      
      if (oldest.amount <= remainingToSell) {
        // Sell entire oldest holding
        totalCostBasis += oldest.amount * oldest.price;
        remainingToSell -= oldest.amount;
        holdings.shift(); // Remove from holdings
      } else {
        // Partially sell oldest holding
        totalCostBasis += remainingToSell * oldest.price;
        oldest.amount -= remainingToSell;
        remainingToSell = 0;
      }
    }

    const saleProceeds = sellAmount * sellPrice;
    const gainLoss = saleProceeds - totalCostBasis;

    return {
      costBasis: totalCostBasis,
      gainLoss
    };
  }
}