import React, {useEffect, useState} from "react";
import {apiDelete, apiGet} from "../utils/api";
import PersonTable from "./PersonTable";
import Pagination from "../components/Pagination";
import { Link, useLocation } from "react-router-dom";
import FlashMessage from "../components/FlashMessage";

/**
 * A React component that displays a list of persons with pagination.
 * It now fetches a lightweight PersonLookup object from the API to optimize performance.
 */
const PersonIndex = () => {
    const [persons, setPersons] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const location = useLocation();
    const [flashMessage, setFlashMessage] = useState(location.state?.flashMessage || null);

    /**
     * Clears the flash message from the navigation state.
     * This prevents it from being displayed again after a page refresh.
     */
    const clearFlashMessage = () => {
        if (location.state?.flashMessage) {
            window.history.replaceState({}, document.title, location.pathname);
        }
    };

    /**
     * Deletes a person and shows a flash message.
     * @param {string} id The ID of the person to delete.
     */
    const deletePerson = async (id) => {
        try {
            await apiDelete("/api/persons/" + id);
            setPersons(persons.filter((item) => item.id !== id));
            setTotalElements(totalElements - 1);
            setFlashMessage({
                theme: "success",
                text: "Osoba byla úspěšně smazána."
            });
        } catch (error) {
            setFlashMessage({
                theme: "danger",
                text: "Chyba při mazání osoby: " + error.message
            });
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    /**
     * Fetches the list of persons using the optimized PersonLookup endpoint.
     */
    useEffect(() => {
        const fetchPersons = async () => {
            setLoading(true);
            setError(null);
            try {
                // The API now returns a Page<PersonLookup>, which is handled automatically.
                const response = await apiGet(`/api/persons?page=${page}`);
                setPersons(response.content);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
            } catch (err) {
                setError("Chyba při načítání osob: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPersons();
        document.title = "Seznam osob";
    }, [page]);

    useEffect(() => {
        if (flashMessage) {
            clearFlashMessage();
        }
    }, [flashMessage]);

    return (
        <div className="card shadow-sm mt-4">
            <div className="card-header bg-white">
                <h1 className="h4 card-title mb-0">Seznam osob</h1>
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
                        <Link to={"/persons/create"} className="btn btn-success mb-3">
                            Vytvořit osobu
                        </Link>
                        {persons.length > 0 ? (
                            <>
                                <p className="text-muted small mb-2">Počet osob: {totalElements}</p>
                                <PersonTable
                                    deletePerson={deletePerson}
                                    items={persons}
                                    page={page}
                                />
                                <Link to={"/persons/create"} className="btn btn-success mb-3">
                                    Vytvořit osobu
                                </Link>
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </>
                        ) : (
                            <div className="alert alert-info">Žádné osoby k zobrazení.</div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default PersonIndex;
