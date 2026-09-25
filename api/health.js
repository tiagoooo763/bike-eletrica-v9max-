export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    gateway: 'FlevoPay',
    productHash: 'prod_10b3a75f467b0a11',
    environment: 'Vercel Serverless',
    timestamp: new Date()
  });
}
