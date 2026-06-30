import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import AppRoutes from '../routes/AppRoutes.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';

describe('App Routing', () => {
  it('renders the Home page by default', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    );

    // Look for a heading that exists on the home page (e.g. HERO section text)
    // Adjust this text based on what actually renders in Hero.jsx
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeTruthy();
  });
});
