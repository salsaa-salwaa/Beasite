import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../src/pages/Login';
import UserProfile from '../src/pages/UserProfile';
import Scholarships from '../src/pages/Scholarships';
import * as roleModule from '../src/role';
import userEvent from '@testing-library/user-event';

global.fetch = vi.fn();

describe('User Authentication and Profile Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    
    // Create a mock registered user
    localStorage.setItem('registeredUser', JSON.stringify({ name: 'Budi Test', email: 'budi@test.com', password: 'password123' }));
    
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve([
        { id: '1', title: 'Beasiswa S1 ITB', level: 'S1', category: 'S1' },
        { id: '2', title: 'Beasiswa S2 UGM', level: 'S2', category: 'S2' }
      ])
    });
  });

  it('handles user login successfully', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('nama@email.com');
    const passInput = screen.getByPlaceholderText('••••••••');
    const loginButton = screen.getByRole('button', { name: /Masuk/i });

    await userEvent.type(emailInput, 'budi@test.com');
    await userEvent.type(passInput, 'password123');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Login berhasil/i)).toBeInTheDocument();
    });
  });

  it('loads recommendation tab in Scholarships page for logged in users', async () => {
    localStorage.setItem('role', 'applicant');
    localStorage.setItem('userPreferences', JSON.stringify({ currentLevel: 'SMA', targetLevel: 'S1' }));

    render(
      <MemoryRouter>
        <Scholarships />
      </MemoryRouter>
    );

    // Click the recommendations tab
    await waitFor(() => screen.getByText(/Rekomendasi Untukmu/i));
    fireEvent.click(screen.getByText(/Rekomendasi Untukmu/i));

    // The S1 scholarship should be displayed based on targetLevel 'S1'
    await waitFor(() => {
      expect(screen.getByText('Beasiswa S1 ITB')).toBeInTheDocument();
    });
  });
});
