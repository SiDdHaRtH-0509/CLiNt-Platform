// utils/certificate.js - PDF Certificate Generator
const PDFDocument = require('pdfkit');
const { v4: uuidv4 } = require('uuid');
const { Certificate } = require('../models/index');
const path = require('path');
const fs = require('fs');

const generateCertificateId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'CLINT-';
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
};

const generateCertificatePDF = (user, workshop, certificateId) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 50 });
    const outputPath = path.join(__dirname, '../uploads/certificates', `${certificateId}.pdf`);
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    const w = 841.89, h = 595.28;

    // Background
    doc.rect(0, 0, w, h).fill('#050810');

    // Border decorations
    doc.rect(30, 30, w - 60, h - 60).stroke('#1e2d47').lineWidth(1);
    doc.rect(40, 40, w - 80, h - 80).stroke('#00d4ff').lineWidth(0.5);

    // Corner accents
    [[40, 40], [w - 80, 40], [40, h - 80], [w - 80, h - 80]].forEach(([x, y]) => {
      doc.moveTo(x, y).lineTo(x + 30, y).stroke('#00d4ff').lineWidth(2);
      doc.moveTo(x, y).lineTo(x, y + 30).stroke('#00d4ff').lineWidth(2);
    });

    // Header
    doc.font('Helvetica-Bold').fontSize(11).fillColor('#94a3b8')
       .text('CLINT TECHNOLOGIES PRESENTS', 0, 100, { align: 'center', characterSpacing: 4 });

    doc.font('Helvetica-Bold').fontSize(40).fillColor('#00d4ff')
       .text('Certificate of Completion', 0, 125, { align: 'center' });

    // Divider line
    doc.moveTo(200, 185).lineTo(w - 200, 185).stroke('#1e2d47').lineWidth(1);

    // Body text
    doc.font('Helvetica').fontSize(13).fillColor('#94a3b8')
       .text('This is to certify that', 0, 205, { align: 'center' });

    doc.font('Helvetica-Bold').fontSize(32).fillColor('#e8f0fe')
       .text(user.name, 0, 230, { align: 'center' });

    doc.font('Helvetica').fontSize(13).fillColor('#94a3b8')
       .text('has successfully completed the workshop', 0, 278, { align: 'center' });

    doc.font('Helvetica-Bold').fontSize(20).fillColor('#7c3aed')
       .text(workshop.title, 0, 305, { align: 'center' });

    const dateStr = new Date(workshop.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.font('Helvetica').fontSize(12).fillColor('#64748b')
       .text(`Conducted on ${dateStr} · Duration: ${workshop.duration}`, 0, 340, { align: 'center' });

    // Bottom section
    doc.moveTo(200, 395).lineTo(w - 200, 395).stroke('#1e2d47').lineWidth(1);

    // Signatures
    const sigY = 420;
    doc.font('Helvetica-Bold').fontSize(14).fillColor('#e8f0fe')
       .text(workshop.instructor, 200, sigY, { width: 180, align: 'center' });
    doc.font('Helvetica').fontSize(10).fillColor('#64748b')
       .text('Workshop Instructor', 200, sigY + 20, { width: 180, align: 'center' });

    doc.font('Helvetica-Bold').fontSize(14).fillColor('#e8f0fe')
       .text('CLiNt Team', w - 380, sigY, { width: 180, align: 'center' });
    doc.font('Helvetica').fontSize(10).fillColor('#64748b')
       .text('CLiNt Technologies', w - 380, sigY + 20, { width: 180, align: 'center' });

    // Certificate ID
    doc.font('Helvetica').fontSize(9).fillColor('#1e2d47')
       .text(`Certificate ID: ${certificateId} · Verify at clint.dev/verify/${certificateId}`,
         0, h - 60, { align: 'center' });

    doc.end();
    writeStream.on('finish', () => resolve(outputPath));
    writeStream.on('error', reject);
  });
};

