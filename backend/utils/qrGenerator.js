// Patient ID QR Code Generator Simulation

const generatePatientQR = (patientId, patientName) => {
  const qrDataString = `HEMS-SANJEEVANI|PATIENT_ID:${patientId}|NAME:${patientName}|HOSPITAL:Sector 32 Chandigarh`;
  return {
    patientId,
    qrDataString,
    qrSvgSimulated: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrDataString)}`
  };
};

module.exports = { generatePatientQR };
