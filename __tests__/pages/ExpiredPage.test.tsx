import { render, screen, waitFor } from '@testing-library/react';
import ExpiredPage from '../../app/payin/[uuid]/expired/page';

// Mock next/navigation
const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useParams: () => ({ uuid: 'test-uuid' }),
  useRouter: () => ({ replace: mockReplace }),
}));

// Mock useQuote hook
const mockUseQuoteSummary = jest.fn();
jest.mock('../../app/hooks/useQuote', () => ({
  useQuoteSummary: () => mockUseQuoteSummary(),
}));

// Mock Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ComponentProps<'img'>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt || ''} />
  ),
}));

describe('ExpiredPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading spinner when loading', () => {
    mockUseQuoteSummary.mockReturnValue({
      data: null,
      isLoading: true,
    });

    const { container } = render(<ExpiredPage />);
    // Check for spinner (it's a div with animate-spin class)
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders expired content when quote is EXPIRED', () => {
    mockUseQuoteSummary.mockReturnValue({
      data: { status: 'EXPIRED' },
      isLoading: false,
    });

    render(<ExpiredPage />);
    expect(screen.getByText('Payment details expired')).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('redirects to Pay page when the quote is accepted', async () => {
    mockUseQuoteSummary.mockReturnValue({
      data: { status: 'PENDING', quoteStatus: 'ACCEPTED' },
      isLoading: false,
    });

    render(<ExpiredPage />);

    // Should show spinner while redirecting
    expect(
      screen.queryByText('Payment details expired'),
    ).not.toBeInTheDocument();

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/payin/test-uuid/pay');
    });
  });

  it('redirects to Accept page when the quote is not accepted', async () => {
    mockUseQuoteSummary.mockReturnValue({
      data: { status: 'PENDING', quoteStatus: 'TEMPLATE' },
      isLoading: false,
    });

    render(<ExpiredPage />);

    // Should show spinner while redirecting
    expect(
      screen.queryByText('Payment details expired'),
    ).not.toBeInTheDocument();

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/payin/test-uuid');
    });
  });
});
