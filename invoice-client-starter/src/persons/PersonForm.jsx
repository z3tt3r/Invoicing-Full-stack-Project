import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {apiGet, apiPost, apiPut} from "../utils/api";
import InputField from "../components/InputField";
import InputCheck from "../components/InputCheck";
import Country from "./Country";

/**
 * A React component for a form to create or edit a person.
 *
 * @returns {JSX.Element} The PersonForm component.
 */
const PersonForm = () => {
    const navigate = useNavigate();
    const {id} = useParams();

    /**
     * @typedef {object} Person
     * @property {string} name - The person's full name or company name.
     * @property {string} identificationNumber - The identification number (IČO).
     * @property {string} taxNumber - The tax number (DIČ).
     * @property {string} accountNumber - The bank account number.
     * @property {string} bankCode - The bank code.
     * @property {string} iban - The IBAN.
     * @property {string} telephone - The telephone number.
     * @property {string} mail - The email address.
     * @property {string} street - The street address.
     * @property {string} zip - The postal code.
     * @property {string} city - The city.
     * @property {string} country - The country, using constants from the Country module.
     * @property {string} note - An optional note.
     */

    /** @type {[Person, React.Dispatch<React.SetStateAction<Person>>]} */
    const [person, setPerson] = useState({
        name: "",
        identificationNumber: "",
        taxNumber: "",
        accountNumber: "",
        bankCode: "",
        iban: "",
        telephone: "",
        mail: "",
        street: "",
        zip: "",
        city: "",
        country: Country.CZECHIA,
        note: ""
    });

    const [validationError, setValidationError] = useState("");

    const isEdit = !!id;

    /**
     * Fetches person data from the API when in edit mode.
     * Runs once on component mount or when the ID changes.
     */
    useEffect(() => {
        if (isEdit) {
            apiGet("/api/persons/" + id)
                .then((data) => {
                    setPerson(data);
                })
                .catch((error) => {
                    // Redirects to the persons list with an error message
                    navigate("/persons", {
                        state: {
                            flashMessage: {
                                theme: "danger",
                                text: "Chyba při načítání dat osoby: " + error.message,
                            },
                        },
                    });
                });
        }
    }, [id, isEdit, navigate]);

    /**
     * Handles the form submission.
     * It validates the identification number (IČO) for new entries
     * and either creates a new person or updates an existing one.
     * @param {Event} e - The form submission event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError(""); // Clear previous validation errors

        try {
            // Validate if a person with the same IČO already exists (only for new entries)
            if (!isEdit) {
                const response = await apiGet(`/api/persons?identificationNumber=${person.identificationNumber}`);
                if (response.content.length > 0) {
                    setValidationError("Osoba s tímto IČO již existuje. Zadejte prosím unikátní IČO.");
                    return; // Stop form submission
                }
            }

            // Perform API call to create or update the person
            const apiCall = isEdit ? apiPut("/api/persons/" + id, person) : apiPost("/api/persons", person);
            await apiCall;

            // Redirect on successful save
            navigate("/persons", {
                state: {
                    flashMessage: {
                        theme: "success",
                        text: "Uložení osoby proběhlo úspěšně.",
                    },
                },
            });

        } catch (error) {
            // Handle saving errors by redirecting with an error message
            navigate("/persons", {
                state: {
                    flashMessage: {
                        theme: "danger",
                        text: "Chyba při ukládání: " + error.message,
                    },
                },
            });
        }
    };

    /**
     * Handles changes in form input fields.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from the input.
     */
    const handleChange = (e) => {
        const {name, value} = e.target;
        setPerson(prevPerson => ({
            ...prevPerson,
            [name]: value
        }));
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm mt-4">
                <div className="card-header bg-white">
                    <h1 className="h4 card-title mb-0">{isEdit ? "Upravit" : "Vytvořit"} osobu</h1>
                </div>
                <div className="card-body bg-white">
                    <form onSubmit={handleSubmit}>
                        <InputField
                            required={true} type="text" name="name" label="Jméno" prompt="Zadejte celé jméno"
                            value={person.name || ""}
                            handleChange={handleChange}
                        />
                        <InputField
                            required={true} type="text" name="identificationNumber" label="IČO" prompt="Zadejte IČO"
                            value={person.identificationNumber || ""}
                            handleChange={handleChange}
                            readOnly={isEdit}
                        />
                        <InputField
                            required={true} type="text" name="taxNumber" label="DIČ" prompt="Zadejte DIČ"
                            value={person.taxNumber || ""}
                            handleChange={handleChange}
                        />
                        <InputField
                            required={true} type="text" name="accountNumber" label="Číslo bankovního účtu" prompt="Zadejte číslo bankovního účtu"
                            value={person.accountNumber || ""}
                            handleChange={handleChange}
                        />
                        <InputField
                            required={true} type="text" name="bankCode" label="Kód banky" prompt="Zadejte kód banky"
                            value={person.bankCode || ""}
                            handleChange={handleChange}
                        />
                        <InputField
                            required={true} type="text" name="iban" label="IBAN" prompt="Zadejte IBAN"
                            value={person.iban || ""}
                            handleChange={handleChange}
                        />
                        <InputField
                            required={true} type="text" name="telephone" label="Telefon" prompt="Zadejte Telefon"
                            value={person.telephone || ""}
                            handleChange={handleChange}
                        />
                        <InputField
                            required={true} type="text" name="mail" label="Mail" prompt="Zadejte mail"
                            value={person.mail || ""}
                            handleChange={handleChange}
                        />
                        <InputField
                            required={true} type="text" name="street" label="Ulice" prompt="Zadejte ulici"
                            value={person.street || ""}
                            handleChange={handleChange}
                        />
                        <InputField
                            required={true} type="text" name="zip" label="PSČ" prompt="Zadejte PSČ"
                            value={person.zip || ""}
                            handleChange={handleChange}
                        />
                        <InputField
                            required={true} type="text" name="city" label="Město" prompt="Zadejte město"
                            value={person.city || ""}
                            handleChange={handleChange}
                        />
                        <InputField
                            type="text" name="note" label="Poznámka" prompt="Doplňující poznámka"
                            value={person.note || ""}
                            handleChange={handleChange}
                        />
                        <h6>Země:</h6>
                        <InputCheck
                            type="radio" name="country" label="Česká republika" value={Country.CZECHIA}
                            handleChange={handleChange}
                            checked={person.country === Country.CZECHIA}
                        />
                        <InputCheck
                            type="radio" name="country" label="Slovensko" value={Country.SLOVAKIA}
                            handleChange={handleChange}
                            checked={person.country === Country.SLOVAKIA}
                        />
                        
                        {/* Show validation error, if any */}
                        {validationError && (
                            <div className="alert alert-danger mt-3">
                                {validationError}
                            </div>
                        )}
                        <div className="d-flex justify-content-end mt-4">
                            <input type="submit" className="btn btn-primary" value="Uložit"/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PersonForm;
