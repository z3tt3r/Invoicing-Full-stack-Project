import React, { useState } from "react";
import { Link } from "react-router-dom";
import dateStringFormatter from '../utils/dateStringFormatter';
import { formatPrice } from '../utils/currencyNumberFormatter';
import ConfirmationModal from '../components/ConfirmationModal';

/**
 * A table component for displaying a list of invoices.
 * It provides links to view, edit, and delete each invoice.
 *
 * @param {object} props - The component's properties.
 * @param {string} props.label - The label for the table.
 * @param {Array<object>} props.items - The list of invoice objects to display.
 * @param {function} props.deleteInvoice - The callback function to delete an invoice.
 * @param {number} props.page - The current page number for calculating table index.
 */
const InvoiceTable = ({ label, items, deleteInvoice, page }) => {
    const startIndex = page * 20;

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [invoiceToDelete, setInvoiceToDelete] = useState(null);

    /**
     * Opens the confirmation modal for deleting an invoice.
     * @param {string} invoiceId The ID of the invoice to be deleted.
     */
    const handleOpenModal = (invoiceId) => {
        setInvoiceToDelete(invoiceId);
        setShowDeleteModal(true);
    };

    /**
     * Closes the confirmation modal.
     */
    const handleCloseModal = () => {
        setShowDeleteModal(false);
        setInvoiceToDelete(null);
    };

    /**
     * Confirms the deletion and triggers the deleteInvoice callback.
     */
    const handleConfirmDelete = () => {
        if (invoiceToDelete) {
            deleteInvoice(invoiceToDelete);
            handleCloseModal();
        }
    };

    const invoiceNumberToDelete = invoiceToDelete
        ? (items.find(item => item.id === invoiceToDelete)?.invoiceNumber || "tuto fakturu")
        : "";

    return (
        <div>
            <p>
                {label}
            </p>

            {items.length > 0 ? (
                <div className="table-responsive">
                    <table className="table table-bordered table-striped table-hover">
                        <thead>
                            <tr>
                                <th className="text-center col-index">#</th>
                                <th className="text-start col-invoice-number">Číslo faktury</th>
                                <th className="text-start d-none d-lg-table-cell col-product">Produkt</th>
                                <th className="text-start d-none d-md-table-cell col-price">Cena bez DPH</th>
                                <th className="text-start d-none d-sm-table-cell col-issued">Vystaveno</th>
                                <th className="text-start col-buyer-name">Odběratel</th>
                                <th className="text-start col-seller-name">Dodavatel</th>
                                <th className="text-center col-action">Akce</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="text-center align-middle col-index">{startIndex + index + 1}</td>
                                    <td className="text-start align-middle">{item.invoiceNumber}</td>
                                    <td className="text-start align-middle d-none d-lg-table-cell">{item.product}</td>
                                    <td className="text-start align-middle d-none d-md-table-cell">{formatPrice(item.price || 0)} Kč</td>
                                    <td className="text-start align-middle d-none d-sm-table-cell">
                                        {item.issued ? dateStringFormatter(item.issued, true) : "Neznámé datum"}
                                    </td>
                                    <td className="text-start align-middle">{item.buyerName || "Neznámý"}</td>
                                    <td className="text-start align-middle">{item.sellerName || "Neznámý"}</td>
                                    <td className="text-center align-middle">
                                        <div className="btn-group border">
                                            <Link to={"/invoices/show/" + item.id} className="btn btn-sm btn-secondary">Zobrazit</Link>
                                            <Link to={"/invoices/edit/" + item.id} className="btn btn-sm btn-light">Upravit</Link>
                                            <button onClick={() => handleOpenModal(item.id)} className="btn btn-sm btn-danger">Odstranit</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="alert alert-info">Žádné faktury k zobrazení.</div>
            )}

            <ConfirmationModal
                show={showDeleteModal}
                title="Potvrzení smazání faktury"
                message={<span>Opravdu si přejete smazat fakturu č. <strong>{invoiceNumberToDelete}</strong>? Tato akce je nevratná.</span>}
                warning="Po smazání nebudete moci fakturu obnovit."
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};

export default InvoiceTable;
