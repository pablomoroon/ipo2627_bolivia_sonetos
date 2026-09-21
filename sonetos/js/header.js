const HEADER_PATH = './header.html';

export async function loadHeader() {
    const headerContainer = document.querySelector('[data-component="header"]');

    if (!headerContainer) {
        return;
    }

    try {
        const response = await fetch(HEADER_PATH);

        if (!response.ok) {
            throw new Error(`No se pudo cargar el header: ${response.status}`);
        }

        headerContainer.innerHTML = await response.text();
    } catch (error) {
        console.error(error);
    }
}