const issueCertificate = async (userId, workshopId) => {
  const User = require('../models/User');
  const Workshop = require('../models/Workshop');
  const user = await User.findById(userId);
  const workshop = await Workshop.findById(workshopId);
  if (!user || !workshop) throw new Error('User or workshop not found');

  const existing = await Certificate.findOne({ user: userId, workshop: workshopId });
  if (existing) return existing;

  const certId = generateCertificateId();
  const uploadsDir = path.join(__dirname, '../uploads/certificates');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const pdfPath = await generateCertificatePDF(user, workshop, certId);
  const pdfUrl = `/uploads/certificates/${certId}.pdf`;

  const certificate = await Certificate.create({
    user: userId, workshop: workshopId,
    certificateId: certId, pdfUrl,
    verificationUrl: `https://clint.dev/verify/${certId}`,
  });

  return certificate;
};

module.exports = { issueCertificate, generateCertificatePDF };

// ============================================================
// utils/email.js - Email Notifications
const nodemailer = require('nodemailer');

const getTransporter = () => nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const sendEmail = async (to, subject, html) => {
  const transporter = getTransporter();
  await transporter.sendMail({ from: '"CLiNt Technologies" <noreply@clint.dev>', to, subject, html });
};

const emailStyles = `
  body { font-family: 'Segoe UI', sans-serif; background: #050810; color: #e8f0fe; }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
  .logo { font-size: 24px; font-weight: 800; color: #e8f0fe; margin-bottom: 32px; }
  .logo span { color: #00d4ff; }
  .card { background: #111827; border: 1px solid #1e2d47; border-radius: 16px; padding: 32px; }
  .btn { display: inline-block; background: linear-gradient(135deg, #00d4ff, #7c3aed); color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px; }
  .footer { margin-top: 32px; color: #64748b; font-size: 12px; text-align: center; }
`;

const sendWelcomeEmail = async (email, name) => {
  const html = `<html><head><style>${emailStyles}</style></head><body>
    <div class="container">
      <div class="logo">CLi<span>Nt</span></div>
      <div class="card">
        <h2>Welcome to CLiNt, ${name}! 🎉</h2>
        <p>You've successfully created your account. Explore our workshops and start your learning journey.</p>
        <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/workshops" class="btn">Browse Workshops →</a>
      </div>
      <div class="footer">© 2025 CLiNt Technologies</div>
    </div></body></html>`;
  await sendEmail(email, 'Welcome to CLiNt! 🚀', html);
};

const sendApprovalEmail = async (email, college, topic) => {
  const html = `<html><head><style>${emailStyles}</style></head><body>
    <div class="container">
      <div class="logo">CLi<span>Nt</span></div>
      <div class="card">
        <h2>Workshop Request Approved! ✅</h2>
        <p>Great news! Your workshop request from <strong>${college}</strong> for <strong>${topic}</strong> has been approved.</p>
        <p>Our team will contact you within 48 hours to finalize the schedule and logistics.</p>
        <a href="${process.env.CLIENT_URL}" class="btn">Visit CLiNt Platform →</a>
      </div>
      <div class="footer">© 2025 CLiNt Technologies</div>
    </div></body></html>`;
  await sendEmail(email, 'Your CLiNt Workshop Request is Approved! ✅', html);
};

const sendCertificateEmail = async (email, name, workshopTitle, pdfUrl) => {
  const html = `<html><head><style>${emailStyles}</style></head><body>
    <div class="container">
      <div class="logo">CLi<span>Nt</span></div>
      <div class="card">
        <h2>Your Certificate is Ready! 🏆</h2>
        <p>Congratulations, ${name}! Your certificate for <strong>${workshopTitle}</strong> is now available.</p>
        <a href="${process.env.CLIENT_URL}${pdfUrl}" class="btn">Download Certificate →</a>
      </div>
      <div class="footer">© 2025 CLiNt Technologies</div>
    </div></body></html>`;
  await sendEmail(email, `Your CLiNt Certificate for ${workshopTitle} is Ready! 🏆`, html);
};

module.exports = { sendWelcomeEmail, sendApprovalEmail, sendCertificateEmail };
