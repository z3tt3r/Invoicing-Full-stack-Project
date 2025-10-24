package cz.z3tt3r.invoicing.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Data Transfer Object (DTO) for handling invoice data.
 * This DTO is used to transfer invoice information between the client and server,
 * suitable for displaying invoice details as well as creating or updating invoices.
 * It contains all essential invoice fields, including associated buyer and seller DTOs.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvoiceDTO {

    /**
     * The unique identifier of the invoice.
     */
    @JsonProperty("id")
    private Long id;

    /**
     * The unique invoice number.
     */
    private Integer invoiceNumber;

    /**
     * The date the invoice was issued.
     */
    private LocalDate issued;

    /**
     * The due date for the invoice payment.
     */
    private LocalDate dueDate;

    /**
     * A description of the product or service on the invoice.
     */
    private String product;

    /**
     * The price of the product or service.
     */
    private BigDecimal price;

    /**
     * The VAT percentage applied to the invoice.
     */
    private Integer vat;

    /**
     * Optional notes related to the invoice.
     */
    private String note;

    /**
     * The {@link PersonDTO} representing the buyer of the invoice.
     */
    private PersonDTO buyer;

    /**
     * The {@link PersonDTO} representing the seller of the invoice.
     */
    private PersonDTO seller;
}
