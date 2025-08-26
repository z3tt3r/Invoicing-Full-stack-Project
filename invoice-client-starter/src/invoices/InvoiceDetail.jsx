import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { apiGet, apiDelete } from "../utils/api";
import dateStringFormatter from "../utils/dateStringFormatter";
import { formatPrice } from "../utils/currencyNumberFormatter";
import ConfirmationModal from "../components/ConfirmationModal";

/**
 * A React component that displays the detailed information of a single invoice.
 * It fetches the invoice data based on the ID in the URL and allows for editing or deleting it.
 */
const InvoiceDetail = () => {
    // Get invoice ID from URL parameters and the navigation hook for redirection.
    const { id } = useParams();
    const navigate = useNavigate();

    // States for storing invoice data, loading status, errors, and the confirmation dialog visibility.
    const [invoice, setInvoice] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State for modal visibility.

    /**
     * Fetches invoice details from the API based on the ID from the URL.
     * This effect runs once when the component mounts and whenever the `id` changes.
     */
    useEffect(() => {
        if (id) {
            setLoading(true);
            apiGet("/api/invoices/" + id)
                .then(data => {
                    setInvoice(data);
                    setError(null);
                })
                .catch(err => {
                    console.error("Error fetching invoice detail: " + err.message);
                    setError("Nepodařilo se načíst detaily faktury.");
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [id]);

    /**
     * Calculates the total price of the invoice, including VAT.
     * @returns {number|null} The total price or null if data is missing.
     */
    const calculateTotalPrice = () => {
        if (invoice.price && invoice.vat) {
            return Number(invoice.price) * (1 + Number(invoice.vat) / 100);
        }
        return null;
    };

    /**
     * Handles the invoice deletion process.
     * It sends a DELETE request to the API and then redirects to the invoice list with a flash message.
     */
    const handleDelete = () => {
        apiDelete("/api/invoices/" + id)
            .then(() => {
                // Navigate to the invoice list with a success flash message.
                navigate("/invoices", { state: { flashMessage: { theme: "success", text: "Faktura byla úspěšně smazána." } } });
            })
            .catch(err => {
                console.error("Error deleting invoice: " + err.message);
                // Navigate to the invoice list with an error flash message.
                navigate("/invoices", { state: { flashMessage: { theme: "danger", text: "Chyba při mazání faktury." } } });
            });
        // Close the modal regardless of the API call's outcome.
        setShowDeleteModal(false);
    };
    
    /**
     * Opens the confirmation modal for deletion.
     */
    const handleOpenModal = () => {
        setShowDeleteModal(true);
    };

    /**
     * Closes the confirmation modal.
     */
    const handleCloseModal = () => {
        setShowDeleteModal(false);
    };

    // Conditional rendering for the loading state.
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Načítání...</span>
                </div>
            </div>
        );
    }

    // Conditional rendering for the error state.
    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                {error}
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="card shadow-sm mt-4">
                <div className="card-header bg-white">
                    <h1 className="h4 card-title mb-0">Detail faktury</h1>
                </div>
                <div className="card-body bg-white">
                    <h3 className="card-title mb-3">Faktura č. {invoice.invoiceNumber}</h3>
                    <hr />

                    {/* Section for contracting parties */}
                    <div className="mb-4">
                        <h6 className="text-muted">Smluvní strany</h6>
                        <p>
                            <strong>Dodavatel:</strong>
                            <br />
                            {invoice.seller ? `${invoice.seller.name} (${invoice.seller.identificationNumber})` : "N/A"}
                        </p>
                        <p>
                            <strong>Odběratel:</strong>
                            <br />
                            {invoice.buyer ? `${invoice.buyer.name} (${invoice.buyer.identificationNumber})` : "N/A"}
                        </p>
                    </div>

                    <hr />

                    {/* Section for pricing details */}
                    <div className="mb-4">
                        <h6 className="text-muted">Cenové údaje</h6>
                        <p>
                            <strong>Cena bez DPH:</strong>
                            <br />
                            {invoice.price ? formatPrice(invoice.price) : 'Cena neznámá'} Kč
                        </p>
                        <p>
                            <strong>DPH:</strong>
                            <br />
                            {invoice.vat} %
                        </p>
                        <p>
                            <strong>Celková cena (včetně DPH):</strong>
                            <br />
                            {calculateTotalPrice() ? formatPrice(calculateTotalPrice()) : "N/A"} Kč
                        </p>
                    </div>

                    <hr />

                    {/* Section for dates */}
                    <div className="mb-4">
                        <h6 className="text-muted">Data</h6>
                        <p>
                            <strong>Datum vystavení:</strong>
                            <br />
                            {invoice.issued ? dateStringFormatter(invoice.issued, true) : "Neznámé datum"}
                        </p>
                        <p>
                            <strong>Datum splatnosti:</strong>
                            <br />
                            {invoice.dueDate ? dateStringFormatter(invoice.dueDate, true) : "Neznámé datum"}
                        </p>
                    </div>

                    <hr />
                    {/* Section for notes */}
                    <h6 className="text-muted">Poznámka</h6>
                    <p>{invoice.note || "Žádná poznámka"}</p>
                </div>

                <div className="card-footer bg-white border-0 d-flex justify-content-between">
                    <div>
                        <Link to="/invoices" className="btn btn-secondary me-2">Zpět</Link>
                        <Link to={`/invoices/edit/${invoice.id}`} className="btn btn-warning">Upravit</Link>
                    </div>
                    <div>
                        <button onClick={handleOpenModal} className="btn btn-danger">Smazat</button>
                    </div>
                </div>
            </div>

            {/* Confirmation modal for invoice deletion */}
            <ConfirmationModal
                show={showDeleteModal}
                title="Potvrzení smazání"
                message={<span>Opravdu chcete smazat fakturu č. <strong>{invoice.invoiceNumber}</strong>?</span>}
                warning="Tato akce je nevratná!"
                onClose={handleCloseModal}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default InvoiceDetail;
