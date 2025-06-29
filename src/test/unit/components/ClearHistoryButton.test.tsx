import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ClearHistoryButton } from '@components/ClearHistoryButton';
import * as storageUtils from '@utils/storage';

const clearHistoryFn = vi.fn();
const mockedHistory = [
    {
        id: '1',
        fileName: 'example.csv',
        timestamp: Date.now(),
        highlights: [{}],
    },
];

vi.mock('@store/historyStore', () => ({
    useHistoryStore: () => ({
        clearHistory: clearHistoryFn,
        history: mockedHistory,
    }),
}));

vi.mock('@utils/storage', () => ({
    clearHistory: vi.fn(),
}));

describe('Компонент ClearHistoryButton', () => {
    beforeEach(() => {
        cleanup();
        clearHistoryFn.mockReset();
        vi.mocked(storageUtils.clearHistory).mockReset();
        mockedHistory.length = 1; // Восстанавливаем историю перед каждым тестом
    });

    it('должен очищать историю и localStorage при нажатии кнопки', async () => {
        render(<ClearHistoryButton />);
        const clearButton = screen.getByTestId('clear-history');

        await userEvent.click(clearButton);

        expect(clearHistoryFn).toHaveBeenCalled();
        expect(storageUtils.clearHistory).toHaveBeenCalled();
    });

    it('должен отображать кнопку, если история есть', () => {
        render(<ClearHistoryButton />);
        expect(screen.getByTestId('clear-history')).toBeVisible();
    });

    it('не должен отображать кнопку, если история пуста', () => {
        mockedHistory.length = 0;
        render(<ClearHistoryButton />);
        expect(screen.queryByTestId('clear-history')).not.toBeInTheDocument();
    });
});
