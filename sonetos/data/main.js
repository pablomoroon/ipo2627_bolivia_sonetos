import { sonnets } from './index.js';

// Modelo: interpreta únicamente el formato de los poemas de este proyecto.
export function parsePoem(markdown) {
  const text = markdown.replace(/\r\n?/g, '\n').trim();
  const blocks = text.split(/\n\s*\n/).filter(block =>
    !block.startsWith('# ') && !block.startsWith('Autor:') && !block.startsWith('Fuente:'));
  const stanzas = blocks.map(block => block.split('\n').map(line => line.trimEnd()));
  if (stanzas.length !== 4 || stanzas.some((lines, index) => lines.length !== [4,4,3,3][index])) {
    throw new Error('Cada soneto debe tener cuatro estrofas de 4, 4, 3 y 3 versos.');
  }
  return stanzas;
}

export async function loadSonnets() {
  return Promise.all(sonnets.map(async item => {
    const response = await fetch(new URL(item.file, import.meta.url));
    if (!response.ok) throw new Error(`No se pudo cargar ${item.title}.`);
    return {...item, stanzas: parsePoem(await response.text())};
  }));
}

export class SonnetModel {
  #items; #index = 0;
  constructor(items) {
    if (!items.length) throw new Error('La colección está vacía.');
    const ids = new Set();
    for (const item of items) {
      if(ids.has(item.id) || !item.title || !item.author || item.stanzas.length !== 4 || item.stanzas.some((s,i) => s.length !== [4,4,3,3][i])) throw new Error('Soneto no válido.');
      ids.add(item.id);
    }
    this.#items = structuredClone(items);
  }
  get items() { return structuredClone(this.#items); }
  get index() { return this.#index; }
  get current() { return structuredClone(this.#items[this.#index]); }
  select(id) { const index=this.#items.findIndex(item=>item.id===id); if(index<0)return false; this.#index=index; return true; }
  move(delta) { const next=this.#index+delta; if(next<0 || next>=this.#items.length)return false; this.#index=next; return true; }
}
