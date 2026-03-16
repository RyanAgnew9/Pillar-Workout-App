export const scoringConfig = {
  repsWeight: 0.4,
  goalsWeight: 0.35,
  consistencyWeight: 0.25,
  greenThreshold: 75,
  yellowThreshold: 45,
};

export const scoreToBucket = (score: number) => {
  if (score >= scoringConfig.greenThreshold) return 'green';
  if (score >= scoringConfig.yellowThreshold) return 'yellow';
  return 'red';
};
