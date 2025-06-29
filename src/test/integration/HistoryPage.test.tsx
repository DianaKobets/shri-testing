import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, beforeEach, afterEach, vi, expect } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HistoryPage } from '@pages/History';
import { GeneratePage } from '@pages/Generate';
import { useHistoryStore } from '@store/historyStore';
import { HistoryItemType } from '@app-types/history';

vi.mock('@utils/analysis', () => ({
    convertHighlightsToArray: vi.fn((highlights) => {
        return [
            { title: highlights.total_spend_galactic.toString(), description: 'Общие расходы' },
            { title: highlights.rows_affected.toString(), description: 'Количество обработанных записей' },
            { title: highlights.less_spent_at.toString(), description: 'День с минимальными расходами' },
            { title: highlights.big_spent_at.toString(), description: 'День с максимальными расходами' },
            { title: highlights.less_spent_value.toString(), description: 'Минимальная сумма расходов' },
            { title: highlights.big_spent_value.toString(), description: 'Максимальная сумма расходов' },
            { title: highlights.average_spend_galactic.toString(), description: 'Средние расходы' },
            { title: highlights.big_spent_civ, description: 'Цивилизация с максимальными расходами' },
            { title: highlights.less_spent_civ, description: 'Цивилизация с минимальными расходами' },
        ];
    }),
}));

describe('Интеграция с generatePage', () => {
    beforeEach(() => {
        useHistoryStore.getState().reset();
        vi.spyOn(global, 'fetch').mockResolvedValue({
            ok: true,
            blob: () => Promise.resolve(new Blob(['content'], { type: 'text/csv' })),
            headers: new Map([['Content-Disposition', 'attachment; filename="report.csv"']]),
        } as any);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('переходит на страницу генерации по клику на кнопку "сгенерировать еще"', async () => {
        const history: HistoryItemType[] = [
            {
                id: '1',
                fileName: 'test.csv',
                timestamp: Date.now(),
                highlights: {
                    total_spend_galactic: 1000,
                    rows_affected: 50,
                    less_spent_at: 10,
                    big_spent_at: 200,
                    less_spent_value: 50,
                    big_spent_value: 500,
                    average_spend_galactic: 100,
                    big_spent_civ: 'Earth',
                    less_spent_civ: 'Mars',
                },
            },
        ];
        useHistoryStore.setState({ history });

        render(
            <MemoryRouter initialEntries={['/history']}>
                <Routes>
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/generate" element={<GeneratePage />} />
                </Routes>
            </MemoryRouter>
        );

        await fireEvent.click(screen.getByRole('button', { name: /сгенерировать больше/i }));
        await waitFor(() => {
            expect(screen.getByTestId('generate-page')).toBeInTheDocument();
            expect(screen.getByText('Сгенерируйте готовый csv-файл нажатием одной кнопки')).toBeInTheDocument();
        });
    });
});
