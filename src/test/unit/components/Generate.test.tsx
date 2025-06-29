import { render, screen, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { describe, it, vi, expect, beforeEach } from 'vitest';

import { GeneratePage } from '@pages/Generate';

describe('Страница генерации отчёта — GeneratePage', () => {
    const mockFetch = vi.fn();
    const mockCreateURL = vi.fn();
    const mockRevokeURL = vi.fn();

    beforeEach(() => {
        cleanup();
        mockFetch.mockReset();
        mockCreateURL.mockReset();
        mockRevokeURL.mockReset();

        global.fetch = mockFetch;
        global.URL.createObjectURL = mockCreateURL;
        global.URL.revokeObjectURL = mockRevokeURL;

        mockCreateURL.mockReturnValue('blob://mock-url');
    });

    it('должна отображать заголовок и кнопку запуска', () => {
        render(<GeneratePage />);
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
        expect(screen.getByTestId('generate-button')).toHaveTextContent(/начать генерацию/i);
    });

    describe('поведение при успешной генерации', () => {
        beforeEach(() => {
            const fakeBlob = new Blob(['test data'], { type: 'text/csv' });
            mockFetch.mockResolvedValue({
                ok: true,
                headers: new Map([['content-disposition', 'attachment; filename="report.csv"']]),
                blob: () => Promise.resolve(fakeBlob),
            });
        });

        it('должна создать ссылку и показать сообщение об успехе', async () => {
            render(<GeneratePage />);
            await userEvent.click(screen.getByTestId('generate-button'));

            await waitFor(() => {
                expect(mockCreateURL).toHaveBeenCalled();
                expect(screen.getByText(/отчёт успешно сгенерирован/i)).toBeInTheDocument();
            });
        });
    });

    describe('поведение при ошибке генерации', () => {
        it('должна отобразить текст ошибки, полученной с сервера', async () => {
            mockFetch.mockResolvedValue({
                ok: false,
                json: () => Promise.resolve({ error: 'Ошибка на сервере' }),
            });

            render(<GeneratePage />);
            await userEvent.click(screen.getByTestId('generate-button'));

            expect(await screen.findByText(/произошла ошибка: ошибка на сервере/i)).toBeInTheDocument();
        });
    });
});
