import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: 'Vision Bin - PITW',
  description: 'Promociona tu app Vision Bin y su impacto ambiental. Transformando comunidades con educación ambiental y reportes inteligentes. Desarrollado por estudiantes de la carrera de Ingeniería en Sistemas Computacionales.',
  icon: '/favicon.ico',
  openGraph: {
    title: 'Vision Bin - PITW',
    description: 'Promociona tu app Vision Bin y su impacto ambiental. Transformando comunidades con educación ambiental y reportes inteligentes. Desarrollado por estudiantes de la carrera de Ingeniería en Sistemas Computacionales.',
    image: '/image.png',
    url: 'https://visionbin.programmersintheworld.com',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
