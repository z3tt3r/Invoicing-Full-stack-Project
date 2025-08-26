import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../style/PersonTable.css";
import ConfirmationModal from '../components/ConfirmationModal';

/**
 * A table component for displaying a list of persons.
 * It provides links to view, edit, and delete each person.
 *
 * @param {object} props - The component's properties.
 * @param {Array<object>} props.items - The list of person objects to display.
 * @param {function} props.deletePerson - The callback function to delete a person.
 * @param {number} props.page - The current page number for calculating table index.
 */
const PersonTable = ({ items, deletePerson, page }) => {
    const startIndex = page * 20;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [personToDelete, setPersonToDelete] = useState(null);

    /**
     * Opens the confirmation modal for deleting a person.
     * @param {string} personId The ID of the person to be deleted.
     */
    const handleOpenModal = (personId) => {
        setPersonToDelete(personId);
        setShowDeleteModal(true);
    };

    /**
     * Closes the confirmation modal.
     */
    const handleCloseModal = () => {
        setShowDeleteModal(false);
        setPersonToDelete(null);
    };

    /**
     * Confirms the deletion and triggers the deletePerson callback.
     */
    const handleConfirmDelete = () => {
        if (personToDelete) {
            deletePerson(personToDelete);
            handleCloseModal();
        }
    };
    
    const personName = personToDelete ? (items.find(p => p.id === personToDelete)?.name || "tuto osobu") : "";

    return (
        <div>
            {items.length > 0 ? (
                <div className="table-responsive">
                    <table className="table table-bordered table-striped table-hover">
                        <thead>
                            <tr>
                                <th className="text-center col-index">#</th>
                                <th className="col-name">Jméno</th>
                                <th className="text-center col-invoices">Faktury</th>
                                <th className="text-center col-action">Akce</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={item.id || index}>
                                    <td className="text-center align-middle col-index">{startIndex + index + 1}</td>
                                    <td className="align-middle">{item.name}</td>
                                    <td className="text-center align-middle">
                                        {item.identificationNumber && (
                                            <div className="btn-group d-flex w-auto border invoice-buttons">
                                                <Link
                                                    to={`/invoices/by-seller/${item.identificationNumber}`}
                                                    className="btn btn-sm btn-secondary w-50"
                                                    title="Zobrazit vystavené faktury"
                                                >
                                                    Vystavené
                                                </Link>
                                                <Link
                                                    to={`/invoices/by-buyer/${item.identificationNumber}`}
                                                    className="btn btn-sm btn-light w-50"
                                                    title="Zobrazit přijaté faktury"
                                                >
                                                    Přijaté
                                                </Link>
                                            </div>
                                        )}
                                    </td>
                                    <td className="text-center align-middle">
                                        <div className="btn-group border">
                                            <Link
                                                to={"/persons/show/" + item.id}
                                                className="btn btn-sm btn-secondary"
                                            >
                                                Zobrazit
                                            </Link>
                                            <Link
                                                to={"/persons/edit/" + item.id}
                                                className="btn btn-sm btn-light"
                                            >
                                                Upravit
                                            </Link>
                                            <button
                                                onClick={() => handleOpenModal(item.id)}
                                                className="btn btn-sm btn-danger"
                                            >
                                                Odstranit
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="alert alert-info">Žádné osoby k zobrazení.</div>
            )}
            
            <ConfirmationModal
                show={showDeleteModal}
                title="Potvrzení smazání osoby"
                message={<span>Opravdu si přejete smazat {personName}?</span>}
                warning="Tato akce je nevratná! Smažete i vazby na faktury."
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};

export default PersonTable;
