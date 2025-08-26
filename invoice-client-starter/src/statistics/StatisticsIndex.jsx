import React, {useEffect, useState} from "react";
import { apiGet } from "../utils/api";
import Pagination from "../components/Pagination";
import { formatPrice } from "../utils/currencyNumberFormatter";

/**
 * A React component for displaying various statistics.
 * It fetches general invoice statistics and paginated person-specific statistics.
 */
const StatisticsIndex = () => {
    // States for storing data and loading status
    const [invoiceStats, setInvoiceStats] = useState(null);
    const [personStatsPage, setPersonStatsPage] = useState(null);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Effect hook to fetch statistics from the API.
     * It fetches general statistics once and paginated person statistics
     * whenever the page number changes.
     */
    useEffect(() => {
        const fetchStatistics = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch general invoice statistics (not paginated)
                const fetchedInvoiceStats = await apiGet("/api/invoices/statistics");
                setInvoiceStats(fetchedInvoiceStats);

                // Fetch paginated person statistics
                const fetchedPersonStatsPage = await apiGet(`/api/persons/statistics?page=${page}&size=10`);
                setPersonStatsPage(fetchedPersonStatsPage);
            } catch (err) {
                setError("Chyba při načítání statistik: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
        document.title = "Statistiky";

    }, [page]); // The effect runs whenever the 'page' state changes

    /**
     * Handles page change and updates the 'page' state.
     */
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Načítání...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-danger mt-5">{error}</div>;
    }

    const personStats = personStatsPage?.content || [];
    const totalPages = personStatsPage?.totalPages || 0;

    return (
        <div className="container mt-4">
            {/* Section for general invoice statistics */}
            {invoiceStats && (
                <div className="card shadow-sm mb-4">
                    <div className="card-header bg-white">
                        <h4 className="card-title mb-0">Statistiky všech faktur</h4>
                    </div>
                    <div className="card-body">
                        <hr className="mt-0" />
                        <p><strong>Celkový součet cen bez DPH:</strong> {formatPrice(invoiceStats.allTimeSum)} Kč</p>
                        <p><strong>Součet cen za aktuální rok bez DPH:</strong> {formatPrice(invoiceStats.currentYearSum)} Kč</p>
                        <p><strong>Celkový počet faktur:</strong> {invoiceStats.invoicesSum}</p>
                    </div>
                </div>
            )}

            {/* Section for statistics of individual persons/companies */}
            {personStats.length > 0 && (
                <div className="card shadow-sm">
                    <div className="card-header bg-white">
                        <h4 className="card-title mb-0">Statistiky jednotlivých osob</h4>
                    </div>
                    <div className="card-body">
                        <hr className="mt-0" />
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped">
                                <thead className="thead-light">
                                    <tr>
                                        <th style={{ width: "10%" }}>ID osoby</th>
                                        <th>Jméno osoby</th>
                                        <th>Obrat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {personStats.map(person => (
                                        <tr key={person.personId}>
                                            <td>{person.personId}</td>
                                            <td>{person.personName}</td>
                                            <td>{formatPrice(person.revenue)} Kč</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="d-flex justify-content-center mt-3">
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </div>
                </div>
            )}

            {personStats.length === 0 && !loading && !error && (
                <div className="alert alert-info mt-3">Žádné statistiky pro osoby k zobrazení.</div>
            )}
        </div>
    );
};

export default StatisticsIndex;
