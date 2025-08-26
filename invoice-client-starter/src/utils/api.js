
const API_URL = "http://localhost:8080";
const fetchData = (url, requestOptions) => {
    const apiUrl = `${API_URL}${url}`;

    return fetch(apiUrl, requestOptions)
        .then((response) => {
            if (!response.ok) {
                // Zlepšená chybová zpráva: Zahrnuje text odpovědi pro lepší ladění
                return response.text().then(text => {
                    throw new Error(`Network response was not ok: ${response.status} ${response.statusText} - ${text}`);
                });
            }

            // Pokud je status 204 No Content (běžné pro DELETE), nevracíme JSON
            if (response.status === 204) {
                return null;
            }

            // Jinak parsujeme JSON
            return response.json();
        })
        .catch((error) => {
            // Přeposíláme chybu dál, aby ji mohl zpracovat volající kód
            throw error;
        });
};

export const apiGet = (url, params) => {
    const filteredParams = Object.fromEntries(
        Object.entries(params || {}).filter(([_, value]) => value != null)
    );

    const queryString = new URLSearchParams(filteredParams).toString();
    // Změna: Přidáme '?' a parametry pouze pokud queryString není prázdný
    const finalUrl = queryString ? `${url}?${queryString}` : url;

    const requestOptions = {
        method: "GET",
    };

    // Použijeme nově sestavenou finalUrl
    return fetchData(finalUrl, requestOptions);
};

export const apiPost = (url, data) => {
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    };

    return fetchData(url, requestOptions);
};

export const apiPut = (url, data) => {
    const requestOptions = {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    };

    return fetchData(url, requestOptions);
};

export const apiDelete = (url) => {
    const requestOptions = {
        method: "DELETE",
    };

    return fetchData(url, requestOptions);
};
