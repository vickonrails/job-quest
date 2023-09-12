import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Lookup for current status of the job application
 */
export const Status_Lookup = [
  'Bookmarked',
  'Applying',
  'Applied',
  'Interviewing',
  'Rejected',
  'Negotiating',
  'Hired',
]