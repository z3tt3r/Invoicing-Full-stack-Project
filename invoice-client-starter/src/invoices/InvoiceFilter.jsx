import React, { useState, useEffect } from "react";
import { apiGet } from "../utils/api";
import { Link } from "react-router-dom";

/**
 * Komponenta pro filtrační formulář faktur.
 * Odděluje logiku filtru od hlavní komponenty InvoiceIndex.
 * @param {object} props
 * @param {object} props.initialFilterParams Počáteční parametry filtru.
 * @param {Function} props.onFilterSubmit Funkce, která se zavolá po odeslání formuláře s novými parametry.
 * @param {boolean} props.isIcFilterActive Indikuje, zda jsou faktury filtrovány podle IČ z URL.
 * @param {boolean} props.isFilterOpen Indikuje, zda je filtr otevřený.
 * @param {Function} props.onToggleFilter Funkce pro přepínání stavu filtru.
 */
const InvoiceFilter = ({ initialFilterParams, onFilterSubmit, isIcFilterActive, isFilterOpen, onToggleFilter }) => {
    const [filterParams, setFilterParams] = useState(initialFilterParams);
    const [personsLookup, setPersonsLookup] = useState([]);
    const [error, setError] = useState(null);

    // Načte seznam osob pro select boxy
    useEffect(() => {
        const fetchPersonsForFilter = async () => {
            try {
                const fetchedPersons = await apiGet("/api/persons/invoice-related");
                setPersonsLookup(fetchedPersons);
            } catch (err) {
                setError("Chyba při načítání osob pro filtry: " + err.message);
            }
        };
        fetchPersonsForFilter();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterParams(prevParams => ({
            ...prevParams,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilterSubmit(filterParams);
    };

    if (isIcFilterActive) {
        return (
            <div className="alert alert-info mb-4">
                Faktury jsou filtrovány podle IČ z URL. Pro použití formuláře přejděte na <Link to="/invoices">obecný seznam faktur</Link>.
            </div>
        );
    }

    return (
        <div className="mb-4">
            {error && <div className="alert alert-danger">{error}</div>}
            <button
                className="btn btn-secondary d-flex align-items-center mb-3"
                type="button"
                onClick={onToggleFilter} // Použití prop onToggleFilter
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-funnel-fill me-2" viewBox="0 0 16 16">
                    <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.654V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.654L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z" />
                </svg>
                {!isFilterOpen ? "Zobrazit filtr" : "Skrýt filtr"}
            </button>
            <div className={`collapse ${isFilterOpen ? 'show' : ''}`}>
                <form onSubmit={handleSubmit} className="p-3 border rounded shadow-sm bg-light">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label htmlFor="buyerId" className="form-label">Odběratel:</label>
                            <select id="buyerId" name="buyerId" value={filterParams.buyerId} onChange={handleFilterChange} className="form-select">
                                <option value="">Vyberte odběratele</option>
                                {personsLookup.map(person => (
                                    <option key={person.id} value={String(person.id)}>
                                        {person.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="sellerId" className="form-label">Dodavatel:</label>
                            <select id="sellerId" name="sellerId" value={filterParams.sellerId} onChange={handleFilterChange} className="form-select">
                                <option value="">Vyberte dodavatele</option>
                                {personsLookup.map(person => (
                                    <option key={person.id} value={String(person.id)}>
                                        {person.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="product" className="form-label">Produkt:</label>
                            <input type="text" id="product" name="product" value={filterParams.product} onChange={handleFilterChange} className="form-control" />
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="minPrice" className="form-label">Min. cena:</label>
                            <input type="number" id="minPrice" name="minPrice" value={filterParams.minPrice} onChange={handleFilterChange} className="form-control" />
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="maxPrice" className="form-label">Max. cena:</label>
                            <input type="number" id="maxPrice" name="maxPrice" value={filterParams.maxPrice} onChange={handleFilterChange} className="form-control" />
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="limit" className="form-label">Limit:</label>
                            <input type="number" id="limit" name="limit" value={filterParams.limit} onChange={handleFilterChange} className="form-control" />
                        </div>
                        <div className="col-md-3 d-flex align-items-end">
                            <button type="submit" className="btn btn-secondary w-100">Filtrovat</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InvoiceFilter;
