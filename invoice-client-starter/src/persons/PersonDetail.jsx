import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { apiGet, apiDelete } from "../utils/api";
import ConfirmationModal from "../components/ConfirmationModal"; // Import the new component

/**
 * Enum for country codes.
 * @readonly
 * @enum {string}
 */
const Country = {
    CZECHIA: "CZ",
    SLOVAKIA: "SK",
};

/**
 * A React component that displays the detailed information of a single person.
 * It fetches the person's data based on the ID in the URL and provides options to edit or delete the person.
 * It also includes links to view invoices related to the person.
 * @returns {JSX.Element} The rendered PersonDetail component.
 */
const PersonDetail = () => {
    // Get person ID from URL parameters and navigation hook for redirection.
    const { id } = useParams();
    const navigate = useNavigate();

    // States for storing person data, loading status, errors, and confirmation dialog visibility.
    const [person, setPerson] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    /**
     * Effect hook for fetching person details from the API.
     * It runs on component mount and whenever the `id` in the URL changes.
     */
    useEffect(() => {
        if (id) {
            setLoading(true);
            apiGet("/api/persons/" + id)
                .then(data => {
                    setPerson(data);
                    setError(null);
                })
                .catch(err => {
                    console.error("Error fetching person detail: " + err.message);
                    setError("Nepodařilo se načíst detaily osoby.");
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [id]);

    /**
     * Memoized function to get the full country name based on the country code.
     * This value is re-calculated only when `person.country` changes.
     * @returns {string} The full country name or "N/A" if not available.
     */
    const countryName = useMemo(() => {
        if (!person.country) {
            return "N/A";
        }
        return Country.CZECHIA === person.country ? "Česká republika" : "Slovensko";
    }, [person.country]);

    /**
     * Handles the deletion of a person.
     * It sends a DELETE request to the API and then redirects the user to the persons list
     * with a success or error flash message.
     */
    const handleDelete = () => {
        apiDelete("/api/persons/" + id)
            .then(() => {
                navigate("/persons", { state: { flashMessage: { theme: "success", text: "Osoba byla úspěšně smazána." } } });
            })
            .catch(err => {
                console.error("Chyba při mazání osoby: " + err.message);
                navigate("/persons", { state: { flashMessage: { theme: "danger", text: "Chyba při mazání osoby." } } });
            });
        setShowDeleteModal(false);
    };

    /**
     * Handles opening the deletion confirmation modal.
     */
    const handleOpenModal = () => setShowDeleteModal(true);

    /**
     * Handles closing the deletion confirmation modal.
     */
    const handleCloseModal = () => setShowDeleteModal(false);

    // Render loading state while fetching data.
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Načítání...</span>
                </div>
            </div>
        );
    }

    // Render error message if data fetching fails.
    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                {error}
            </div>
        );
    }

    // Render the person detail card.
    return (
        <div className="container mt-4">
            <div className="card shadow-sm mt-4">
                <div className="card-header bg-white">
                    <h1 className="h4 container-title mb-0">Detail osoby</h1>
                </div>
                <div className="card-body bg-white">
                    <h3 className="card-title mb-3">{person.name}</h3>
                    <hr />

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <h6 className="text-muted">Identifikační údaje</h6>
                            <p><strong>IČO:</strong> {person.identificationNumber}</p>
                            <p><strong>DIČ:</strong> {person.taxNumber}</p>
                            <p><strong>Bankovní účet:</strong> {person.accountNumber}/{person.bankCode} ({person.iban})</p>
                        </div>
                        <div className="col-md-6 mb-3">
                            <h6 className="text-muted">Kontaktní údaje</h6>
                            <p><strong>Tel.:</strong> {person.telephone}</p>
                            <p><strong>Mail:</strong> {person.mail}</p>
                        </div>
                    </div>

                    <hr />

                    <h6 className="text-muted">Adresa</h6>
                    <p>
                        {person.street}, {person.city}, {person.zip}, {countryName}
                    </p>

                    {person.note && (
                        <>
                            <hr />
                            <h6 className="text-muted">Poznámka</h6>
                            <p>{person.note}</p>
                        </>
                    )}
                </div>

                {person.id && (
                    <div className="card-footer bg-white border-0">
                        {/* Buttons for viewing invoices related to the person. */}
                        <div className="btn-group d-flex border w-100 mb-3">
                            <Link
                                to={`/invoices/by-seller/${person.identificationNumber}`}
                                className="btn btn-secondary w-50 me-2"
                            >
                                Vystavené faktury
                            </Link>
                            <Link
                                to={`/invoices/by-buyer/${person.identificationNumber}`}
                                className="btn btn-light w-50"
                            >
                                Přijaté faktury
                            </Link>
                        </div>

                        {/* Action buttons for editing and deleting the person. */}
                        <div className="d-flex justify-content-between">
                            <div>
                                <Link to="/persons" className="btn btn-secondary me-2">Zpět</Link>
                                <Link to={`/persons/edit/${person.id}`} className="btn btn-warning">Upravit</Link>
                            </div>
                            <button onClick={handleOpenModal} className="btn btn-danger">Smazat</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Deletion confirmation modal. */}
            <ConfirmationModal
                show={showDeleteModal}
                title="Potvrzení smazání"
                message={<span>Opravdu chcete smazat osobu <strong>{person.name}</strong>?</span>}
                warning="Tato akce je nevratná! Smažete i vazby na faktury."
                onClose={handleCloseModal}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default PersonDetail;
