import './global.css';

export const metadata = {
  title: 'CSA - Crypto Swap App',
  description:
    'CSA (Crypto Swap App) is a seamless platform for exchanging digital assets. With a user-friendly interface and robust security, CSA lets you swap cryptocurrencies quickly and securely.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
