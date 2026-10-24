import Dexie, { Table } from 'dexie';

export interface Fruta {
  id?: number;
  nombre: string;
  proveedor?: string;
  fechaCosecha?: string;
  createdAt?: string;
}

class MiAppDB extends Dexie {
  frutas!: Table<Fruta, number>;

  constructor() {
    super('MiAppDB');
    // Versión 1: campos iniciales
    this.version(1).stores({ frutas: '++id, nombre, createdAt' });
    // Versión 2: se agregan los nuevos campos de búsqueda (proveedor, fechaCosecha)
    this.version(2).stores({ frutas: '++id, nombre, proveedor, fechaCosecha, createdAt' });
  }
}

export const db = new MiAppDB();
