import swaggerDocument from '../../public/swagger/swagger.json';

export default function handler(req, res) {
  res.status(200).json(swaggerDocument);
}