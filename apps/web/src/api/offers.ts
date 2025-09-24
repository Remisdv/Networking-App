import { apiClient } from './client';
import { Offer } from './types';

export function getOffers(): Promise<Offer[]> {
  return apiClient.get<Offer[]>('offers');
}
