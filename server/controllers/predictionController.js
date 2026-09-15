const asyncHandler = require('../lib/asyncHandler');
const { predictConditions, FALLBACK } = require('../lib/diseasePrediction');

const predict = asyncHandler(async (req, res) => {
  const { symptoms } = req.body;
  const { results, hasMatch } = predictConditions(symptoms);

  res.json({
    hasMatch,
    results: hasMatch ? results : [FALLBACK],
  });
});

module.exports = { predict };
