import Dexie, { Table } from 'dexie';

export interface LocalHymn {
  number: number;
  title: string;
  bibleReference: string;
  mp3Url: string;
  mp3UrlInstr: string;
  verses: any[];
}

export interface LocalVerse {
  id?: number;
  version: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export class MyDatabase extends Dexie {
  hymns!: Table<LocalHymn>;
  bible!: Table<LocalVerse>;

  constructor() {
    super('IASDHualquiDB');
    this.version(1).stores({
      hymns: 'number, title',
      bible: '++id, version, book, chapter, verse'
    });
  }
}

export const db = new MyDatabase();
