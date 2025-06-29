import { getHistory, addToHistory, removeFromHistory, clearHistory } from '@utils/storage';
import { HistoryItemType } from '@app-types/history';
import { vi } from 'vitest';

describe('storage', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('getHistory', () => {
        it('должен вернуть пустой массив если история пуста', () => {
            expect(getHistory()).toEqual([]);
        });

        it('должен вернуть историю', () => {
            const history: HistoryItemType[] = [
                {
                    id: '1',
                    fileName: 'test.csv',
                    timestamp: 1234567890,
                    highlights: {
                        total_spend_galactic: 100,
                        rows_affected: 100000,
                        less_spent_at: 34,
                        big_spent_at: 56,
                        less_spent_value: 1234235,
                        big_spent_value: 2353546,
                        average_spend_galactic: 1534644,
                        big_spent_civ: 'monsters',
                        less_spent_civ: 'human',
                    },
                },
            ];
            localStorage.setItem('tableHistory', JSON.stringify(history));
            expect(getHistory()).toEqual(history);
        });
    });

    describe('addToHistory', () => {
        it('должен добавить новый элемент в историю', () => {
            const item = {
                fileName: 'test.csv',
                highlights: {
                    total_spend_galactic: 100,
                    rows_affected: 100000,
                    less_spent_at: 34,
                    big_spent_at: 56,
                    less_spent_value: 1234235,
                    big_spent_value: 2353546,
                    average_spend_galactic: 1534644,
                    big_spent_civ: 'monsters',
                    less_spent_civ: 'human',
                },
            };
            const result = addToHistory(item);
            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('timestamp');
            expect(getHistory()).toContainEqual(result);
        });
    });

    describe('removeFromHistory', () => {
        it('удаляет элементы', () => {
            const item = addToHistory({ fileName: 'test.csv' });
            removeFromHistory(item.id);
            expect(getHistory()).toEqual([]);
        });
    });

    describe('clearHistory', () => {
        it('должен отчистить историю', () => {
            addToHistory({ fileName: 'test.csv' });
            clearHistory();
            expect(getHistory()).toEqual([]);
        });
    });
});
