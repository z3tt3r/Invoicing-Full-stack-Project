import React, { useEffect, useState } from "react";
import { apiDelete, apiGet } from "../utils/api";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import InvoiceTable from "./InvoiceTable";
import Pagination from "../components/Pagination";
import FlashMessage from "../components/FlashMessage";
import InvoiceFilter from "./InvoiceFilter";

/**
 * A component for displaying a list of invoices with filtering and pagination.
 * It fetches data from the API, handles invoice deletion, and manages component state.
 */
const InvoiceIndex = () => {
    const [invoices, setInvoices] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterParams, setFilterParams] = useState({
        buyerId: '',
        sellerId: '',
        product: '',
        minPrice: '',
        maxPrice: '',
        limit: ''
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { identificationNumber } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [flashMessage, setFlashMessage] = useState(null);

    // Effect to display and hide flash messages from navigation state.
    useEffect(() => {
        if (location.state && location.state.flashMessage) {
            setFlashMessage(location.state.flashMessage);
            navigate(location.pathname, { replace: true, state: {} });
            
            const timer = setTimeout(() => {
                setFlashMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [location.state, navigate, location.pathname]);

    /**
     * Deletes an invoice by its ID and refreshes the invoice list.
     * @param {string} id The ID of the invoice to delete.
     */
    const deleteInvoice = async (id) => {
        try {
            await apiDelete("/api/invoices/" + id);
            await fetchInvoices();
            setFlashMessage({
                theme: "success",
                text: "Faktura byla úspěšně smazána."
            });
            const timer = setTimeout(() => {
                setFlashMessage(null);
            }, 5000);
        } catch (error) {
            setFlashMessage({
                theme: "danger",
                text: "Chyba při mazání faktury: " + error.message
            });
            const timer = setTimeout(() => {
                setFlashMessage(null);
            }, 5000);
        }
    };

    /**
     * Processes invoice data received from the API for display in the component.
     * This function now simply returns the object as received, as the backend
     * already provides a simplified summary. Price remains a number for later formatting.
     * @param {object} invoiceData The raw invoice summary data object from the API.
     * @returns {object} The processed invoice object.
     */
    const processInvoiceData = (invoiceData) => {
        return {
            id: invoiceData.id,
            invoiceNumber: invoiceData.invoiceNumber,
            product: invoiceData.product,
            price: invoiceData.price, 
            issued: invoiceData.issued,
            buyerName: invoiceData.buyerName || 'Neznámý',
            sellerName: invoiceData.sellerName || 'Neznámý',
            buyerIdentificationNumber: invoiceData.buyerIdentificationNumber,
            sellerIdentificationNumber: invoiceData.sellerIdentificationNumber
        };
    };

    /**
     * Fetches the person's name based on their identification number.
     * @param {string} ic The identification number.
     * @returns {string} The person's name or a default string if not found.
     */
    const getPersonNameByIdentificationNumber = async (ic) => {
        try {
            const persons = await apiGet(`/api/persons?identificationNumber=${ic}`);
            return persons.content && persons.content.length > 0 ? persons.content[0].name : "Neznámá osoba";
        } catch (err) {
            return "Neznámá osoba";
        }
    };

    /**
     * Fetches invoices based on current page and filter parameters.
     */
    const fetchInvoices = async () => {
        setLoading(true);
        setError(null);
        try {
            let response;
            if (identificationNumber) {
                const personName = await getPersonNameByIdentificationNumber(identificationNumber);
                document.title = `Faktury: ${personName || "Neznámá osoba"}`;
                
                const endpoint = location.pathname.includes("/by-seller/")
                    ? `/api/invoices/identification/${identificationNumber}/sales?page=${page}`
                    : `/api/invoices/identification/${identificationNumber}/purchases?page=${page}`;

                response = await apiGet(endpoint);
                setInvoices(response.content.map(processInvoiceData));
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
            } else {
                document.title = "Seznam faktur";
                const filteredQueryString = Object.keys(filterParams)
                    .filter(key => filterParams[key] !== '' && filterParams[key] !== null && filterParams[key] !== undefined)
                    .map(key => `${key}=${filterParams[key]}`)
                    .join('&');

                const endpoint = `/api/invoices/summary?page=${page}${filteredQueryString ? '&' + filteredQueryString : ''}`;
                
                response = await apiGet(endpoint);
                setInvoices(response.content.map(processInvoiceData));
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
            }
        } catch (err) {
            setError("Chyba při načítání faktur: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handles filter submission from the child component.
     * @param {object} newFilterParams New filter parameters.
     */
    const handleFilterSubmit = (newFilterParams) => {
        setFilterParams(newFilterParams);
        setPage(0);
    };

    /**
     * Toggles the filter form visibility.
     */
    const handleToggleFilter = () => {
        setIsFilterOpen(prev => !prev);
    };

    /**
     * Handles page change for pagination.
     * @param {number} newPage The new page number.
     */
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    // Fetches invoices whenever the page, filter parameters, or URL changes.
    useEffect(() => {
        fetchInvoices();
    }, [page, filterParams, identificationNumber, location.pathname]);
    
    const isIcFilterActive = !!identificationNumber;

    return (
        <div className="card shadow-sm mt-4">
            <div className="card-header bg-white">
                <h1 className="h4 card-title mb-0">{isIcFilterActive ? "Filtrované faktury" : "Seznam faktur"}</h1>
            </div>
            <div className="card-body">
                {flashMessage && (
                    <FlashMessage theme={flashMessage.theme} text={flashMessage.text} />
                )}

                {loading ? (
                    <div className="d-flex justify-content-center my-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Načítání...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger">{error}</div>
                ) : (
                    <>
                        <InvoiceFilter
                            initialFilterParams={filterParams}
                            onFilterSubmit={handleFilterSubmit}
                            isIcFilterActive={isIcFilterActive}
                            isFilterOpen={isFilterOpen}
                            onToggleFilter={handleToggleFilter}
                        />

                        <Link to="/invoices/create" className="btn btn-success mb-3">Vytvořit fakturu</Link>

                        {invoices.length > 0 ? (
                            <>
                                <p className="text-muted small mb-2">Počet faktur: {totalElements}</p>
                                <InvoiceTable
                                    deleteInvoice={deleteInvoice}
                                    items={invoices}
                                    page={page}
                                />
                                <Link to="/invoices/create" className="btn btn-success mb-3">
                                    Vytvořit fakturu
                                </Link>
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </>
                        ) : (
                            <div className="alert alert-info">Žádné faktury k zobrazení s aktuálními filtry.</div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default InvoiceIndex;
