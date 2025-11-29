import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useParams, useRouter } from 'next/navigation';
import AcceptQuotePage from '../../app/payin/[uuid]/page';
import {
  useQuoteSummary,
  useUpdateQuoteCurrency,
  useAcceptQuote,
} from '../../app/hooks/useQuote';
import { useCountdown } from '../../app/hooks/useCountdown';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock custom hooks
jest.mock('../../app/hooks/useQuote');
jest.mock('../../app/hooks/useCountdown');

const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseQuoteSummary = useQuoteSummary as jest.MockedFunction<
  typeof useQuoteSummary
>;
const mockUseUpdateQuoteCurrency =
  useUpdateQuoteCurrency as jest.MockedFunction<typeof useUpdateQuoteCurrency>;
const mockUseAcceptQuote = useAcceptQuote as jest.MockedFunction<
  typeof useAcceptQuote
>;
const mockUseCountdown = useCountdown as jest.MockedFunction<
  typeof useCountdown
>;

describe('AcceptQuotePage', () => {
  const mockReplace = jest.fn();
  const mockMutate = jest.fn();
  const mockAcceptMutate = jest.fn();

  const mockQuote = {
    uuid: 'test-uuid',
    merchantDisplayName: 'Test Merchant',
    reference: 'REF-123',
    status: 'PENDING',
    quoteStatus: 'PENDING',
    displayCurrency: { currency: 'EUR', amount: 100, actual: 0 },
    paidCurrency: { currency: 'BTC', amount: 0.002, actual: 0 },
    acceptanceExpiryDate: Date.now() + 300000, // 5 minutes from now
    expiryDate: Date.now() + 600000, // 10 minutes from now
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseParams.mockReturnValue({ uuid: 'test-uuid' });
    mockUseRouter.mockReturnValue({ replace: mockReplace } as any);

    mockUseQuoteSummary.mockReturnValue({
      data: mockQuote,
      isLoading: false,
      error: null,
    } as any);

    mockUseUpdateQuoteCurrency.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any);

    mockUseAcceptQuote.mockReturnValue({
      mutate: mockAcceptMutate,
      isPending: false,
    } as any);

    mockUseCountdown.mockReturnValue({
      timeLeft: '00:05:00',
      isExpired: false,
    });
  });

  it('renders loading state', () => {
    mockUseQuoteSummary.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    const { container } = render(<AcceptQuotePage />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('renders error state', () => {
    mockUseQuoteSummary.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load'),
    } as any);

    render(<AcceptQuotePage />);
    expect(
      screen.getByText('Failed to load quote details.'),
    ).toBeInTheDocument();
  });

  it('renders quote details correctly', () => {
    render(<AcceptQuotePage />);

    expect(screen.getByText('Test Merchant')).toBeInTheDocument();
    expect(screen.getByText('100.00')).toBeInTheDocument();
    expect(screen.getByText('EUR')).toBeInTheDocument();
    expect(screen.getByText('REF-123')).toBeInTheDocument();
  });

  it('redirects to expired page when status is EXPIRED', () => {
    mockUseQuoteSummary.mockReturnValue({
      data: { ...mockQuote, status: 'EXPIRED' },
      isLoading: false,
      error: null,
    } as any);

    render(<AcceptQuotePage />);
    expect(mockReplace).toHaveBeenCalledWith('/payin/test-uuid/expired');
  });

  it('redirects to pay page when quoteStatus is ACCEPTED', () => {
    mockUseQuoteSummary.mockReturnValue({
      data: { ...mockQuote, quoteStatus: 'ACCEPTED' },
      isLoading: false,
      error: null,
    } as any);

    render(<AcceptQuotePage />);
    expect(mockReplace).toHaveBeenCalledWith('/payin/test-uuid/pay');
  });

  it('updates currency when user selects from dropdown', async () => {
    const user = userEvent.setup();
    render(<AcceptQuotePage />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'BTC');

    expect(mockMutate).toHaveBeenCalledWith('BTC');
  });

  it('shows payment details after selecting currency', async () => {
    const user = userEvent.setup();
    render(<AcceptQuotePage />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'BTC');

    await waitFor(() => {
      expect(screen.getByText('Amount due')).toBeInTheDocument();
      expect(screen.getByText('0.002 BTC')).toBeInTheDocument();
      expect(screen.getByText('Quoted price expires in')).toBeInTheDocument();
    });
  });

  it('disables confirm button when mutation is pending', async () => {
    const user = userEvent.setup();
    mockUseUpdateQuoteCurrency.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    } as any);

    render(<AcceptQuotePage />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'BTC');

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /confirm/i });
      expect(button).toBeDisabled();
    });
  });

  it('calls acceptQuote mutation when confirm button is clicked', async () => {
    const user = userEvent.setup();
    render(<AcceptQuotePage />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'BTC');

    await waitFor(async () => {
      const button = screen.getByRole('button', { name: /confirm/i });
      await user.click(button);
    });

    expect(mockAcceptMutate).toHaveBeenCalled();
  });

  it('shows "Processing..." when accepting quote', async () => {
    const user = userEvent.setup();
    render(<AcceptQuotePage />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'BTC');

    await waitFor(async () => {
      const button = screen.getByRole('button', { name: /confirm/i });
      await user.click(button);
    });

    await waitFor(() => {
      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });
  });
});
