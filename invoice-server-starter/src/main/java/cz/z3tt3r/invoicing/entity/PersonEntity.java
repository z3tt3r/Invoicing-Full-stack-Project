package cz.z3tt3r.invoicing.entity;

import cz.z3tt3r.invoicing.constant.Countries;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Entity(name = "person")
@Getter
@Setter
public class PersonEntity {

    /**
     * Unique identifier for the person.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Name of the person or company.
     */
    @Column(nullable = false)
    private String name;

    /**
     * Identification number (IČO).
     */
    @Column(nullable = false)
    private String identificationNumber;

    /**
     * Tax number (DIČ).
     */
    private String taxNumber;

    /**
     * Bank account number.
     */
    @Column(nullable = false)
    private String accountNumber;

    /**
     * Bank code.
     */
    @Column(nullable = false)
    private String bankCode;

    /**
     * International Bank Account Number (IBAN).
     */
    private String iban;

    /**
     * Telephone number.
     */
    @Column(nullable = false)
    private String telephone;

    /**
     * E-mail address.
     */
    @Column(nullable = false)
    private String mail;

    /**
     * Street name and number.
     */
    @Column(nullable = false)
    private String street;

    /**
     * Zip code.
     */
    @Column(nullable = false)
    private String zip;

    /**
     * City.
     */
    @Column(nullable = false)
    private String city;

    /**
     * Country of residence.
     */
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Countries country;

    /**
     * Additional notes about the person.
     */
    private String note;

    /**
     * Flag to indicate if the person is hidden (soft-deleted).
     */
    private boolean hidden = false;

    /**
     * List of invoices where this person is the seller.
     */
    @OneToMany(mappedBy = "seller")
    private List<InvoiceEntity> sales;

    /**
     * List of invoices where this person is the buyer.
     */
    @OneToMany(mappedBy = "buyer")
    private List<InvoiceEntity> purchases;
}
