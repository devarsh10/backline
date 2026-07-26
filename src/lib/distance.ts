const WAREHOUSE_ADDRESS = 'Prahlad Nagar, Ahmedabad, Gujarat, India';
const AHMEDABAD_FLAT_CHARGE = 2500;
const RATE_PER_KM = 20;

export interface TransportationQuote {
  charge: number;
  distanceKm: number | null;
  flatRate: boolean;
}

export class DistanceError extends Error {}

export async function getTransportationCharge(
  apiKey: string,
  city: string,
  venue: string | undefined
): Promise<TransportationQuote> {
  if (city.trim().toLowerCase() === 'ahmedabad') {
    return { charge: AHMEDABAD_FLAT_CHARGE, distanceKm: null, flatRate: true };
  }

  const destination = venue?.trim() ? `${venue.trim()}, ${city}, Gujarat, India` : `${city}, Gujarat, India`;

  const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
  url.searchParams.set('origins', WAREHOUSE_ADDRESS);
  url.searchParams.set('destinations', destination);
  url.searchParams.set('mode', 'driving');
  url.searchParams.set('key', apiKey);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new DistanceError(`Distance Matrix request failed (${response.status})`);
  }

  const data = await response.json<{
    status: string;
    rows: { elements: { status: string; distance?: { value: number } }[] }[];
  }>();

  const element = data.rows?.[0]?.elements?.[0];
  if (data.status !== 'OK' || !element || element.status !== 'OK' || !element.distance) {
    throw new DistanceError(`Could not calculate distance for "${destination}"`);
  }

  const oneWayKm = element.distance.value / 1000;
  const roundTripKm = Math.round(oneWayKm * 2 * 10) / 10;
  const charge = Math.round(roundTripKm * RATE_PER_KM);

  return { charge, distanceKm: roundTripKm, flatRate: false };
}
