import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { getAllTokens } from '../services/token.service.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPORTS_DIR = path.join(__dirname, '..', 'reports');

const router = Router();

// In a real app, you would add an admin authentication middleware here

router.get('/tokens', asyncHandler(async (req, res) => {
  const tokens = await getAllTokens();
  res.json(tokens);
}));

router.get('/reports/daily', (req, res) => {
  const date = new Date();
  const dailyName = `daily_${date.getFullYear()}_${(date.getMonth() + 1).toString().padStart(2, '0')}_${date.getDate().toString().padStart(2, '0')}.xlsx`;
  const filePath = path.join(REPORTS_DIR, dailyName);
  
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: 'Report not found' });
  }
});

router.get('/reports/monthly', (req, res) => {
  const date = new Date();
  const monthlyName = `monthly_${date.getFullYear()}_${(date.getMonth() + 1).toString().padStart(2, '0')}.xlsx`;
  const filePath = path.join(REPORTS_DIR, monthlyName);
  
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: 'Report not found' });
  }
});

export default router;