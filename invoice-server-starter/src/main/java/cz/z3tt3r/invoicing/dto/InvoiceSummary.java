package cz.z3tt3r.invoicing.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * A data transfer object (DTO) for a concise summary of an invoice.
 * This record is designed to be an immutable data carrier, ideal for displaying
 * invoice information in a list or table, such as a summary of all invoices.
 *
 * I chose to use a Java {@code record} for this DTO because it automatically
 * provides a constructor, getters, {@code equals()}, {@code hashCode()}, and
 * {@code toString()} methods, significantly reducing boilerplate code. Its immutability
 * ensures that once an instance is created, its data cannot be changed, which is
 * perfect for a read-only projection used by methods like {@code getFilteredInvoiceSummaries}.
 *
 * @param id The unique identifier of the invoice.
 * @param invoiceNumber The invoice number.
 * @param product A description of the product or service.
 * @param price The price of the product or service.
 * @param issued The date the invoice was issued.
 * @param buyerName The full name of the buyer.
 * @param sellerName The full name of the seller.
 * @param buyerIdentificationNumber The identification number of the buyer.
 * @param sellerIdentificationNumber The identification number of the seller.
 */
public record InvoiceSummary(
        Long id,
        String invoiceNumber,
        String product,
        BigDecimal price,
        LocalDate issued,
        String buyerName,
        String sellerName,
        String buyerIdentificationNumber,
        String sellerIdentificationNumber
) {
}
