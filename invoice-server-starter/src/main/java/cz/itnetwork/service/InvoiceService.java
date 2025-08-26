package cz.itnetwork.service;

import cz.itnetwork.dto.InvoiceDTO;
import cz.itnetwork.dto.InvoiceStatisticsDTO;
import cz.itnetwork.dto.InvoiceSummary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

/**
 * The service interface for managing invoices.
 * This defines the contract for all business logic related to invoices.
 */
public interface InvoiceService {

    /**
     * Creates and persists a new invoice.
     *
     * @param invoiceDTO The invoice data transfer object.
     * @return The created invoice as a DTO.
     */
    InvoiceDTO addInvoice(InvoiceDTO invoiceDTO);

    /**
     * Soft-deletes an invoice by its ID.
     *
     * @param invoiceId The unique identifier of the invoice to be removed.
     */
    void removeInvoice(long invoiceId);

    /**
     * Retrieves a single invoice by its unique ID.
     *
     * @param id The unique identifier of the invoice.
     * @return The detailed InvoiceDTO.
     */
    InvoiceDTO getInvoice(long id);

    /**
     * Edits an existing invoice by its ID.
     *
     * @param invoiceId The ID of the invoice to be edited.
     * @param invoiceDTO The new invoice data.
     * @return The updated invoice as a DTO.
     */
    InvoiceDTO editInvoice(long invoiceId, InvoiceDTO invoiceDTO);

    /**
     * Retrieves statistical data about all invoices.
     *
     * @return An object containing invoice statistics.
     */
    InvoiceStatisticsDTO getInvoiceStatistics();

    /**
     * Retrieves a paginated and filtered list of invoice summaries.
     *
     * @param pageable Pagination information.
     * @param buyerId The ID of the buyer for filtering.
     * @param sellerId The ID of the seller for filtering.
     * @param product A product name substring for filtering.
     * @param minPrice The minimum price for filtering.
     * @param maxPrice The maximum price for filtering.
     * @return A page of invoice summaries.
     */
    Page<InvoiceSummary> getFilteredInvoiceSummaries(
            Pageable pageable,
            String buyerId,
            String sellerId,
            String product,
            BigDecimal minPrice,
            BigDecimal maxPrice
    );

    /**
     * Retrieves a paginated list of invoices by seller's identification number.
     *
     * @param identificationNumber The identification number of the seller.
     * @param pageable Pagination information.
     * @return A page of invoices sold by the specified seller.
     */
    Page<InvoiceDTO> getInvoicesBySellerIdentificationNumber(String identificationNumber, Pageable pageable);

    /**
     * Retrieves a paginated list of invoices by buyer's identification number.
     *
     * @param identificationNumber The identification number of the buyer.
     * @param pageable Pagination information.
     * @return A page of invoices purchased by the specified buyer.
     */
    Page<InvoiceDTO> getInvoicesByBuyerIdentificationNumber(String identificationNumber, Pageable pageable);
}
