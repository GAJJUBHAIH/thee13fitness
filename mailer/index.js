import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();

// Security Hardening
app.use(helmet());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

app.use(cors());
app.use(express.json());
app.use('/api', apiLimiter);

// Note: In production, configure SMTP via ENV variables
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email', // Ethereal is a fake SMTP service for testing
  port: 587,
  auth: {
    user: 'test@ethereal.email', // Replace with ethereal credentials or real SMTP
    pass: 'testpass'
  }
});

app.post('/api/generate-invoice', async (req, res) => {
  try {
    const order = req.body;
    
    if (!order || !order.orderId) {
      return res.status(400).json({ error: 'Invalid order data' });
    }

    // Generate PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { height, width } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // PDF Header
    page.drawText('Three13 Fitness - Invoice', { x: 50, y: height - 50, size: 20, font: boldFont });
    page.drawText(`Order ID: ${order.orderId}`, { x: 50, y: height - 80, size: 12, font });
    page.drawText(`Date: ${new Date().toLocaleDateString()}`, { x: 50, y: height - 100, size: 12, font });
    
    // Customer Info
    const customer = order.customerSnapshot || {};
    page.drawText(`Billed To: ${customer.name || 'Guest User'}`, { x: 50, y: height - 140, size: 12, font: boldFont });
    page.drawText(`Email: ${customer.email || 'N/A'}`, { x: 50, y: height - 160, size: 12, font });

    // Items
    let yPos = height - 200;
    page.drawText('Item', { x: 50, y: yPos, size: 12, font: boldFont });
    page.drawText('Qty', { x: 350, y: yPos, size: 12, font: boldFont });
    page.drawText('Price', { x: 450, y: yPos, size: 12, font: boldFont });
    
    yPos -= 20;
    const products = order.products || [];
    products.forEach(item => {
      page.drawText(item.name || 'Unknown Item', { x: 50, y: yPos, size: 12, font });
      page.drawText(String(item.quantity || 1), { x: 350, y: yPos, size: 12, font });
      page.drawText(`Rs. ${item.subtotal || 0}`, { x: 450, y: yPos, size: 12, font });
      yPos -= 20;
    });

    yPos -= 20;
    page.drawText(`Total Amount: Rs. ${order.amount || 0}`, { x: 350, y: yPos, size: 14, font: boldFont });

    const pdfBytes = await pdfDoc.save();
    const pdfPath = path.join(process.cwd(), `invoice_${order.orderId}.pdf`);
    fs.writeFileSync(pdfPath, pdfBytes);

    // Send Email
    if (customer.email) {
      await transporter.sendMail({
        from: '"Three13 Fitness" <no-reply@three13.com>',
        to: customer.email,
        subject: `Your Invoice for Order ${order.orderId}`,
        text: 'Thank you for your purchase. Please find your invoice attached.',
        attachments: [
          {
            filename: `invoice_${order.orderId}.pdf`,
            content: pdfBytes,
          }
        ]
      });
      console.log(`Email sent to ${customer.email} for order ${order.orderId}`);
    } else {
      console.log('No email provided in order, skipping email sending.');
    }

    res.status(200).json({ success: true, message: 'Invoice generated and emailed' });

  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ error: 'Failed to process invoice' });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Mailer service running on port ${PORT}`);
});
