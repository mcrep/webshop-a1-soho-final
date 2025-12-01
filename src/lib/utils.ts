import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateOIB(oib: string): boolean {
  if (!/^\d{11}$/.test(oib)) return false;
  
  let a = 10;
  for (let i = 0; i < 10; i++) {
    a = (a + parseInt(oib[i], 10)) % 10;
    if (a === 0) a = 10;
    a = (a * 2) % 11;
  }
  const check = (11 - a) % 10;
  return check === parseInt(oib[10], 10);
}
