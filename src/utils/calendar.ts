import { Bill } from '../types';

/**
 * Generates an iCalendar (.ics) string for a single bill,
 * strictly matching the original business logic with VALARM reminders.
 */
export function generateBillICS(bill: Bill): string {
  const cleanDate = bill.dueDate.replace(/-/g, '');
  const descriptionLines = [
    `Amount due: $${bill.amount}`,
    bill.disconnectDate ? `Disconnect Date: ${bill.disconnectDate}` : '',
    bill.notes ? `Notes: ${bill.notes}` : '',
  ].filter(Boolean).join('\\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Bills Manager//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:bill-${bill.name.replace(/\s+/g, '_')}-${cleanDate}@billsmanager`,
    `SUMMARY:Bill Due: ${bill.name} ($${bill.amount})`,
    `DESCRIPTION:${descriptionLines}`,
    `DTSTART;VALUE=DATE:${cleanDate}`,
    `DTEND;VALUE=DATE:${cleanDate}`,
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: ${bill.name} is due tomorrow!`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Generates a combined iCalendar (.ics) string containing all active/upcoming bills.
 */
export function generateBulkICS(bills: Bill[], calendarName = 'My Upcoming Bills'): string {
  const events = bills.map((bill, index) => {
    const cleanDate = bill.dueDate.replace(/-/g, '');
    const descriptionLines = [
      `Amount due: $${bill.amount}`,
      bill.disconnectDate ? `Disconnect Date: ${bill.disconnectDate}` : '',
      bill.notes ? `Notes: ${bill.notes}` : '',
    ].filter(Boolean).join('\\n');

    return [
      'BEGIN:VEVENT',
      `UID:bill-${index}-${bill.name.replace(/\s+/g, '_')}-${cleanDate}@billsmanager`,
      `SUMMARY:Bill Due: ${bill.name} ($${bill.amount})`,
      `DESCRIPTION:${descriptionLines}`,
      `DTSTART;VALUE=DATE:${cleanDate}`,
      `DTEND;VALUE=DATE:${cleanDate}`,
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder: ${bill.name} is due tomorrow!`,
      'END:VALARM',
      'END:VEVENT',
    ].join('\r\n');
  });

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Bills Manager//EN',
    `X-WR-CALNAME:${calendarName}`,
    'CALSCALE:GREGORIAN',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Triggers a client-side download of a generated ICS file
 */
export function triggerICSDownload(icsContent: string, filename: string): void {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => window.URL.revokeObjectURL(link.href), 2000);
}

/**
 * Download a single bill's calendar event
 */
export function downloadBillICS(bill: Bill): void {
  const ics = generateBillICS(bill);
  const cleanName = bill.name.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_') || 'Bill';
  triggerICSDownload(ics, `${cleanName}_Due.ics`);
}

/**
 * Download bulk calendar events for selected or all upcoming bills
 */
export function downloadBulkICS(bills: Bill[], filename = 'Upcoming_Bills.ics'): void {
  const ics = generateBulkICS(bills);
  triggerICSDownload(ics, filename);
}
