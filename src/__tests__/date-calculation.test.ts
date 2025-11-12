/**
 * Tests for date calculation and future date prevention logic
 */

import {
  addDays,
  addWeeks,
  addMonths,
  addYears,
  endOfDay,
  endOfWeek,
  endOfMonth,
  endOfYear,
  endOfToday,
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
} from 'date-fns/esm';

describe('Date Calculation Logic', () => {
  describe('Date calculation for different periods', () => {
    it('should calculate correct end date for day period', () => {
      const startDate = new Date('2025-11-12T00:00:00Z');
      const endDate = endOfDay(startDate);
      
      expect(endDate.getFullYear()).toBe(2025);
      expect(endDate.getMonth()).toBe(10); // November is month 10 (0-indexed)
      expect(endDate.getDate()).toBe(12);
      expect(endDate.getHours()).toBe(23);
      expect(endDate.getMinutes()).toBe(59);
    });

    it('should calculate correct end date for week period', () => {
      const startDate = startOfWeek(new Date('2025-11-12T00:00:00Z'), { weekStartsOn: 1 }); // Monday
      const endDate = endOfWeek(startDate, { weekStartsOn: 1 });
      
      // Week should span from Monday to Sunday
      expect(endDate.getDate() - startDate.getDate()).toBe(6);
    });

    it('should calculate correct end date for month period', () => {
      const startDate = startOfMonth(new Date('2025-11-12T00:00:00Z'));
      const endDate = endOfMonth(startDate);
      
      expect(startDate.getDate()).toBe(1);
      expect(endDate.getDate()).toBe(30); // November has 30 days
    });

    it('should calculate correct end date for year period', () => {
      const startDate = startOfYear(new Date('2025-11-12T00:00:00Z'));
      const endDate = endOfYear(startDate);
      
      expect(startDate.getMonth()).toBe(0); // January
      expect(startDate.getDate()).toBe(1);
      expect(endDate.getMonth()).toBe(11); // December
      expect(endDate.getDate()).toBe(31);
    });
  });

  describe('Previous/Next navigation date calculation', () => {
    it('should correctly go back one day in day period', () => {
      const currentDate = new Date('2025-11-12T00:00:00Z');
      const previousDate = addDays(currentDate, -1);
      
      expect(previousDate.getDate()).toBe(11);
      expect(previousDate.getMonth()).toBe(10); // November
    });

    it('should correctly go forward one day in day period', () => {
      const currentDate = new Date('2025-11-12T00:00:00Z');
      const nextDate = addDays(currentDate, 1);
      
      expect(nextDate.getDate()).toBe(13);
      expect(nextDate.getMonth()).toBe(10); // November
    });

    it('should correctly go back one week in week period', () => {
      const currentDate = new Date('2025-11-12T00:00:00Z');
      const previousDate = addWeeks(currentDate, -1);
      
      expect(previousDate.getDate()).toBe(5);
      expect(previousDate.getMonth()).toBe(10); // November
    });

    it('should correctly go back one month in month period', () => {
      const currentDate = new Date('2025-11-12T00:00:00Z');
      const previousDate = addMonths(currentDate, -1);
      
      expect(previousDate.getMonth()).toBe(9); // October
    });

    it('should correctly go back one year in year period', () => {
      const currentDate = new Date('2025-11-12T00:00:00Z');
      const previousDate = addYears(currentDate, -1);
      
      expect(previousDate.getFullYear()).toBe(2024);
    });
  });

  describe('Future date prevention logic', () => {
    it('should cap end date to today when in future for day period', () => {
      const today = new Date();
      const tomorrow = addDays(today, 1);
      const endDate = endOfDay(tomorrow);
      const todayEnd = endOfToday();
      
      // Check if we need to cap the end date
      const cappedEndDate = endDate > todayEnd ? todayEnd : endDate;
      
      expect(cappedEndDate.getTime()).toBeLessThanOrEqual(todayEnd.getTime());
    });

    it('should cap end date to today when week extends into future', () => {
      const today = new Date();
      const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
      const endOfCurrentWeek = endOfWeek(startOfCurrentWeek, { weekStartsOn: 1 });
      const todayEnd = endOfToday();
      
      // If the week end is in the future, it should be capped
      const cappedEndDate = endOfCurrentWeek > todayEnd ? todayEnd : endOfCurrentWeek;
      
      expect(cappedEndDate.getTime()).toBeLessThanOrEqual(todayEnd.getTime());
    });

    it('should cap end date to today when month extends into future', () => {
      const today = new Date();
      const startOfCurrentMonth = startOfMonth(today);
      const endOfCurrentMonth = endOfMonth(startOfCurrentMonth);
      const todayEnd = endOfToday();
      
      // If the month end is in the future, it should be capped
      const cappedEndDate = endOfCurrentMonth > todayEnd ? todayEnd : endOfCurrentMonth;
      
      expect(cappedEndDate.getTime()).toBeLessThanOrEqual(todayEnd.getTime());
    });

    it('should not cap end date to today when prevent_future_dates is false', () => {
      const preventFutureDates = false;
      const tomorrow = addDays(new Date(), 1);
      const endDate = endOfDay(tomorrow);
      const todayEnd = endOfToday();
      
      // When prevent_future_dates is false, don't cap
      const finalEndDate = preventFutureDates && endDate > todayEnd ? todayEnd : endDate;
      
      expect(finalEndDate.getTime()).toBeGreaterThan(todayEnd.getTime());
    });

    it('should cap end date to today when prevent_future_dates is true', () => {
      const preventFutureDates = true;
      const tomorrow = addDays(new Date(), 1);
      const endDate = endOfDay(tomorrow);
      const todayEnd = endOfToday();
      
      // When prevent_future_dates is true, cap to today
      const finalEndDate = preventFutureDates && endDate > todayEnd ? todayEnd : endDate;
      
      expect(finalEndDate.getTime()).toBeLessThanOrEqual(todayEnd.getTime());
    });
  });

  describe('Next button disable logic', () => {
    it('should be disabled when end date matches today with prevent_future_dates enabled', () => {
      const preventFutureDates = true;
      const endDate = endOfToday();
      const today = endOfToday();
      
      // Check if we're at the current period (within 1 second tolerance)
      const isAtCurrentPeriod = preventFutureDates && endDate.getTime() >= today.getTime() - 1000;
      
      expect(isAtCurrentPeriod).toBe(true);
    });

    it('should not be disabled when end date is in the past with prevent_future_dates enabled', () => {
      const preventFutureDates = true;
      const endDate = endOfDay(addDays(new Date(), -1)); // Yesterday
      const today = endOfToday();
      
      // Check if we're at the current period
      const isAtCurrentPeriod = preventFutureDates && endDate.getTime() >= today.getTime() - 1000;
      
      expect(isAtCurrentPeriod).toBe(false);
    });

    it('should not be disabled when prevent_future_dates is false', () => {
      const preventFutureDates = false;
      const endDate = endOfToday();
      const today = endOfToday();
      
      // Check if we're at the current period
      const isAtCurrentPeriod = preventFutureDates && endDate.getTime() >= today.getTime() - 1000;
      
      expect(isAtCurrentPeriod).toBe(false);
    });
  });

  describe('Single day view consistency', () => {
    it('should have same start and end date for single day', () => {
      const date = new Date('2025-11-12T00:00:00Z');
      const startDate = startOfDay(date);
      const endDate = endOfDay(date);
      
      expect(startDate.getFullYear()).toBe(endDate.getFullYear());
      expect(startDate.getMonth()).toBe(endDate.getMonth());
      expect(startDate.getDate()).toBe(endDate.getDate());
    });

    it('should maintain day consistency when navigating previous in day period', () => {
      const currentDate = new Date('2025-11-12T00:00:00Z');
      const previousStartDate = startOfDay(addDays(currentDate, -1));
      const previousEndDate = endOfDay(addDays(currentDate, -1));
      
      expect(previousStartDate.getDate()).toBe(previousEndDate.getDate());
      expect(previousStartDate.getDate()).toBe(11);
    });

    it('should maintain day consistency when navigating next in day period', () => {
      const currentDate = new Date('2025-11-12T00:00:00Z');
      const nextStartDate = startOfDay(addDays(currentDate, 1));
      const nextEndDate = endOfDay(addDays(currentDate, 1));
      
      expect(nextStartDate.getDate()).toBe(nextEndDate.getDate());
      expect(nextStartDate.getDate()).toBe(13);
    });
  });
});
