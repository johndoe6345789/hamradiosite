import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/test-utils';
import LanguageSwitcher from './LanguageSwitcher';

const mockReplace = jest.fn();

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => '/',
}));

jest.mock('next-intl', () => ({
  useLocale: () => 'en',
  useTranslations: (namespace: string) => (key: string) => {
    const messages: Record<string, Record<string, string>> = {
      language: { switchTo: 'Switch language', en: 'English', cy: 'Cymraeg' },
    };
    return messages[namespace]?.[key] ?? key;
  },
  useMessages: () => ({}),
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    mockReplace.mockClear();
  });

  it('renders the language icon button', () => {
    renderWithProviders(<LanguageSwitcher />);
    expect(screen.getByLabelText('Switch language')).toBeInTheDocument();
  });

  it('opens menu on click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LanguageSwitcher />);
    await user.click(screen.getByLabelText('Switch language'));
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Cymraeg')).toBeInTheDocument();
  });

  it('calls router.replace when a language is selected', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LanguageSwitcher />);
    await user.click(screen.getByLabelText('Switch language'));
    await user.click(screen.getByText('Cymraeg'));
    expect(mockReplace).toHaveBeenCalledWith('/', { locale: 'cy' });
  });
});
