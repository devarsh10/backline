export interface PlacePrediction {
  placeId: string;
  description: string;
}

export interface PlaceDetails {
  formattedAddress: string;
  city: string;
}

export class PlacesError extends Error {}

export async function autocompletePlaces(apiKey: string, input: string): Promise<PlacePrediction[]> {
  const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json');
  url.searchParams.set('input', input);
  url.searchParams.set('components', 'country:in');
  url.searchParams.set('key', apiKey);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new PlacesError(`Autocomplete request failed (${response.status})`);
  }

  const data = await response.json<{
    status: string;
    predictions: { place_id: string; description: string }[];
  }>();

  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new PlacesError(`Autocomplete failed: ${data.status}`);
  }

  return (data.predictions ?? []).map(p => ({ placeId: p.place_id, description: p.description }));
}

export async function getPlaceDetails(apiKey: string, placeId: string): Promise<PlaceDetails> {
  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  url.searchParams.set('place_id', placeId);
  url.searchParams.set('fields', 'formatted_address,address_component');
  url.searchParams.set('key', apiKey);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new PlacesError(`Place details request failed (${response.status})`);
  }

  const data = await response.json<{
    status: string;
    result?: {
      formatted_address: string;
      address_components: { long_name: string; types: string[] }[];
    };
  }>();

  if (data.status !== 'OK' || !data.result) {
    throw new PlacesError(`Could not fetch place details: ${data.status}`);
  }

  const cityComponent = data.result.address_components.find(
    c => c.types.includes('locality') || c.types.includes('administrative_area_level_2')
  );

  return {
    formattedAddress: data.result.formatted_address,
    city: cityComponent?.long_name ?? '',
  };
}
