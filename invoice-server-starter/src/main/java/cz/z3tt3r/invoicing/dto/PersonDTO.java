package cz.z3tt3r.invoicing.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import cz.z3tt3r.invoicing.constant.Countries;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object (DTO) used on the frontend to display complete
 * information about a person on a detail page and for the person's edit form.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PersonDTO {

    /**
     * Unique identifier for the person.
     */
    @JsonProperty("id")
    private Long id;

    /**
     * Name of the person or company.
     */
    private String name;

    /**
     * Identification number (IČO).
     */
    private String identificationNumber;

    /**
     * Tax number (DIČ).
     */
    private String taxNumber;

    /**
     * Bank account number.
     */
    private String accountNumber;

    /**
     * Bank code.
     */
    private String bankCode;

    /**
     * International Bank Account Number (IBAN).
     */
    private String iban;

    /**
     * Telephone number.
     */
    private String telephone;

    /**
     * E-mail address.
     */
    private String mail;

    /**
     * Street name and number.
     */
    private String street;

    /**
     * Zip code.
     */
    private String zip;

    /**
     * City.
     */
    private String city;

    /**
     * Country.
     */
    private Countries country;

    /**
     * Additional notes about the person.
     */
    private String note;
}
