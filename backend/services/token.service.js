import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/firebaseAdmin.js';
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
  if (!db) return true; // Fallback
  const doc = await db.collection('tokens').doc(tokenId).get();
  return !doc.exists;
}

/**
 * Generates a unique token and saves it to Firestore.
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
    purchaseDate: new Date(),
    qrCodeData,
    ...(data.extraData || {})
  };

  if (data.type === 'membership') {
    // Add 1 month by default if not specified
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 1);
    tokenDoc.expiryDate = expiry;
  }

  if (db) {
    await db.collection('tokens').doc(tokenId).set(tokenDoc);
    
    // Update users collection if needed
    if (data.userId && data.userId !== 'guest') {
       const userRef = db.collection('users').doc(data.userId);
       const userDoc = await userRef.get();
       if (userDoc.exists) {
          const userData = userDoc.data();
          const purchasedTokens = userData.purchasedTokens || [];
          if (!purchasedTokens.includes(tokenId)) {
             purchasedTokens.push(tokenId);
             await userRef.update({ purchasedTokens });
          }
       }
    }
  } else {
    console.warn('Firestore is not initialized. Token was generated but NOT saved to database.');
  }

  return tokenDoc;
}

/**
 * Retrieves a token by its ID
 * @param {string} tokenId 
 */
export async function getToken(tokenId) {
  if (!db) return null;
  const doc = await db.collection('tokens').doc(tokenId).get();
  if (!doc.exists) return null;
  return doc.data();
}

/**
 * Retrieves all tokens (for admin)
 */
export async function getAllTokens() {
  if (!db) return [];
  const snapshot = await db.collection('tokens').orderBy('purchaseDate', 'desc').get();
  return snapshot.docs.map(doc => doc.data());
}
