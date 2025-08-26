package cz.itnetwork.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Represents an invoice entity in the database.
 * This class is a JPA entity that maps to the "invoice" table.
 * It contains all the necessary data fields for an invoice,
 * including its number, dates, product details, price, and associated buyer and seller.
 */
@Entity (name = "invoice")
@Getter
@Setter
public class InvoiceEntity {

    /**
     * The unique identifier of the invoice.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The unique invoice number.
     */
    @Column(nullable = false)
    private int invoiceNumber;

    /**
     * The date the invoice was issued.
     */
    @Column(nullable = false)
    private LocalDate issued;

    /**
     * The due date for the invoice payment.
     */
    @Column(nullable = false)
    private LocalDate dueDate;

    /**
     * A description of the product or service on the invoice.
     */
    @Column(nullable = false)
    private String product;

    /**
     * The price of the product or service.
     */
    @Column(nullable = false)
    private BigDecimal price;

    /**
     * The VAT percentage applied to the invoice.
     */
    @Column(nullable = false)
    private int vat;

    /**
     * Optional notes related to the invoice.
     */
    private String note;

    /**
     * The {@link PersonEntity} representing the buyer of the invoice.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private PersonEntity buyer;

    /**
     * The {@link PersonEntity} representing the seller of the invoice.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private PersonEntity seller;

    /**
     * A flag indicating if the invoice is soft-deleted.
     */
    private boolean hidden = false;

}
