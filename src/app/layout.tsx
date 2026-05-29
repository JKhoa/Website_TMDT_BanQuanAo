import '../styles/index.css';
import '../styles/tailwind.css';
import '../styles/theme.css';
import '../styles/fonts.css';

export const metadata = {
  title: 'Fashion Shop',
  description: 'E-commerce platform for fashion',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        {children}
      </body>
    </html>
  );
}
