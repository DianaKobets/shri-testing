import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HighlightsSection } from '@components/HighlightsSection';

describe('HighlightsSection', () => {
    it('отображает placeholder при отстуствии хайлайтов', () => {
        render(<HighlightsSection highlights={[]} />);
        expect(screen.getByText('Здесь появятся хайлайты')).toBeInTheDocument();
    });

    it('отображает highlight когда они есть', () => {
        const highlights = [
            { title: '100', description: 'Общие расходы' },
            { title: 'monsters', description: 'Цивилизация max расходов' },
            { title: '33', description: 'Min расходы в день' },
            { title: '36', description: 'Max расходы в день' },
            { title: 'humans', description: 'Цивилизация min расходов' },
            { title: '34', description: 'Средние расходы' },
        ];
        render(<HighlightsSection highlights={highlights} />);
        expect(screen.getByText('100')).toBeInTheDocument();
        expect(screen.getByText('Общие расходы')).toBeInTheDocument();
        expect(screen.getByText('monsters')).toBeInTheDocument();
        expect(screen.getByText('Цивилизация max расходов')).toBeInTheDocument();
        expect(screen.getByText('33')).toBeInTheDocument();
        expect(screen.getByText('Min расходы в день')).toBeInTheDocument();
        expect(screen.getByText('36')).toBeInTheDocument();
        expect(screen.getByText('Max расходы в день')).toBeInTheDocument();
        expect(screen.getByText('humans')).toBeInTheDocument();
        expect(screen.getByText('Цивилизация min расходов')).toBeInTheDocument();
        expect(screen.getByText('34')).toBeInTheDocument();
        expect(screen.getByText('Средние расходы')).toBeInTheDocument();
    });
});
