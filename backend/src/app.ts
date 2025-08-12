// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import multer from 'multer';
import path from 'path';
import { PrismaClient } from './generated/prisma';
import fs from 'fs';

import { TaxCalculator } from './services/taxCalculator';
import { PDFGenerator } from './services/pdfGenerator';

const app = express();
const prisma = new PrismaClient();
const taxCalculator = new TaxCalculator();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'csv-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// CSV Parser function
async function parseBinanceCSV(filename: string) {
  try {
    const filePath = `uploads/${filename}`;
    const csvContent = fs.readFileSync(filePath, 'utf-8');
    
    // Clean up CSV content and split by lines
    const lines = csvContent.trim().split('\n');
    const rawHeaders = lines[0].split(',');
    
    // Clean headers - remove quotes and carriage returns
    const headers = rawHeaders.map(header => 
      header.replace(/"/g, '').replace(/\r/g, '').trim()
    );
    
    console.log('Cleaned headers:', headers);
    
    const transactions = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      
      if (values.length !== headers.length) {
        console.warn(`Skipping malformed row ${i}`);
        continue;
      }
      
      // Create row object with cleaned values
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index]?.replace(/"/g, '').replace(/\r/g, '').trim();
      });
      
      // Parse date properly
      const dateStr = row['Date(UTC)'];
      const parsedDate = new Date(dateStr);
      
      // Skip if date is invalid
      if (isNaN(parsedDate.getTime())) {
        console.warn(`Skipping invalid date: ${dateStr}`);
        continue;
      }
      
      // Parse transaction
      const transaction = {
        date: parsedDate,
        pair: row['Pair'],
        side: row['Side']?.toUpperCase(),
        amount: parseFloat(row['Amount']) || 0,
        price: parseFloat(row['Price']) || 0,
        fee: parseFloat(row['Fee']) || 0,
        feeCoin: row['Fee Coin'] || '',
        realizedPnl: parseFloat(row['Realized PnL']) || null,
        uploadId: filename,
        isProcessed: false
      };
      
      // Basic validation
      if (!transaction.pair || !transaction.side) {
        console.warn(`Skipping invalid transaction:`, transaction);
        continue;
      }
      
      transactions.push(transaction);
    }
    
    // Save to database
    const saved = await prisma.transaction.createMany({
      data: transactions,
      skipDuplicates: true
    });
    
    console.log(`Saved ${saved.count} transactions to database`);
    
    return {
      success: true,
      count: saved.count,
      transactions: transactions
    };
    
  } catch (error) {
    console.error('CSV parsing error:', error);
    throw new Error(`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Crypto Tax Calculator API' });
});

app.post('/api/upload-csv', upload.single('csvFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    console.log('Processing file:', req.file.filename);
    
    // Parse CSV and save to database
    const result = await parseBinanceCSV(req.file.filename);
    
    res.json({
      message: 'File processed successfully',
      filename: req.file.filename,
      originalName: req.file.originalname,
      transactionsCount: result.count,
      transactions: result.transactions
    });
    
  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({ 
      error: 'Processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: 'desc' },
      take: 100 // Limit to 100 recent transactions
    });
    
    res.json({ transactions });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get tax calculation
app.get('/api/tax-summary', async (req, res) => {
  try {
    const year = parseInt(req.query.year as string) || 2024;
    const taxSummary = await taxCalculator.calculateTaxes(year);
    
    res.json({
      success: true,
      year,
      summary: taxSummary
    });
  } catch (error) {
    console.error('Tax calculation error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to calculate taxes',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Generate PDF report
app.get('/api/generate-report', async (req, res) => {
  try {
    const year = parseInt(req.query.year as string) || 2024;
    
    // Get tax summary
    const taxSummary = await taxCalculator.calculateTaxes(year);
    
    // Get transactions for the year
    const transactions = await prisma.transaction.findMany({
      where: {
        date: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`)
        }
      },
      orderBy: { date: 'asc' }
    });

    // Generate HTML report
    const htmlContent = PDFGenerator.generateTaxReport(taxSummary, year, transactions);
    
    // Set headers for download
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="crypto-tax-report-${year}.html"`);
    
    res.send(htmlContent);
    
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate report',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default app;