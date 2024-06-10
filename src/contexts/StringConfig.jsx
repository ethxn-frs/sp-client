import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe('your_public_key_here');
