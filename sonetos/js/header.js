// Carga del fragmento local de cabecera; se conserva la cabecera inicial si falla.
export async function loadHeader() {
  const host = document.querySelector('[data-header]');
  try {
    const response = await fetch(new URL('../components/header.html', import.meta.url));
    if (!response.ok) throw new Error('Cabecera no disponible');
    const parsed = new DOMParser().parseFromString(await response.text(), 'text/html');
    const header = parsed.querySelector('header');
    if (!header) throw new Error('Cabecera no válida');
    host.replaceChildren(document.importNode(header, true));
  } catch { /* La cabecera semántica inicial sigue disponible. */ }
}
