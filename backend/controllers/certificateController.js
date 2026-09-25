const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const Certificate = require('../models/Certificate');

exports.generateCertificate = async (req, res) => {
  try {
    const { attemptId, moduleId } = req.body;
    const certificateId = uuidv4();

    const certificate = await Certificate.create({
      user: req.userId,
      module: moduleId,
      attempt: attemptId,
      certificateId,
    });

    const verifyUrl = `https://your-frontend-domain.com/verify/${certificateId}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate-${certificateId}.pdf`);

    const doc = new PDFDocument();
    doc.pipe(res);

    doc.fontSize(24).text('Certificate of Completion', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Certificate ID: ${certificateId}`, { align: 'center' });
    doc.moveDown();

    const qrImageBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');
    doc.image(qrImageBuffer, { fit: [150, 150], align: 'center' });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.id })
      .populate('user module');
    if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
    res.status(200).json(certificate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};