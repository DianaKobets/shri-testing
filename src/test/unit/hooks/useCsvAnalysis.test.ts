import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCsvAnalysis } from '@hooks/use-csv-analysis';
import { InvalidServerResponseError } from '@utils/analysis';

describe('useCsvAnalysis', () => {
    const mockOnData = vi.fn();
    const mockOnError = vi.fn();
    const mockOnComplete = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn();
    });

    it('вызывается onData и onComplete для валидных CSV файлов', async () => {
        const mockResponse = {
            ok: true,
            body: {
                getReader: () => ({
                    read: vi
                        .fn()
                        .mockResolvedValueOnce({
                            done: false,
                            value: new TextEncoder().encode('{"total_spend_galactic":100,"rows_affected":10}'),
                        })
                        .mockResolvedValueOnce({ done: true }),
                }),
            },
        };
        (global.fetch as any).mockResolvedValue(mockResponse);

        const { result } = renderHook(() =>
            useCsvAnalysis({ onData: mockOnData, onError: mockOnError, onComplete: mockOnComplete })
        );

        const file = new File(['content'], 'test.csv', { type: 'text/csv' });
        await result.current.analyzeCsv(file);

        expect(mockOnData).toHaveBeenCalledWith([{ title: '100', description: 'Общие расходы' }]);
        expect(mockOnComplete).toHaveBeenCalled();
        expect(mockOnError).not.toHaveBeenCalled();
    });

    it('вызывается onError при ошибке с сервера', async () => {
        const mockResponse = {
            ok: true,
            body: {
                getReader: () => ({
                    read: vi.fn().mockResolvedValueOnce({
                        done: false,
                        value: new TextEncoder().encode('{"invalid_key":100}'),
                    }),
                }),
            },
        };
        (global.fetch as any).mockResolvedValue(mockResponse);

        const { result } = renderHook(() =>
            useCsvAnalysis({ onData: mockOnData, onError: mockOnError, onComplete: mockOnComplete })
        );

        const file = new File(['content'], 'test.csv', { type: 'text/csv' });
        await result.current.analyzeCsv(file);

        expect(mockOnError).toHaveBeenCalledWith(expect.any(InvalidServerResponseError));
    });
});
