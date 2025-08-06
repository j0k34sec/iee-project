/**
 * Parse date from DD-MM-YYYY format and return timestamp
 * @param dateString - Date in DD-MM-YYYY format
 * @param timeString - Time in HH:MM format (optional)
 * @returns Unix timestamp
 */
export function parseHackathonDate(dateString: string, timeString: string = '09:00'): number {
  // Split the date string
  const [day, month, year] = dateString.split('-').map(Number)
  
  // Split the time string
  const [hours, minutes] = timeString.split(':').map(Number)
  
  // Create Date object (month is 0-indexed in JavaScript)
  const date = new Date(year, month - 1, day, hours, minutes)
  
  return date.getTime()
}

/**
 * Format date for display
 * @param timestamp - Unix timestamp
 * @returns Formatted date string
 */
export function formatDisplayDate(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}