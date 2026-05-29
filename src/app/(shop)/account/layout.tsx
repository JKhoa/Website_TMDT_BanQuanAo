import { AccountPage } from '@/app/pages/AccountPage';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AccountPage>{children}</AccountPage>;
}
