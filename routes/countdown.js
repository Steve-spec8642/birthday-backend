import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  const birthdayDate = process.env.BIRTHDAY_DATE;

  if (!birthdayDate) {
    return res.status(500).json({ error: 'BIRTHDAY_DATE is not set on the server.' });
  }

  res.json({ targetDate: birthdayDate });
});

export default router;