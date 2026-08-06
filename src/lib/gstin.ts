const GSTIN_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z][Z][0-9A-Z]$/;

export class GstinError extends Error {}

export interface GstinDetails {
  gstin: string;
  legalName: string;
  tradeName: string;
  status: string;
}

export function isValidGstinFormat(gstin: string): boolean {
  return GSTIN_RE.test(gstin.trim().toUpperCase());
}

export async function lookupGstin(apiKey: string, gstin: string): Promise<GstinDetails> {
  const cleaned = gstin.trim().toUpperCase();
  if (!isValidGstinFormat(cleaned)) {
    throw new GstinError('That doesn\'t look like a valid GSTIN — check the 15 characters and try again.');
  }

  const response = await fetch(`https://sheet.gstincheck.co.in/check/${apiKey}/${cleaned}`);
  if (!response.ok) {
    throw new GstinError('Could not verify this GSTIN right now — please try again in a moment.');
  }

  const data = await response.json<{ flag: boolean; message?: string; data?: { lgnm?: string; tradeNam?: string; sts?: string } }>();
  if (!data.flag || !data.data?.lgnm) {
    throw new GstinError('This GSTIN could not be found — please double-check the number.');
  }

  return {
    gstin: cleaned,
    legalName: data.data.lgnm,
    tradeName: data.data.tradeNam || data.data.lgnm,
    status: data.data.sts || 'Unknown',
  };
}
