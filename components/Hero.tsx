import Link from 'next/link';
import DailyBibleVerse from './DailyBibleVerse';

export default function Hero() {
  return (
    <section className="flex-grow flex items-center justify-center px-8">
      <div className="max-w-2xl text-center animate-fadeIn">
        <h2 className="text-5xl font-extrabold mb-4">
          Zarabiaj w wolnej chwili
        </h2>
        <p className="text-lg mb-8">
          Znajdź dorywcze prace w swoim mieście – koszenie trawy, sprzątanie auta i więcej.
        </p>
        
        <DailyBibleVerse />
      </div>
    </section>
  );
}
