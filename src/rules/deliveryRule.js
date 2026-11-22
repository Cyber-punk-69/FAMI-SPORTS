// Rule 3 (Pricing / fulfilment): delivery costs Rs. 250 and is free from
// Rs. 5,000. Delivery only covers Islamabad and Rawalpindi. Pickup is free.
export const DELIVERY_FEE = 250;
export const FREE_DELIVERY_THRESHOLD = 5000;
export const SERVICE_AREAS = ['Islamabad', 'Rawalpindi'];

export function isServiceArea(city) {
  return SERVICE_AREAS.includes(city);
}

export function calculateDelivery(subtotal, fulfilment = 'delivery') {
  if (fulfilment === 'pickup') {
    return { fee: 0, free: true, remainingForFree: 0, reason: 'Pickup is always free.' };
  }
  const free = subtotal >= FREE_DELIVERY_THRESHOLD;
  return {
    fee: free ? 0 : DELIVERY_FEE,
    free,
    remainingForFree: free ? 0 : FREE_DELIVERY_THRESHOLD - subtotal,
    reason: free ? 'Free delivery unlocked.' : `Delivery is Rs. ${DELIVERY_FEE} below Rs. ${FREE_DELIVERY_THRESHOLD.toLocaleString()}.`,
  };
}
