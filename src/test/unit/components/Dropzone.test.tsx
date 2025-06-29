import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Dropzone } from '@components/Dropzone';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
console.log('React:', React.version);
console.log('ReactDOM:', ReactDOM.version);
describe('Поведение Drag&Drop', () => {
    const mockOnFileSelect = vi.fn();
    const mockOnClear = vi.fn();
    const defaultProps = {
        file: null,
        status: 'idle' as const,
        error: null,
        onFileSelect: mockOnFileSelect,
        onClear: mockOnClear,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('рендерится кнопка загрузки и инструкции, если не выбран ни один файл', () => {
        render(<Dropzone {...defaultProps} />);
        expect(screen.getByText('Загрузить файл')).toBeInTheDocument();
        expect(screen.getByText('или перетащите сюда .csv файл')).toBeInTheDocument();
    });

    it('обрабатывает выбор файла через input', () => {
        render(<Dropzone {...defaultProps} />);
        const input = screen.getByTestId('file-input');
        const file = new File(['content'], 'test.csv', { type: 'text/csv' });

        fireEvent.change(input, { target: { files: [file] } });
        expect(mockOnFileSelect).toHaveBeenCalledWith(file);
    });

    it('показывает ошибку для файла, отличного от CSV', () => {
        render(<Dropzone {...defaultProps} />);
        const input = screen.getByTestId('file-input');
        const file = new File(['content'], 'test.txt', { type: 'text/plain' });

        fireEvent.change(input, { target: { files: [file] } });
        expect(screen.getByText('Можно загружать только *.csv файлы')).toBeInTheDocument();
        expect(mockOnFileSelect).not.toHaveBeenCalled();
    });

    it('поддерживает выбор файлов drag-and-drop', () => {
        render(<Dropzone {...defaultProps} />);
        const dropzone = screen.getByTestId('dropzone');
        const file = new File(['content'], 'test.csv', { type: 'text/csv' });

        fireEvent.dragEnter(dropzone, { dataTransfer: { files: [] } });
        expect(screen.getByText('Отпустите для загрузки')).toBeInTheDocument();
        fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });
        expect(mockOnFileSelect).toHaveBeenCalledWith(file);
    });

    it('отображает загрузчик во время обработки', () => {
        render(<Dropzone {...defaultProps} status="processing" />);
        expect(screen.getByTestId('loader')).toBeInTheDocument();
        expect(screen.getByText('идёт парсинг файла')).toBeInTheDocument();
    });

    it('отображает статус завершения', () => {
        const file = new File(['content'], 'test.csv', { type: 'text/csv' });
        render(<Dropzone {...defaultProps} file={file} status="completed" />);
        expect(screen.getByText('готово!')).toBeInTheDocument();
        expect(screen.getByText('test.csv')).toBeInTheDocument();
    });

    it('отображает сообщение об ошибке', () => {
        render(<Dropzone {...defaultProps} error="Ошибка обработки" />);
        expect(screen.getByText('Ошибка обработки')).toBeInTheDocument();
    });
});
