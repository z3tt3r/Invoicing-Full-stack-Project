export const formatPrice = (price) => {
    // Vytvoříme instanci formátovače pro českou lokalizaci.
    // Minimální počet desetinných míst 2 zajistí, že se zobrazí i 1000,00 Kč
    const formatter = new Intl.NumberFormat('cs-CZ', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    
    // Zformátujeme a vrátíme výsledek.
    return formatter.format(price);
};