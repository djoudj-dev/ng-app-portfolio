import { BadgeDatePipe } from '@core/pipes/badge.pipe';

describe('BadgeDatePipe', () => {
  let pipe: BadgeDatePipe;

  beforeEach(() => {
    pipe = new BadgeDatePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return "Disponible" for future dates', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    expect(pipe.transform(futureDate)).toBe('Disponible');
  });

  it('should return "Indisponible" for past dates', () => {
    const pastDate = new Date();
    pastDate.setFullYear(pastDate.getFullYear() - 1);
    expect(pipe.transform(pastDate)).toBe('Indisponible');
  });

  it('should return "Indisponible" for current date', () => {
    const now = new Date();
    expect(pipe.transform(now)).toBe('Indisponible');
  });
});
