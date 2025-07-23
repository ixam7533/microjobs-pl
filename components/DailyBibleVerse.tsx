// components/DailyBibleVerse.tsx
import { useState, useEffect } from 'react';
import styles from './DailyBibleVerse.module.css';

interface BibleVerse {
  text: string;
  reference: string;
}

const BIBLE_VERSES: BibleVerse[] = [
  {
    text: "Chociażby mnie wiodła dolina śmiertelnego cienia, nie będę się lękał niczego złego, bo Ty jesteś przy mnie.",
    reference: "Psalm 23:4"
  },
  {
    text: "Na początku Bóg stworzył niebo i ziemię.",
    reference: "Księga Rodzaju 1:1"
  },
  {
    text: "Młodzi ludzie będą się trudzić i męczyć, młodzieńcy będą się przewracać, ale którzy pokładają nadzieję w Panu, odnawiają siły.",
    reference: "Izajasz 40:31"
  },
  {
    text: "Szukajcie więc najpierw Królestwa Bożego i sprawiedliwości jego, a to wszystko będzie wam dodane.",
    reference: "Mateusz 6:33"
  }
];

export default function DailyBibleVerse() {
  const [currentVerse, setCurrentVerse] = useState<BibleVerse>(BIBLE_VERSES[0]);

  useEffect(() => {
    // Wybierz wers na podstawie dnia roku
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 1000 / 60 / 60 / 24);
    const verseIndex = dayOfYear % BIBLE_VERSES.length;
    setCurrentVerse(BIBLE_VERSES[verseIndex]);
  }, []);

  return (
    <div className={styles.bibleVerseContainer}>
      <div className={styles.verseContent}>
        <p className={styles.verseText}>"{currentVerse.text}"</p>
        <p className={styles.verseReference}>— {currentVerse.reference}</p>
      </div>
      <div className={styles.biblIcon}>📖</div>
    </div>
  );
}
