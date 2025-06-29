import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FileUploadSection } from '@components/FileUploadSection';

describe('FileUploadSection', () => {
    const mockOnFileSelect = vi.fn();
    const mockOnSend = vi.fn();
    const mockOnClear = vi.fn();
    const defaultProps = {
        file: null,
        status: 'idle' as const,
        error: null,
        onFileSelect: mockOnFileSelect,
        onSend: mockOnSend,
        onClear: mockOnClear,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('рендерит Dropzone когда файл не выбран', () => {
        render(<FileUploadSection {...defaultProps} />);
        expect(screen.getByText('Загрузить файл')).toBeInTheDocument();
    });

    it('рендерится кнопка "Отправить" когда файл не выбран', () => {
        const file = new File(['content'], 'test.csv', { type: 'text/csv' });
        render(<FileUploadSection {...defaultProps} file={file} />);
        expect(screen.getByText('Отправить')).toBeInTheDocument();
    });

    it('вызывается onSend при клике на кнопку "Отправить', () => {
        const file = new File(['content'], 'test.csv', { type: 'text/csv' });
        render(<FileUploadSection {...defaultProps} file={file} />);
        fireEvent.click(screen.getByText('Отправить'));
        expect(mockOnSend).toHaveBeenCalled();
    });

    it('кнопка "Отправить" не отображается в процессе обработки файла бэком', () => {
        const file = new File(['content'], 'test.csv', { type: 'text/csv' });
        render(<FileUploadSection {...defaultProps} file={file} status="processing" />);
        expect(screen.queryByText('Отправить')).not.toBeInTheDocument();
    });
});
