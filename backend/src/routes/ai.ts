import { Router } from 'express';

const router = Router();

router.post('/assistant', async (req, res) => {
  const { prompt, context } = req.body;
  const normalized = (prompt as string)?.toLowerCase() ?? '';

  if (!normalized) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const response = {
    prompt,
    recommendation: 'Based on your preferences, the ideal bundle is a high-performance laptop with a 75W USB-C charger, a privacy-focused webcam, and an extended warranty plan that covers accidental damage.',
    insights: [
      'This configuration is optimized for coding, video editing, and portability.',
      'The selected accessories are matched for compatibility and long-term value.',
      'Estimated ownership cost is lower when bundled with the recommended productivity software subscription.',
    ],
    followUp: 'Would you like me to surface the best EMI and BNPL options available for this bundle?',
  };

  return res.json({ results: response, context });
});

export default router;
