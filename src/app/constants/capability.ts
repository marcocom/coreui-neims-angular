type MEASUREMENT_SCORE_KEY =
  | 'VERY_GOOD'
  | 'GOOD'
  | 'MEDIUM'
  | 'BAD'
  | 'VERY_BAD';

const MEASUREMENT_SCORE_LABEL: Record<MEASUREMENT_SCORE_KEY, string> = {
  VERY_GOOD: $localize`:Very good map legend label|:Very good`,
  GOOD: $localize`:Good map legend label|:Good`,
  MEDIUM: $localize`:Medium map legend label|:Medium`,
  BAD: $localize`:Bad map legend label|:Bad`,
  VERY_BAD: $localize`:Very bad map legend label|:Very bad`,
};

const MEASUREMENT_SCORE_COLOR: Record<MEASUREMENT_SCORE_KEY, string> = {
  VERY_GOOD: '#006B44',
  GOOD: '#8ECC62',
  MEDIUM: '#007BB5',
  BAD: '#F18825',
  VERY_BAD: '#E0403F',
};

export const MEASUREMENT_SCORE_INDEX: ReadonlyArray<MEASUREMENT_SCORE_KEY> = [
  'VERY_GOOD',
  'GOOD',
  'MEDIUM',
  'BAD',
  'VERY_BAD',
];

Object.freeze(MEASUREMENT_SCORE_LABEL);
Object.freeze(MEASUREMENT_SCORE_COLOR);

export { MEASUREMENT_SCORE_LABEL, MEASUREMENT_SCORE_COLOR };

export const NO_DATA_COLOR = '#737373';
