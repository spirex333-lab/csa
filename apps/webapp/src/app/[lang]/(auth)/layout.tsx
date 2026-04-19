import { AppFooter } from '@webapp/components/common/footer';
import { AppHeader } from '@webapp/components/common/header';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      {children}
      <AppFooter />
    </>
  );
}
