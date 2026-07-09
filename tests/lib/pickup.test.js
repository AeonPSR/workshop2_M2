import {
  toISODate,
  nextPickupDates,
  isValidPickupDate,
  formatPickupDate,
} from "@/lib/pickup";

// Force un décalage UTC positif (Paris) pour que le test round-trip
// ci-dessous exerce vraiment le bug qu'il surveille : un formatage de date
// basé sur toISOString() reculait minuit local d'un jour une fois converti
// en UTC, transformant un "Lundi 13 Juillet" affiché "2026-07-12" (un dimanche).
const ORIGINAL_TZ = process.env.TZ;
beforeAll(() => {
  process.env.TZ = "Europe/Paris";
});
afterAll(() => {
  process.env.TZ = ORIGINAL_TZ;
});

describe("nextPickupDates", () => {
  it("only returns Mondays and Tuesdays", () => {
    const reference = new Date(2026, 6, 9); // Thursday 9 July 2026
    const dates = nextPickupDates(6, reference);
    for (const date of dates) {
      expect([1, 2]).toContain(date.getDay());
    }
  });

  it("only returns dates strictly after the reference date", () => {
    const reference = new Date(2026, 6, 9);
    const dates = nextPickupDates(4, reference);
    for (const date of dates) {
      expect(date.getTime()).toBeGreaterThan(reference.getTime());
    }
  });

  it("returns the requested number of dates in chronological order", () => {
    const reference = new Date(2026, 6, 9);
    const dates = nextPickupDates(4, reference);
    expect(dates).toHaveLength(4);
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i].getTime()).toBeGreaterThan(dates[i - 1].getTime());
    }
  });
});

describe("toISODate + isValidPickupDate round-trip", () => {
  it("accepts every date the UI actually offers the user", () => {
    // Regression test: selecting one of the proposed Monday/Tuesday options
    // must never be rejected as "not a Monday or Tuesday".
    const reference = new Date(2026, 6, 9);
    const offeredDates = nextPickupDates(6, reference);

    for (const date of offeredDates) {
      const iso = toISODate(date);
      expect(isValidPickupDate(iso, reference)).toBe(true);
    }
  });
});

describe("isValidPickupDate", () => {
  const reference = new Date(2026, 6, 9); // Thursday 9 July 2026

  it("accepts a future Monday", () => {
    expect(isValidPickupDate("2026-07-13", reference)).toBe(true);
  });

  it("accepts a future Tuesday", () => {
    expect(isValidPickupDate("2026-07-14", reference)).toBe(true);
  });

  it("rejects a Sunday", () => {
    expect(isValidPickupDate("2026-07-12", reference)).toBe(false);
  });

  it("rejects a Wednesday", () => {
    expect(isValidPickupDate("2026-07-15", reference)).toBe(false);
  });

  it("rejects a Monday that has already passed", () => {
    expect(isValidPickupDate("2026-07-06", reference)).toBe(false);
  });

  it("rejects a malformed date string", () => {
    expect(isValidPickupDate("not-a-date", reference)).toBe(false);
  });

  it("rejects an empty/undefined value", () => {
    expect(isValidPickupDate(undefined, reference)).toBe(false);
  });
});

describe("toISODate", () => {
  it("formats a date from its local components", () => {
    expect(toISODate(new Date(2026, 6, 13))).toBe("2026-07-13");
  });

  it("zero-pads month and day", () => {
    expect(toISODate(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  it("does not shift to the previous day under a positive UTC offset", () => {
    // TZ is Europe/Paris here; a naive toISOString() would yield 2026-07-12.
    expect(toISODate(new Date(2026, 6, 13))).toBe("2026-07-13");
  });
});

describe("formatPickupDate", () => {
  it("renders a French long date", () => {
    const formatted = formatPickupDate(new Date(2026, 6, 13)); // Monday 13 July
    expect(formatted).toContain("13");
    expect(formatted).toContain("juillet");
    expect(formatted).toContain("lundi");
  });
});
