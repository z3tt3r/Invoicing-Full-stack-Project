import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost, apiPut } from "../utils/api";
import InputField from "../components/InputField";
import InputSelect from "../components/InputSelect";
import FlashMessage from "../components/FlashMessage";

/**
 * A React component for creating or editing an invoice.
 * It fetches lookup data for persons (buyers/sellers) and handles form submission.
 */
const InvoiceForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [invoice, setInvoice] = useState({
        invoiceNumber: "",
        issued: "",
        dueDate: "",
        product: "",
        price: "",
        vat: "",
        note: "",
        buyer: { id: null },
        seller: { id: null },
    });
    const [personsLookup, setPersonsLookup] = useState([]);
    const [loading, setLoading] = useState(true);
    // State to hold an array of flash messages to be displayed above the form.
    const [flashMessages, setFlashMessages] = useState([]);

    const isEdit = !!id;

    /**
     * Effect for loading initial form data.
     * It fetches the list of persons for the dropdowns and, if in edit mode, the data for a specific invoice.
     * It also handles scenarios where a person from an existing invoice is no longer in the lookup list.
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all active persons for the dropdown lookup list.
                const personsData = await apiGet("/api/persons/lookup");
                let newPersonsLookup = [...personsData];
                // Create an array for all potential messages.
                let newFlashMessages = [];

                if (isEdit) {
                    // Edit mode: Fetch the data of the existing invoice.
                    const invoiceData = await apiGet("/api/invoices/" + id);

                    /**
                     * Helper function to format a date array [year, month, day] into a "YYYY-MM-DD" string.
                     * This is necessary for proper display in an HTML "date" input.
                     * @param {number[]} dateArray The date array in [year, month, day] format.
                     * @returns {string} The formatted date string or an empty string.
                     */
                    const formatIsoDate = (dateArray) => {
                        if (!dateArray || dateArray.length !== 3) return "";
                        const [year, month, day] = dateArray;
                        const formattedMonth = String(month).padStart(2, '0');
                        const formattedDay = String(day).padStart(2, '0');
                        return `${year}-${formattedMonth}-${formattedDay}`;
                    };

                    let loadedBuyer = invoiceData.buyer || { id: null };
                    let loadedSeller = invoiceData.seller || { id: null };

                    /**
                     * Checks if a person from the loaded invoice exists in the current lookup list.
                     * If not, it adds a temporary entry to the list and displays a warning message.
                     * This prevents the form from breaking if a person has been deleted.
                     * @param {object} person The person object from the invoice data.
                     * @param {string} type The role of the person ("buyer" or "seller").
                     * @returns {object} The original or modified person object with a valid ID.
                     */
                    const handleMissingPerson = (person, type) => {
                        if (!person.id) {
                            return person;
                        }

                        const existingPerson = personsData.find(p => p.id === person.id);
                        if (existingPerson) {
                            return person; // The person exists, no action needed.
                        }

                        // Try to find the person by their identification number (IC), in case the ID changed.
                        const personByIC = personsData.find(p => p.identificationNumber === person.identificationNumber);
                        if (personByIC) {
                            newFlashMessages.push({
                                theme: "warning",
                                text: `Původní ${type === "buyer" ? "odběratel" : "dodavatel"} s IČ ${person.identificationNumber} byl nalezen s novým ID. Hodnota ve formuláři byla automaticky aktualizována.`
                            });
                            return { id: personByIC.id };
                        }

                        // The person is completely missing, add a temporary entry to the lookup list.
                        const missingPerson = { ...person, name: person.name + " (chybí)" };
                        newPersonsLookup.push(missingPerson);
                        newFlashMessages.push({
                            theme: "danger",
                            text: `Původní ${type === "buyer" ? "odběratel" : "dodavatel"} s IČ ${person.identificationNumber} nebyl nalezen. Jeho jméno je zobrazeno, ale musíte ho změnit, abyste formulář uložili.`
                        });
                        return { id: person.id };
                    };

                    // Process both the buyer and the seller.
                    const newBuyer = handleMissingPerson(loadedBuyer, "buyer");
                    const newSeller = handleMissingPerson(loadedSeller, "seller");

                    setPersonsLookup(newPersonsLookup);
                    if (newFlashMessages.length > 0) {
                        setFlashMessages(newFlashMessages);
                    }

                    const newInvoiceState = {
                        ...invoiceData,
                        issued: formatIsoDate(invoiceData.issued),
                        dueDate: formatIsoDate(invoiceData.dueDate),
                        buyer: newBuyer,
                        seller: newSeller,
                    };

                    setInvoice(newInvoiceState);
                } else {
                    // Create mode: Just set the persons lookup list.
                    setPersonsLookup(personsData);
                }
            } catch (error) {
                // Redirect to the invoice list with an error message if data fetching fails.
                navigate("/invoices", {
                    state: {
                        flashMessage: {
                            theme: "danger",
                            text: "Chyba při načítání dat: " + error.message
                        }
                    }
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isEdit, navigate]);

    /**
     * Handles the form submission. It sends the invoice data to the API endpoint.
     * @param {Event} e The form submission event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Front-end validation to prevent sending a request without a selected buyer or seller.
        if (!invoice.buyer.id || !invoice.seller.id) {
            setFlashMessages([{
                theme: "danger",
                text: "Musíte vybrat odběratele i dodavatele."
            }]);
            return;
        }

        // Prepare data for sending (e.g., convert IDs to numbers).
        const invoiceToSend = {
            ...invoice,
            buyer: { id: invoice.buyer.id },
            seller: { id: invoice.seller.id },
            price: Number(invoice.price),
            vat: Number(invoice.vat)
        };

        try {
            // Determine whether to use a POST (create) or PUT (update) request.
            await (isEdit ? apiPut("/api/invoices/" + id, invoiceToSend) : apiPost("/api/invoices", invoiceToSend));

            // Redirect to the invoice list with a success message.
            navigate("/invoices", {
                state: {
                    flashMessage: {
                        theme: "success",
                        text: `Faktura byla úspěšně ${isEdit ? "aktualizována" : "vytvořena"}.`
                    }
                }
            });
        } catch (error) {
            // On error, display a flash message.
            setFlashMessages([{
                theme: "danger",
                text: "Chyba při ukládání faktury: " + error.message
            }]);
        }
    };

    /**
     * Handles changes in form input fields and updates the component's state.
     * @param {Event} e The input change event.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "seller" || name === "buyer") {
            // Special handling for select boxes, where we only set the person's ID.
            setInvoice(prevInvoice => ({
                ...prevInvoice,
                [name]: { id: value ? Number(value) : null }
            }));
        } else {
            // General handling for standard input fields.
            setInvoice(prevInvoice => ({
                ...prevInvoice,
                [name]: value
            }));
        }
    };

    if (loading) {
        return <div className="text-center mt-5">Načítání formuláře...</div>;
    }

    return (
        <div className="container mt-4">
            <div className="card shadow-sm">
                <div className="card-header bg-white">
                    <h1 className="h4 card-title mb-0">{isEdit ? "Upravit" : "Vytvořit"} fakturu</h1>
                </div>
                <div className="card-body bg-white">
                    {/* Map the array of flash messages and display each one. */}
                    {flashMessages.length > 0 && (
                        <div>
                            {flashMessages.map((msg, index) => (
                                <FlashMessage key={index} theme={msg.theme} text={msg.text} />
                            ))}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <InputField
                            required={true}
                            type="number"
                            name="invoiceNumber"
                            label="Číslo faktury"
                            prompt="Zadejte číslo faktury"
                            value={invoice.invoiceNumber || ""}
                            handleChange={handleChange}
                        />
                        <InputField
                            required={true}
                            type="date"
                            name="issued"
                            label="Datum vystavení"
                            prompt="Zadejte datum vystavení"
                            value={invoice.issued || ""}
                            handleChange={handleChange}
                        />
                        <InputField
                            required={true}
                            type="date"
                            name="dueDate"
                            label="Datum splatnosti"
                            prompt="Zadejte datum splatnosti"
                            value={invoice.dueDate || ""}
                            handleChange={handleChange}
                        />
                        <InputField
                            required={true}
                            type="text"
                            name="product"
                            label="Produkt"
                            prompt="Zadejte název produktu"
                            value={invoice.product || ""}
                            handleChange={handleChange}
                        />
                        <InputField
                            required={true}
                            type="number"
                            name="price"
                            label="Cena (bez DPH)"
                            prompt="Zadejte cenu"
                            value={invoice.price || ""}
                            handleChange={handleChange}
                        />
                        <InputField
                            required={true}
                            type="number"
                            name="vat"
                            label="DPH (%)"
                            prompt="Zadejte sazbu DPH"
                            value={invoice.vat || ""}
                            handleChange={handleChange}
                        />
                        <InputField
                            type="text"
                            name="note"
                            label="Poznámka"
                            prompt="Zde můžete přidat poznámku"
                            value={invoice.note || ""}
                            handleChange={handleChange}
                        />
                        <InputSelect
                            name="buyer"
                            label="Odběratel"
                            prompt="Vyberte odběratele"
                            items={personsLookup}
                            value={invoice.buyer.id ? String(invoice.buyer.id) : ""}
                            handleChange={handleChange}
                            required={true}
                        />
                        <InputSelect
                            name="seller"
                            label="Dodavatel"
                            prompt="Vyberte dodavatele"
                            items={personsLookup}
                            value={invoice.seller.id ? String(invoice.seller.id) : ""}
                            handleChange={handleChange}
                            required={true}
                        />

                        <div className="d-flex justify-content-end mt-4">
                            <input type="submit" className="btn btn-primary" value="Uložit" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InvoiceForm;
