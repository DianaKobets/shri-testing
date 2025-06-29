import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, beforeEach, expect, vi } from 'vitest';

import { HistoryList } from '@components/HistoryList/HistoryList';
import { useHistoryStore } from '@store/historyStore';

vi.mock('@store/historyStore');

const mockStore = {
    history: [],
    showModal: vi.fn(),
    setSelectedItem: vi.fn(),
    removeFromHistoryStore: vi.fn(),
    updateHistoryFromStorage: vi.fn(),
};

describe('Компонент HistoryList', () => {
    beforeEach(() => {
        cleanup();
        Object.values(mockStore).forEach((fn) => typeof fn === 'function' && fn.mockReset());
    });

    it('отображает элемент истории, если в хранилище есть записи', () => {
        mockStore.history = [
            {
                id: 'file-001',
                fileName: 'example.csv',
                timestamp: Date.now(),
                highlights: [{}],
            },
        ];
        (useHistoryStore as unknown as vi.Mock).mockReturnValue(mockStore);

        render(<HistoryList />);

        expect(screen.getByText('example.csv')).toBeInTheDocument();
    });

    it('не отображает элементы, если история пуста', () => {
        mockStore.history = [];
        (useHistoryStore as unknown as vi.Mock).mockReturnValue(mockStore);

        render(<HistoryList />);

        expect(screen.queryByText('example.csv')).not.toBeInTheDocument();
    });
});
