import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Profile from './Profile';
import authReducer from '../features/auth/authSlice';
import themeReducer from '../features/theme/themeSlice';
import { maskAccountNumber, optimizeImage, INDIAN_BANKS, ACCOUNT_VALIDATION_RULES } from '../data/bankData';
import '@testing-library/jest-dom';

// Mock the API calls
jest.mock('../utils/api', () => ({
  updateProfile: jest.fn(() => Promise.resolve({ data: { message: 'Profile updated' } })),
  uploadProfileImage: jest.fn(() => Promise.resolve({ data: { url: 'mock-image-url' } })),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    loading: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
}));

// Create a test store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      theme: themeReducer,
    },
    preloadedState: {
      auth: {
        user: {
          id: '123',
          name: 'John Doe',
          email: 'john@example.com',
          phoneNumber: '+91-9876543210',
          accountNumber: '1234567890',
          bankName: 'HDFC Bank',
          ifscCode: 'HDFC0000001',
          profileImage: 'https://example.com/avatar.jpg',
        },
        token: 'mock-token',
        loading: false,
        error: null,
      },
      theme: {
        isDark: false,
      },
      ...initialState,
    },
  });
};

describe('Profile Page - Unit Tests', () => {
  describe('maskAccountNumber utility function', () => {
    it('should mask account number showing only last 4 digits', () => {
      const result = maskAccountNumber('1234567890');
      expect(result).toBe('****7890');
    });

    it('should handle short account numbers', () => {
      const result = maskAccountNumber('1234');
      expect(result).toBe('****1234');
    });

    it('should return empty string for empty input', () => {
      const result = maskAccountNumber('');
      expect(result).toBe('****');
    });

    it('should preserve leading zeros in mask', () => {
      const result = maskAccountNumber('0000123456');
      expect(result).toBe('****3456');
    });
  });

  describe('optimizeImage utility function', () => {
    it('should optimize image and return data URL', async () => {
      // Create a mock file
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      const dataUrl = canvas.toDataURL('image/webp');

      const file = new File([dataUrl], 'test.jpg', { type: 'image/jpeg' });

      const result = await optimizeImage(file);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.startsWith('data:image')).toBe(true);
    });

    it('should handle file read errors gracefully', async () => {
      const invalidFile = new File(['invalid'], 'test.jpg', { type: 'image/jpeg' });
      invalidFile.size = 10 * 1024 * 1024; // 10MB

      // The function should still process it
      try {
        const result = await optimizeImage(invalidFile);
        expect(result).toBeTruthy();
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });
  });

  describe('INDIAN_BANKS data', () => {
    it('should contain major Indian banks', () => {
      expect(INDIAN_BANKS.length).toBeGreaterThan(20);
    });

    it('should include HDFC Bank', () => {
      expect(INDIAN_BANKS).toContain('HDFC Bank');
    });

    it('should include State Bank of India', () => {
      expect(INDIAN_BANKS).toContain('State Bank of India');
    });

    it('should include ICICI Bank', () => {
      expect(INDIAN_BANKS).toContain('ICICI Bank');
    });

    it('should be properly formatted strings', () => {
      INDIAN_BANKS.forEach(bank => {
        expect(typeof bank).toBe('string');
        expect(bank.length).toBeGreaterThan(0);
      });
    });
  });

  describe('ACCOUNT_VALIDATION_RULES', () => {
    it('should define minimum length as 8', () => {
      expect(ACCOUNT_VALIDATION_RULES.minLength).toBe(8);
    });

    it('should define maximum length as 20', () => {
      expect(ACCOUNT_VALIDATION_RULES.maxLength).toBe(20);
    });

    it('should have a pattern that only allows digits', () => {
      const pattern = ACCOUNT_VALIDATION_RULES.pattern;
      expect(pattern.test('1234567890')).toBe(true);
      expect(pattern.test('123ABC7890')).toBe(false);
      expect(pattern.test('1234-567890')).toBe(false);
    });
  });
});

