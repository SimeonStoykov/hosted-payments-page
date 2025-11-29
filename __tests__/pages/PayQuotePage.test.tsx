import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useParams, useRouter } from 'next/navigation';
import PayQuotePage from '../../app/payin/[uuid]/pay/page';
import { useQuoteSummary } from '../../app/hooks/useQuote';
import { useCountdown } from '../../app/hooks/useCountdown';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock custom hooks
jest.mock('../../app/hooks/useQuote');
jest.mock('../../app/hooks/useCountdown');

// Mock clipboard
const mockWriteText = jest.fn().mockResolvedValue(undefined);
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: mockWriteText,
  },
  writable: true,
  configurable: true,
});

const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseQuoteSummary = useQuoteSummary as jest.MockedFunction<
  typeof useQuoteSummary
>;
const mockUseCountdown = useCountdown as jest.MockedFunction<
  typeof useCountdown
>;

describe('PayQuotePage', () => {
  const mockReplace = jest.fn();

  const mockQuote = {
    uuid: 'test-uuid',
    merchantDisplayName: 'Test Merchant',
    reference: 'REF-123',
    status: 'PENDING',
    quoteStatus: 'ACCEPTED',
    displayCurrency: { currency: 'EUR', amount: 100, actual: 0 },
    paidCurrency: { currency: 'BTC', amount: 0.002, actual: 0 },
    address: {
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      uri: 'bitcoin:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh?amount=0.002',
    },
    expiryDate: Date.now() + 600000, // 10 minutes from now
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockWriteText.mockClear();

    mockUseParams.mockReturnValue({ uuid: 'test-uuid' });
    mockUseRouter.mockReturnValue({
      replace: mockReplace,
    } as unknown as ReturnType<typeof useRouter>);

    mockUseQuoteSummary.mockReturnValue({
      data: mockQuote,
      isLoading: false,
      error: null,
    } as unknown as ReturnType<typeof useQuoteSummary>);

    mockUseCountdown.mockReturnValue({
      timeLeft: '09:59',
      isExpired: false,
    });
  });

  it('renders loading state', () => {
    mockUseQuoteSummary.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as unknown as ReturnType<typeof useQuoteSummary>);

    const { container } = render(<PayQuotePage />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('renders error state', () => {
    mockUseQuoteSummary.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load'),
    } as unknown as ReturnType<typeof useQuoteSummary>);

    render(<PayQuotePage />);
    expect(screen.getByText('Invalid payment details.')).toBeInTheDocument();
  });

  it('renders payment details correctly', () => {
    render(<PayQuotePage />);

    expect(screen.getByText('Pay with BTC')).toBeInTheDocument();
    expect(screen.getByText('0.002 BTC')).toBeInTheDocument();
    expect(screen.getByText('bc1qxy2...x0wlh')).toBeInTheDocument();
    expect(
      screen.getByText('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'),
    ).toBeInTheDocument();
  });

  it('redirects to expired page when status is EXPIRED', () => {
    mockUseQuoteSummary.mockReturnValue({
      data: { ...mockQuote, status: 'EXPIRED' },
      isLoading: false,
      error: null,
    } as unknown as ReturnType<typeof useQuoteSummary>);

    render(<PayQuotePage />);
    expect(mockReplace).toHaveBeenCalledWith('/payin/test-uuid/expired');
  });

  it('redirects to expired page when timer expires', () => {
    mockUseCountdown.mockReturnValue({
      timeLeft: '00:00',
      isExpired: true,
    });

    render(<PayQuotePage />);
    expect(mockReplace).toHaveBeenCalledWith('/payin/test-uuid/expired');
  });

  it('copies amount to clipboard', async () => {
    const user = userEvent.setup();
    // Re-apply mock after userEvent.setup() potentially overwrites it
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: mockWriteText,
      },
      writable: true,
      configurable: true,
    });

    render(<PayQuotePage />);

    const copyButtons = screen.getAllByRole('button');
    // First button is usually amount copy (based on order in DOM)
    await user.click(copyButtons[0]);

    expect(mockWriteText).toHaveBeenCalledWith('0.002');
  });

  it('copies address to clipboard', async () => {
    const user = userEvent.setup();
    // Re-apply mock after userEvent.setup() potentially overwrites it
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: mockWriteText,
      },
      writable: true,
      configurable: true,
    });

    render(<PayQuotePage />);

    const copyButtons = screen.getAllByRole('button');
    // Second button is address copy
    await user.click(copyButtons[1]);

    expect(mockWriteText).toHaveBeenCalledWith(
      'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    );
  });

  it('renders QR code', () => {
    const { container } = render(<PayQuotePage />);
    // QRCode renders as an svg
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders timer', () => {
    render(<PayQuotePage />);
    expect(screen.getByText('Time left to pay')).toBeInTheDocument();
    expect(screen.getByText('09:59')).toBeInTheDocument();
  });
});
