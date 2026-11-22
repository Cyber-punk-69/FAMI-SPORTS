// Rule 2 (Eligibility): junior gear is sized for players aged 13-17.
// Adult gear needs a player aged 13 or over. Players under 13 cannot order.
export const MIN_PLAYER_AGE = 13;
export const JUNIOR_MAX_AGE = 17;

export function isJuniorProduct(product) {
  return product.ageGroup.startsWith('Junior');
}

/** Is this player age suitable for this one product? */
export function checkAgeEligibility(age, product) {
  if (!Number.isInteger(age) || age < MIN_PLAYER_AGE) {
    return { eligible: false, message: `Players must be ${MIN_PLAYER_AGE} or older to order from FAMI SPORTS.` };
  }
  if (isJuniorProduct(product) && age > JUNIOR_MAX_AGE) {
    return {
      eligible: false,
      message: `${product.name} is sized for ages ${MIN_PLAYER_AGE}-${JUNIOR_MAX_AGE}. Remove it or change the player age.`,
    };
  }
  return { eligible: true, message: '' };
}

/** All age conflicts between one player age and the cart's products. */
export function findAgeConflicts(age, products) {
  return products
    .map((product) => ({ product, ...checkAgeEligibility(age, product) }))
    .filter((result) => !result.eligible);
}
