import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { getToken } from '../services/token.service.js';
import { pb } from '../config/pocketbaseAdmin.js';

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
  if (!pb) return res.json([]);

  try {
    const tokens = await pb.collection('tokens').getFullList({
      filter: `userId="${userId}"`,
      sort: '-purchaseDate',
    });
    res.json(tokens);
  } catch (err) {
    console.error('Error fetching user tokens from PocketBase:', err);
    res.status(500).json({ error: 'Failed to fetch tokens' });
  }
}));

export default router;