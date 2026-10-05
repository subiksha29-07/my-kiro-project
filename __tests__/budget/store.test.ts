/**
 * Unit tests for lib/budget/store.ts
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadBudget, saveBudget } from '@/lib/budget/store';

// ─── localStorage mock ────────────────────────────────────────────────────────

function createLocalStorageMock() {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  };
}

const BUDGET_KEY = 'smart-expense-tracker-budget';

describe('loadBudget', () => {
  let localStorageMock: ReturnType<typeof createLocalStorageMock>;

  beforeEach(() => {
    localStorageMock = createLocalStorageMock();
    vi.stubGlobal('localStorage', localStorageMock);
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('returns null and does NOT warn when key is absent', () => {
    const result = loadBudget();
    expect(result).toBeNull();
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("returns null and warns when stored value is 'abc'", () => {
    localStorageMock.getItem.mockReturnValue('abc');
    const result = loadBudget();
    expect(result).toBeNull();
    expect(console.warn).toHaveBeenCalled();
  });

  it("returns null and warns when stored value is 'NaN'", () => {
    localStorageMock.getItem.mockReturnValue('NaN');
    const result = loadBudget();
    expect(result).toBeNull();
    expect(console.warn).toHaveBeenCalled();
  });

  it("returns null and warns when stored value is 'Infinity'", () => {
    localStorageMock.getItem.mockReturnValue('Infinity');
    const result = loadBudget();
    expect(result).toBeNull();
    expect(console.warn).toHaveBeenCalled();
  });

  it("returns null and warns when stored value is '0'", () => {
    localStorageMock.getItem.mockReturnValue('0');
    const result = loadBudget();
    expect(result).toBeNull();
    expect(console.warn).toHaveBeenCalled();
  });

  it("returns null and warns when stored value is '-100'", () => {
    localStorageMock.getItem.mockReturnValue('-100');
    const result = loadBudget();
    expect(result).toBeNull();
    expect(console.warn).toHaveBeenCalled();
  });

  it("returns 500 when stored value is '500.00'", () => {
    localStorageMock.getItem.mockReturnValue('500.00');
    const result = loadBudget();
    expect(result).toBe(500);
    expect(console.warn).not.toHaveBeenCalled();
  });
});

describe('saveBudget', () => {
  let localStorageMock: ReturnType<typeof createLocalStorageMock>;

  beforeEach(() => {
    localStorageMock = createLocalStorageMock();
    vi.stubGlobal('localStorage', localStorageMock);
  });

  it('returns { success: true } and calls setItem with the correct key and value', () => {
    const result = saveBudget(500);
    expect(result).toEqual({ success: true });
    expect(localStorageMock.setItem).toHaveBeenCalledWith(BUDGET_KEY, '500');
  });

  it('returns { success: false } and does not throw on QuotaExceededError', () => {
    const quotaError = new DOMException('QuotaExceeded', 'QuotaExceededError');
    localStorageMock.setItem.mockImplementation(() => {
      throw quotaError;
    });

    expect(() => saveBudget(500)).not.toThrow();
    const result = saveBudget(500);
    expect(result).toEqual({ success: false });
  });
});
