import fs from 'fs';
import path from 'path';
import * as xlsx from 'xlsx';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPORTS_DIR = path.join(__dirname, '..', 'reports');

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

/**
 * Appends a new token record to daily and monthly excel files
 * @param {Object} tokenDoc 
 */
export async function appendToExcelReport(tokenDoc) {
  const date = new Date(tokenDoc.purchaseDate);
  
  // Format for file names
  const dailyName = `daily_${date.getFullYear()}_${(date.getMonth() + 1).toString().padStart(2, '0')}_${date.getDate().toString().padStart(2, '0')}.xlsx`;
  const monthlyName = `monthly_${date.getFullYear()}_${(date.getMonth() + 1).toString().padStart(2, '0')}.xlsx`;
  
  const dailyPath = path.join(REPORTS_DIR, dailyName);
  const monthlyPath = path.join(REPORTS_DIR, monthlyName);

  const rowData = {
    Token: tokenDoc.tokenId,
    Name: tokenDoc.user.name,
    Email: tokenDoc.user.email,
    Phone: tokenDoc.user.phone,
    'Product/Membership': tokenDoc.itemName || tokenDoc.itemId,
    Amount: tokenDoc.amount,
    Status: tokenDoc.status,
    Date: date.toISOString()
  };

  const updateFile = (filePath) => {
    let workbook;
    let worksheet;

    if (fs.existsSync(filePath)) {
      workbook = xlsx.readFile(filePath);
      worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(worksheet);
      data.push(rowData);
      worksheet = xlsx.utils.json_to_sheet(data);
      workbook.Sheets[workbook.SheetNames[0]] = worksheet;
    } else {
      workbook = xlsx.utils.book_new();
      worksheet = xlsx.utils.json_to_sheet([rowData]);
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Sales');
    }

    xlsx.writeFile(workbook, filePath);
  };

  try {
    updateFile(dailyPath);
    updateFile(monthlyPath);
  } catch (error) {
    console.error('Error updating excel reports:', error);
  }
}
