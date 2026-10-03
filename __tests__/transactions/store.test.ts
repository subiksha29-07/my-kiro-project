/**
 * Unit tests for lib/transactions/store.ts
 * loadTransactions() and saveTransactions()
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadTransactions, saveTransactions } from '@/lib/transactions/store';
import { STORAGE_KEY } from '@/lib/transactions/constants';
import type { Transaction } from '@/lib/transactions/types';

// ─── localStorage mock (per testing-conventions.md) ─────────────────────────

const localStorageMock = (() => {
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
  };
})();

beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
  vi.stubGlobal('localStorage', localStorageMock);
});

// ─── Minimal valid transaction fixture ───────────────────────────────────────

const TX: Transaction = {
  id: '00000000-0000-4000-8000-000000000001',
  title: 'Rent',
  amount: 1200,
  type: 'EXPENSE',
  category: 'Housing',
  date: '2024-07-01',
  createdAt: '2024-07-01T10:00:00.000Z',
  updatedAt: '2024-07-01T10:00:00.000Z',
};

// ─── loadTransactions ─────────────────────────────────────────────────────────

describe('loadTransactions', () => {
  it('returns [] when the key is absent (first run)', () => {
    // getItem returns null by default when key not set
    const result = loadTransactions();
    expect(result).toEqual([]);
  });

  it('does NOT call console.warn when the key is simply absent', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    loadTransactions();
    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('returns [] and warns when the stored value is malformed JSON', () => {
    localStorageMock.getItem.mockReturnValueOnce('not-valid-json{{');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = loadTransactions();

    expect(result).toEqual([]);
    expect(warnSpy).toHaveBeenCalledOnce();
    warnSpy.mockRestore();
  });

  it('returns [] and warns when the stored value is a valid JSON object (not array)', () => {
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify({ foo: 'bar' }));
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = loadTransactions();

    expect(result).toEqual([]);
    expect(warnSpy).toHaveBeenCalledOnce();
    warnSpy.mockRestore();
  });

  it('returns [] and warns when the stored value is a valid JSON number', () => {
    localStorageMock.getItem.mockReturnValueOnce('42');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = loadTransactions();

    expect(result).toEqual([]);
    expect(warnSpy).toHaveBeenCalledOnce();
    warnSpy.mockRestore();
  });

  it('returns [] and warns when the stored value is the JSON string "null"', () => {
    localStorageMock.getItem.mockReturnValueOnce('null');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = loadTransactions();

    expect(result).toEqual([]);
    expect(warnSpy).toHaveBeenCalledOnce();
    warnSpy.mockRestore();
  });

  it('returns [] without warning when stored value is an empty JSON array', () => {
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([]));
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = loadTransactions();

    expect(result).toEqual([]);
    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('returns the stored transaction array when the value is valid', () => {
    const list = [TX];
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(list));

    const result = loadTransactions();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(TX.id);
    expect(result[0].title).toBe(TX.title);
    expect(result[0].amount).toBe(TX.amount);
  });

  it('reads from the correct localStorage key', () => {
    loadTransactions();
    expect(localStorageMock.getItem).toHaveBeenCalledWith(STORAGE_KEY);
  });
});

// ─── saveTransactions ─────────────────────────────────────────────────────────

describe('saveTransactions', () => {
  it('returns { success: true } on a successful write', () => {
    const result = saveTransactions([TX]);
    expect(result).toEqual({ success: true });
  });

  it('calls localStorage.setItem with the correct key', () => {
    saveTransactions([TX]);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      expect.any(String),
    );
  });

  it('serialises the transaction list as valid JSON', () => {
    saveTransactions([TX]);
    const written = localStorageMock.setItem.mock.calls[0][1];
    const parsed = JSON.parse(written);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed[0].id).toBe(TX.id);
  });

  it('saves and reloads an empty list correctly (round-trip)', () => {
    saveTransactions([]);
    localStorageMock.getItem.mockReturnValueOnce(
      localStorageMock.setItem.mock.calls[0][1],
    );
    const loaded = loadTransactions();
    expect(loaded).toEqual([]);
  });

  it('saves and reloads a non-empty list correctly (round-trip)', () => {
    saveTransactions([TX]);
    // Feed the written value back to getItem so loadTransactions can read it
    const written = localStorageMock.setItem.mock.calls[0][1];
    localStorageMock.getItem.mockReturnValueOnce(written);

    const loaded = loadTransactions();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].id).toBe(TX.id);
    expect(loaded[0].title).toBe(TX.title);
    expect(loaded[0].amount).toBe(TX.amount);
    expect(loaded[0].date).toBe(TX.date);
  });

  it('returns { success: false } when a QuotaExceededError is thrown', () => {
    const quotaError = new DOMException(
      'QuotaExceededError',
      'QuotaExceededError',
    );
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw quotaError;
    });

    const result = saveTransactions([TX]);
    expect(result).toEqual({ success: false });
  });

  it('does not throw when a QuotaExceededError occurs', () => {
    const quotaError = new DOMException(
      'QuotaExceededError',
      'QuotaExceededError',
    );
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw quotaError;
    });

    expect(() => saveTransactions([TX])).not.toThrow();
  });

  it('returns { success: false } for other unexpected errors and does not throw', () => {
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new Error('disk full');
    });
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = saveTransactions([TX]);
    expect(result).toEqual({ success: false });
    expect(() => saveTransactions([TX])).not.toThrow();

    errorSpy.mockRestore();
  });
});
