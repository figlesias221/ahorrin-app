/**
 * Bank constants and configurations
 */

export type BankCode =
  | 'bbva'
  | 'scotia'
  | 'itau'
  | 'itau-master'
  | 'itau-visa'
  | 'brou'
  | 'santander'
  | 'heritage'
  | 'other';

export interface Bank {
  code: BankCode;
  name: string;
  displayName: string;
  color: string;
}

export const BANKS: Bank[] = [
  {
    code: 'bbva',
    name: 'BBVA',
    displayName: 'BBVA',
    color: '#004481',
  },
  {
    code: 'scotia',
    name: 'Scotia',
    displayName: 'Scotiabank',
    color: '#ed1c24',
  },
  {
    code: 'itau',
    name: 'Itaú',
    displayName: 'Itaú',
    color: '#ec7000',
  },
  {
    code: 'itau-master',
    name: 'Itaú Master',
    displayName: 'Itaú Mastercard',
    color: '#eb6c00',
  },
  {
    code: 'itau-visa',
    name: 'Itaú Visa',
    displayName: 'Itaú Visa',
    color: '#ff8200',
  },
  {
    code: 'brou',
    name: 'BROU',
    displayName: 'Banco República',
    color: '#009639',
  },
  {
    code: 'santander',
    name: 'Santander',
    displayName: 'Santander',
    color: '#ec0000',
  },
  {
    code: 'heritage',
    name: 'Heritage',
    displayName: 'Heritage',
    color: '#1e3a8a',
  },
  {
    code: 'other',
    name: 'Otro',
    displayName: 'Otro Banco',
    color: '#6b7280',
  },
];

/**
 * Get bank by code
 */
export function getBankByCode(code: BankCode | string): Bank | undefined {
  return BANKS.find((bank) => bank.code === code);
}

/**
 * Get bank by name (fuzzy match)
 */
export function getBankByName(name: string): Bank | undefined {
  const normalized = name.toLowerCase().trim();
  return BANKS.find((bank) =>
    bank.name.toLowerCase() === normalized ||
    bank.displayName.toLowerCase() === normalized
  );
}

/**
 * Get bank color
 */
export function getBankColor(bankNameOrCode: string): string {
  const bank = getBankByCode(bankNameOrCode as BankCode) || getBankByName(bankNameOrCode);
  return bank?.color || '#6b7280';
}

/**
 * Get bank display name
 */
export function getBankDisplayName(bankNameOrCode: string): string {
  const bank = getBankByCode(bankNameOrCode as BankCode) || getBankByName(bankNameOrCode);
  return bank?.displayName || bankNameOrCode;
}
