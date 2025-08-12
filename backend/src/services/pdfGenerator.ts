// backend/src/services/pdfGenerator.ts
import fs from 'fs';
import path from 'path';


interface TaxEvent {
  date: string;
  pair: string;
  gainLoss?: number;
}

export class PDFGenerator {
  static generateTaxReport(summary: any, year: number, transactions: any[]): string {
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      }).format(amount);
    };

    const formatYen = (amount: number) => {
      const jpy = amount * 150;
      return new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY',
        minimumFractionDigits: 0
      }).format(jpy);
    };

    const formatDate = (date: Date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const netGains = summary.totalCapitalGains - summary.totalCapitalLosses;

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Crypto Tax Report ${year}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #2563eb;
            margin: 0;
            font-size: 28px;
        }
        .header p {
            color: #666;
            margin: 5px 0;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }
        .summary-card {
            border: 1px solid #e5e7eb;
            padding: 20px;
            border-radius: 8px;
            background: #f9fafb;
        }
        .summary-card h3 {
            margin: 0 0 10px 0;
            color: #374151;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .summary-card .amount {
            font-size: 24px;
            font-weight: bold;
            margin: 0;
        }
        .gain { color: #059669; }
        .loss { color: #dc2626; }
        .neutral { color: #2563eb; }
        .details-section {
            margin: 30px 0;
        }
        .details-section h2 {
            color: #374151;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
        }
        .details-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .details-table th,
        .details-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        .details-table th {
            background: #f3f4f6;
            font-weight: 600;
            color: #374151;
        }
        .details-table tr:nth-child(even) {
            background: #f9fafb;
        }
        .tax-info {
            background: #dbeafe;
            border: 1px solid #93c5fd;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
        }
        .tax-info h3 {
            color: #1e40af;
            margin: 0 0 15px 0;
        }
        .tax-info ul {
            margin: 0;
            padding-left: 20px;
        }
        .tax-info li {
            margin: 5px 0;
            color: #1e3a8a;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
        }
        .disclaimer {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
        }
        .disclaimer strong {
            color: #92400e;
        }
        @media print {
            body { margin: 0; padding: 15px; }
            .summary-grid { break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Crypto Tax Report</h1>
        <p>Tax Year: ${year}</p>
        <p>Generated on: ${currentDate}</p>
        <p>Calculation Method: FIFO (First In, First Out)</p>
    </div>

    <div class="summary-grid">
        <div class="summary-card">
            <h3>Capital Gains</h3>
            <p class="amount gain">${formatCurrency(summary.totalCapitalGains)}</p>
        </div>
        <div class="summary-card">
            <h3>Capital Losses</h3>
            <p class="amount loss">${formatCurrency(summary.totalCapitalLosses)}</p>
        </div>
        <div class="summary-card">
            <h3>Net Capital Gains</h3>
            <p class="amount ${netGains >= 0 ? 'gain' : 'loss'}">${formatCurrency(netGains)}</p>
        </div>
        <div class="summary-card">
            <h3>Estimated Japan Tax (20%)</h3>
            <p class="amount neutral">${formatYen(summary.japanTaxOwed)}</p>
            <p style="font-size: 12px; color: #6b7280; margin: 5px 0 0 0;">${formatCurrency(summary.japanTaxOwed)}</p>
        </div>
    </div>

    <div class="details-section">
        <h2>Transaction Summary</h2>
        <table class="details-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Pair</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Price</th>
                    <th>Total Value</th>
                    <th>Gain/Loss</th>
                </tr>
            </thead>
            <tbody>
                ${transactions.map(tx => `
                <tr>
                    <td>${formatDate(tx.date)}</td>
                    <td>${tx.pair}</td>
                    <td><span style="color: ${tx.side === 'BUY' ? '#059669' : '#dc2626'}">${tx.side}</span></td>
                    <td>${tx.amount.toFixed(4)}</td>
                    <td>${formatCurrency(tx.price)}</td>
                    <td>${formatCurrency(tx.amount * tx.price)}</td>
                    <td>${tx.side === 'SELL' && summary.events ? 
                        (() => {
                            const event = summary.events.find((e: TaxEvent) =>
                                e.pair === tx.pair && 
                                Math.abs(new Date(e.date).getTime() - new Date(tx.date).getTime()) < 60000
                            );
                            return event && event.gainLoss !== undefined ? 
                                `<span style="color: ${event.gainLoss >= 0 ? '#059669' : '#dc2626'}">${formatCurrency(event.gainLoss)}</span>` : 
                                '-';
                        })()
                        : '-'
                    }</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
    </div>

    <div class="details-section">
        <h2>Tax Calculation Details</h2>
        <table class="details-table">
            <tr>
                <td><strong>Total Capital Gains:</strong></td>
                <td class="gain"><strong>${formatCurrency(summary.totalCapitalGains)}</strong></td>
            </tr>
            <tr>
                <td><strong>Total Capital Losses:</strong></td>
                <td class="loss"><strong>-${formatCurrency(summary.totalCapitalLosses)}</strong></td>
            </tr>
            <tr>
                <td><strong>Net Capital Gains:</strong></td>
                <td class="${netGains >= 0 ? 'gain' : 'loss'}"><strong>${formatCurrency(netGains)}</strong></td>
            </tr>
            <tr>
                <td><strong>Total Trading Fees:</strong></td>
                <td>${formatCurrency(summary.totalFees)}</td>
            </tr>
            <tr>
                <td><strong>Tax Rate (Simplified):</strong></td>
                <td>20%</td>
            </tr>
            <tr style="border-top: 2px solid #2563eb;">
                <td><strong>Estimated Tax Owed (Japan):</strong></td>
                <td class="neutral"><strong>${formatYen(summary.japanTaxOwed)}</strong></td>
            </tr>
        </table>
    </div>

    <div class="tax-info">
        <h3>Japan Tax Filing Information</h3>
        <ul>
            <li>Cryptocurrency gains are treated as miscellaneous income in Japan</li>
            <li>Progressive tax rates apply: 5% to 45% + 10% local tax</li>
            <li>This calculation uses a simplified 20% rate for estimation purposes</li>
            <li>Annual filing deadline: March 15th following the tax year</li>
            <li>Gains above ¥200,000 must be reported for salaried employees</li>
            <li>All gains must be reported for self-employed individuals</li>
        </ul>
    </div>

    <div class="disclaimer">
        <strong>Disclaimer:</strong> This report is for informational purposes only and should not be considered as professional tax advice. 
        Tax laws are complex and subject to change. Please consult with a qualified tax professional or accountant 
        familiar with Japanese cryptocurrency tax regulations for accurate filing guidance.
    </div>

    <div class="footer">
        <p>Generated by Crypto Tax Calculator</p>
        <p>Report ID: CTR-${year}-${Date.now()}</p>
    </div>
</body>
</html>`;

    return html;
  }
}