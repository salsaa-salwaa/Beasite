import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminPanel from '../src/components/AdminPanel';
import userEvent from '@testing-library/user-event';

global.fetch = vi.fn();

describe('Admin CRUD Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('role', 'admin');
    
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve([
        { id: '1', title: 'Beasiswa Test', provider: 'ProvTest', category: 'S1', deadline: '2025-12-31' }
      ])
    });
  });

  it('reads and displays scholarship list', async () => {
    render(
      <MemoryRouter>
        <AdminPanel />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Beasiswa Test')).toBeInTheDocument();
      expect(screen.getByText('ProvTest')).toBeInTheDocument();
    });
  });

  it('opens add modal (Create flow)', async () => {
    render(
      <MemoryRouter>
        <AdminPanel />
      </MemoryRouter>
    );
    await waitFor(() => screen.getByText('Beasiswa Test'));

    const addButton = screen.getByText(/Tambah Baru/i);
    fireEvent.click(addButton);

    // Form inputs should be visible
    expect(screen.getByText(/Judul Beasiswa/i)).toBeInTheDocument();
    expect(screen.getByText(/Penyelenggara/i)).toBeInTheDocument();
  });

  it('triggers delete confirmation (Delete flow)', async () => {
    window.confirm = vi.fn(() => false); // mock confirm and cancel it
    
    render(
      <MemoryRouter>
        <AdminPanel />
      </MemoryRouter>
    );
    await waitFor(() => screen.getByText('Beasiswa Test'));

    // Find delete buttons
    const deleteButtons = screen.getAllByRole('button').filter(b => b.className.includes('btn-outline'));
    
    if (deleteButtons.length > 0) {
      fireEvent.click(deleteButtons[deleteButtons.length - 1]);
      expect(window.confirm).toHaveBeenCalled();
    }
  });
});