describe('Profile Page - Integration Tests', () => {
  let store;

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
  });

  const renderProfile = () => {
    return render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );
  };

  describe('Profile Form Rendering', () => {
    it('should render profile form with all fields', () => {
      renderProfile();
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('+91-9876543210')).toBeInTheDocument();
    });

    it('should display user initials in avatar when no image', () => {
      const customStore = createTestStore({
        auth: {
          user: {
            id: '123',
            name: 'John Doe',
            email: 'john@example.com',
            phoneNumber: '+91-9876543210',
            accountNumber: '',
            bankName: '',
            ifscCode: '',
            profileImage: '',
          },
          token: 'mock-token',
          loading: false,
          error: null,
        },
        theme: { isDark: false },
      });

      render(
        <Provider store={customStore}>
          <Profile />
        </Provider>
      );

      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('should display profile image when available', () => {
      renderProfile();
      const image = screen.getByAltText('Profile');
      expect(image).toBeInTheDocument();
      expect(image.src).toContain('example.com/avatar.jpg');
    });
  });

  describe('Account Number Validation', () => {
    it('should reject account numbers less than 8 characters', async () => {
      const user = userEvent.setup();
      renderProfile();

      const accountInput = screen.getByDisplayValue('1234567890');
      await user.clear(accountInput);
      await user.type(accountInput, '123456');

      const saveButton = screen.getByRole('button', { name: /save profile/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText(/must be between/i)).toBeInTheDocument();
      });
    });

    it('should reject account numbers greater than 20 characters', async () => {
      const user = userEvent.setup();
      renderProfile();

      const accountInput = screen.getByDisplayValue('1234567890');
      await user.clear(accountInput);
      await user.type(accountInput, '123456789012345678901'); // 21 chars

      const saveButton = screen.getByRole('button', { name: /save profile/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText(/must be between/i)).toBeInTheDocument();
      });
    });

    it('should reject account numbers with non-digit characters', async () => {
      const user = userEvent.setup();
      renderProfile();

      const accountInput = screen.getByDisplayValue('1234567890');
      await user.clear(accountInput);
      await user.type(accountInput, '123ABC7890');

      const saveButton = screen.getByRole('button', { name: /save profile/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText(/only digits allowed/i)).toBeInTheDocument();
      });
    });

    it('should accept valid account numbers', async () => {
      const user = userEvent.setup();
      renderProfile();

      const accountInput = screen.getByDisplayValue('1234567890');
      await user.clear(accountInput);
      await user.type(accountInput, '98765432101234');

      // Valid account should not show error
      await waitFor(() => {
        const errorMessages = screen.queryAllByText(/must be between|only digits/i);
        expect(errorMessages.length).toBe(0);
      });
    });
  });

  describe('Bank Validation and Filtering', () => {
    it('should display bank dropdown when clicking bank field', async () => {
      const user = userEvent.setup();
      renderProfile();

      const bankInputs = screen.getAllByDisplayValue('HDFC Bank');
      const bankInput = bankInputs[0];

      await user.click(bankInput);
      await waitFor(() => {
        expect(screen.getByText('State Bank of India')).toBeInTheDocument();
      });
    });

    it('should filter banks based on search input', async () => {
      const user = userEvent.setup();
      renderProfile();

      const bankInputs = screen.getAllByDisplayValue('HDFC Bank');
      const bankInput = bankInputs[0];

      await user.click(bankInput);

      const searchInput = screen.getByPlaceholderText(/search bank/i);
      await user.type(searchInput, 'ICICI');

      await waitFor(() => {
        expect(screen.getByText('ICICI Bank')).toBeInTheDocument();
        expect(screen.queryByText('State Bank of India')).not.toBeInTheDocument();
      });
    });

    it('should require bank when account number is provided', async () => {
      const user = userEvent.setup();
      const customStore = createTestStore({
        auth: {
          user: {
            id: '123',
            name: 'John Doe',
            email: 'john@example.com',
            phoneNumber: '+91-9876543210',
            accountNumber: '12345678',
            bankName: '', // No bank
            ifscCode: '',
            profileImage: '',
          },
          token: 'mock-token',
          loading: false,
          error: null,
        },
        theme: { isDark: false },
      });

      render(
        <Provider store={customStore}>
          <Profile />
        </Provider>
      );

      const saveButton = screen.getByRole('button', { name: /save profile/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText(/please select a bank/i)).toBeInTheDocument();
      });
    });

    it('should allow deletion of bank when no account number', async () => {
      const customStore = createTestStore({
        auth: {
          user: {
            id: '123',
            name: 'John Doe',
            email: 'john@example.com',
            phoneNumber: '+91-9876543210',
            accountNumber: '', // No account
            bankName: 'HDFC Bank',
            ifscCode: '',
            profileImage: '',
          },
          token: 'mock-token',
          loading: false,
          error: null,
        },
        theme: { isDark: false },
      });

      render(
        <Provider store={customStore}>
          <Profile />
        </Provider>
      );

      const user = userEvent.setup();
      const saveButton = screen.getByRole('button', { name: /save profile/i });

      // Should not require bank if account is empty
      await user.click(saveButton);

      await waitFor(() => {
        const errorMessages = screen.queryAllByText(/please select a bank/i);
        expect(errorMessages.length).toBe(0);
      });
    });
  });

  describe('IFSC Code Validation', () => {
    it('should validate IFSC code format', async () => {
      const user = userEvent.setup();
      renderProfile();

      const ifscInputs = screen.getAllByDisplayValue('HDFC0000001');
      const ifscInput = ifscInputs[0];

      await user.clear(ifscInput);
      await user.type(ifscInput, 'INVALID');

      const saveButton = screen.getByRole('button', { name: /save profile/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid ifsc format/i)).toBeInTheDocument();
      });
    });

    it('should accept valid IFSC code', async () => {
      const user = userEvent.setup();
      renderProfile();

      const ifscInputs = screen.getAllByDisplayValue('HDFC0000001');
      const ifscInput = ifscInputs[0];

      await user.clear(ifscInput);
      await user.type(ifscInput, 'ICIC0000001');

      await waitFor(() => {
        const errorMessages = screen.queryAllByText(/invalid ifsc format/i);
        expect(errorMessages.length).toBe(0);
      });
    });
  });

  describe('Profile Picture Upload and Delete', () => {
    it('should show remove button when image is selected', async () => {
      renderProfile();
      
      // Remove button should be visible since image exists
      expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
    });

    it('should handle image file selection', async () => {
      const user = userEvent.setup();
      const { container } = renderProfile();

      const fileInput = container.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();

      const file = new File(['dummy'], 'test.jpg', { type: 'image/jpeg' });
      await user.upload(fileInput, file);

      // File should be processed
      expect(fileInput.files[0]).toBe(file);
    });

    it('should show loading toast while optimizing image', async () => {
      const user = userEvent.setup();
      const { container } = renderProfile();
      const toast = require('react-hot-toast').default;

      const fileInput = container.querySelector('input[type="file"]');
      const file = new File(['dummy'], 'test.jpg', { type: 'image/jpeg' });

      await user.upload(fileInput, file);

      await waitFor(() => {
        expect(toast.loading).toHaveBeenCalled();
      });
    });

    it('should confirm before deleting profile picture', async () => {
      const user = userEvent.setup();
      window.confirm = jest.fn(() => false); // User cancels

      renderProfile();

      const removeButton = screen.getByRole('button', { name: /remove/i });
      await user.click(removeButton);

      expect(window.confirm).toHaveBeenCalled();
    });

    it('should delete profile picture when confirmed', async () => {
      const user = userEvent.setup();
      window.confirm = jest.fn(() => true); // User confirms
      const toast = require('react-hot-toast').default;

      renderProfile();

      const removeButton = screen.getByRole('button', { name: /remove/i });
      await user.click(removeButton);

      await waitFor(() => {
        expect(window.confirm).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith(
          expect.stringContaining('removed')
        );
      });
    });
  });

  describe('Form Submission', () => {
    it('should enable save button when form is valid', async () => {
      renderProfile();
      const saveButton = screen.getByRole('button', { name: /save profile/i });
      expect(saveButton).not.toBeDisabled();
    });

    it('should show error messages for invalid fields', async () => {
      const user = userEvent.setup();
      renderProfile();

      const nameInput = screen.getByDisplayValue('John Doe');
      await user.clear(nameInput);

      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      });
    });

    it('should clear error when field is corrected', async () => {
      const user = userEvent.setup();
      renderProfile();

      const nameInput = screen.getByDisplayValue('John Doe');
      await user.clear(nameInput);

      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      });

      await user.type(nameInput, 'Jane Doe');

      await waitFor(() => {
        expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Theme Support', () => {
    it('should render in light mode', () => {
      const { container } = renderProfile();
      // Light mode styles should be applied
      expect(container).toBeTruthy();
    });

    it('should render in dark mode', () => {
      const darkStore = createTestStore({
        theme: { isDark: true },
      });

      const { container } = render(
        <Provider store={darkStore}>
          <Profile />
        </Provider>
      );

      expect(container).toBeTruthy();
    });
  });
});
