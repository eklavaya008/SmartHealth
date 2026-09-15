const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

const toHHMM = (minutes) => {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

// dateStr is "YYYY-MM-DD"; parsed as UTC midnight so weekday is stable regardless of server timezone.
const weekdayOf = (dateStr) => new Date(`${dateStr}T00:00:00Z`).getUTCDay();

/**
 * @param {Array<{dayOfWeek:number, startTime:string, endTime:string, slotMinutes:number}>} availability
 * @param {string} dateStr "YYYY-MM-DD"
 * @returns {Array<{startTime:string, endTime:string}>} every slot the doctor's weekly rules define for that date
 */
const generateSlotsForDate = (availability, dateStr) => {
  const dayOfWeek = weekdayOf(dateStr);
  const slots = [];

  for (const rule of availability.filter((r) => r.dayOfWeek === dayOfWeek)) {
    const start = toMinutes(rule.startTime);
    const end = toMinutes(rule.endTime);
    const step = rule.slotMinutes || 30;

    for (let t = start; t + step <= end; t += step) {
      slots.push({ startTime: toHHMM(t), endTime: toHHMM(t + step) });
    }
  }

  return slots.sort((a, b) => (a.startTime > b.startTime ? 1 : -1));
};

/**
 * Available slots for a date = generated slots minus already-booked start times,
 * minus anything in the past if the date is today.
 */
const getAvailableSlots = (availability, dateStr, bookedStartTimes = []) => {
  const allSlots = generateSlotsForDate(availability, dateStr);
  const booked = new Set(bookedStartTimes);

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const nowMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();

  return allSlots.filter((slot) => {
    if (booked.has(slot.startTime)) return false;
    if (dateStr === todayStr && toMinutes(slot.startTime) <= nowMinutes) return false;
    return true;
  });
};

module.exports = { toMinutes, toHHMM, weekdayOf, generateSlotsForDate, getAvailableSlots };
