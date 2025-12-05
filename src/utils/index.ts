/**
 * Utility functions
 */

export const formatAddress = (address: string, startChars = 6, endChars = 4): string => {
  if (address.length <= startChars + endChars) {
    return address;
  }
  return `${address.substring(0, startChars)}...${address.substring(address.length - endChars)}`;
};

export const formatTokenAmount = (amount: number, decimals = 2): string => {
  return amount.toFixed(decimals);
};
