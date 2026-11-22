import { MIN_PLAYER_AGE } from '../rules/ageRule.js';
import { SERVICE_AREAS, isServiceArea } from '../rules/deliveryRule.js';

const PHONE_PATTERN = /^(\+92|0)3\d{2}[-\s]?\d{7}$/;
const NAME_PATTERN = /^[A-Za-z][A-Za-z\s.'-]*$/;

/** Returns an object of { field: message }. Empty object means the form is valid. */
export function validateCheckout(form) {
  const errors = {};
  const name = form.name.trim();
  if (!name) errors.name = 'Enter your full name.';
  else if (name.length < 2 || !NAME_PATTERN.test(name)) errors.name = 'Use letters only, at least 2 characters.';

  if (!form.phone.trim()) errors.phone = 'Enter a mobile number.';
  else if (!PHONE_PATTERN.test(form.phone.trim())) errors.phone = 'Use a Pakistani mobile number like 0300-1234567.';

  if (form.fulfilment === 'delivery') {
    if (!form.city) errors.city = 'Choose a delivery city.';
    else if (!isServiceArea(form.city)) errors.city = `We deliver only in ${SERVICE_AREAS.join(' and ')}. Choose pickup instead.`;
    if (form.address.trim().length < 10) errors.address = 'Enter a full address (house, street, sector) of at least 10 characters.';
  }

  const age = Number(form.age);
  if (form.age === '') errors.age = 'Enter the player age.';
  else if (!Number.isInteger(age) || age < MIN_PLAYER_AGE || age > 80) {
    errors.age = `Player age must be a whole number from ${MIN_PLAYER_AGE} to 80.`;
  }
  return errors;
}
