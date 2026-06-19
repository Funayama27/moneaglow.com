import "./globals.css";

export const metadata = {
  title: "monea | 自分らしく美しくなりたいすべての人へ",
  description:
    "誰かになるためではなく、自分自身の魅力を見つけ、花開かせるために。monea beauty online store.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
