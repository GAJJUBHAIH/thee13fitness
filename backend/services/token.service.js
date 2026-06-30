import { v4 as uuidv4 } from 'uuid';
import { pb } from '../config/pocketbaseAdmin.js';
import QRCode from 'qrcode';

/**
 * Generates a unique token string for membership or product.
 * @param {'membership' | 'product'} type 
 * @returns {string} 
 */
function generateTokenString(type) {
  const year = new Date().getFullYear();
  // Generate 6 random uppercase alphanumeric characters
  const randomStr = uuidv4().replace(/-/g, '').substring(0, 6).toUpperCase();
  const prefix = type === 'membership' ? 'MEM' : 'PROD';
  return `${prefix}-${year}-${randomStr}`;
}

/**
 * Checks if token already exists in database
 * @param {string} tokenId 
 * @returns {Promise<boolean>}
 */
async function isTokenUnique(tokenId) {
  try {
    await pb.collection('tokens').getFirstListItem(`tokenId="${tokenId}"`);
    return false; // Exists
  } catch (err) {
    return true; // Does not exist
  }
}

/**
 * Generates a unique token and saves it to PocketBase.
 * @param {Object} data Token details
 * @returns {Promise<Object>} The generated token object
 */
export async function createAndSaveToken(data) {
  let tokenId;
  let isUnique = false;

  let attempts = 0;
  while (!isUnique && attempts < 5) {
    tokenId = generateTokenString(data.type);
    isUnique = await isTokenUnique(tokenId);
    attempts++;
  }

  if (!isUnique) {
    throw new Error('Failed to generate a unique token after 5 attempts');
  }

  // Generate QR Code
  let qrCodeData = '';
  try {
    qrCodeData = await QRCode.toDataURL(tokenId);
  } catch (err) {
    console.error('Error generating QR code:', err);
  }

  const tokenDoc = {
    tokenId,
    type: data.type,
    userId: data.userId || 'guest',
    user: {
      name: data.userName || '',
      email: data.email || '',
      phone: data.phone || ''
    },
    itemId: data.itemId || '',
    itemName: data.itemName || '',
    amount: data.amount || 0,
    quantity: data.quantity || 1,
    status: 'active',
    purchaseDate: new Date().toISOString(),
    qrCodeData,
    ...(data.extraData || {})
  };

  if (data.type === 'membership') {
    // Add 1 month by default if not specified
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 1);
    tokenDoc.expiryDate = expiry.toISOString();
  }

  try {
    const record = await pb.collection('tokens').create(tokenDoc);
    
    // PocketBase user collection doesn't have purchasedTokens by default, but if it did:
    if (data.userId && data.userId !== 'guest') {
       try {
         const user = await pb.collection('users').getOne(data.userId);
         const purchasedTokens = user.purchasedTokens || [];
         if (!purchasedTokens.includes(record.id)) {
            purchasedTokens.push(record.id);
            await pb.collection('users').update(data.userId, { purchasedTokens });
         }
       } catch (e) {
         console.warn('Could not update user purchasedTokens:', e.message);
       }
    }
    return record;
  } catch (e) {
    console.error('PocketBase error saving token:', e);
    throw new Error('Failed to save token to database');
  }
}

/**
 * Retrieves a token by its ID
 * @param {string} tokenId 
 */
export async function getToken(tokenId) {
  try {
    return await pb.collection('tokens').getFirstListItem(`tokenId="${tokenId}"`);
  } catch (err) {
    return null;
  }
}

/**
 * Retrieves all tokens (for admin)
 */
export async function getAllTokens() {
  try {
    return await pb.collection('tokens').getFullList({
      sort: '-purchaseDate',
    });
  } catch (err) {
    return [];
  }
}
