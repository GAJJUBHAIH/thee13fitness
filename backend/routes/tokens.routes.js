import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { getToken } from '../services/token.service.js';
import { db } from '../config/firebaseAdmin.js';

const router = Router();

router.get('/verify/:tokenId', asyncHandler(async (req, res) => {
  const { tokenId } = req.params;
  if (!tokenId) return res.status(400).json({ valid: false, error: 'Token ID is required' });

  const tokenData = await getToken(tokenId);
  
  if (tokenData) {
    res.json({ valid: true, data: tokenData });
  } else {
    res.status(404).json({ valid: false, error: 'Invalid Token' });
  }
}));

router.get('/user/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ error: 'User ID is required' });
  if (!db) return res.json([]);

  const snapshot = await db.collection('tokens')
    .where('userId', '==', userId)
    .orderBy('purchaseDate', 'desc')
    .get();

  const tokens = snapshot.docs.map(doc => doc.data());
  res.json(tokens);
}));

export default router;