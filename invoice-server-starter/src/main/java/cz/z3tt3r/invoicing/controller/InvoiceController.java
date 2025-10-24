package cz.z3tt3r.invoicing.controller;

import cz.z3tt3r.invoicing.dto.InvoiceDTO;
import cz.z3tt3r.invoicing.dto.InvoiceStatisticsDTO;
import cz.z3tt3r.invoicing.dto.InvoiceSummary;
import cz.z3tt3r.invoicing.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

/**
 * REST controller for managing invoices.
 * Provides endpoints for creating, retrieving, updating, and deleting invoices.
 */
@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    @Autowired
    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    /**
     * Creates a new invoice.
     *
     * @param invoiceDTO The DTO containing the invoice data to be created.
     * @return The DTO of the newly created invoice.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InvoiceDTO addInvoice(@RequestBody InvoiceDTO invoiceDTO) {
        return invoiceService.addInvoice(invoiceDTO);
    }

    /**
     * Retrieves a paginated list of filtered invoice summaries.
     *
     * @param pageable The pagination and sorting information. Defaults to 20 items per page.
     * @param buyerId The identification number of the buyer to filter by.
     * @param sellerId The identification number of the seller to filter by.
     * @param product The product name to filter by (case-insensitive search).
     * @param minPrice The minimum price for filtering.
     * @param maxPrice The maximum price for filtering.
     * @param limit Optional parameter to override the default page size.
     * @return A page of invoice summaries that match the specified criteria.
     */
    @GetMapping("/summary")
    public Page<InvoiceSummary> getInvoicesSummary(
            @PageableDefault(size = 20) Pageable pageable,
            @RequestParam(required = false) String buyerId,
            @RequestParam(required = false) String sellerId,
            @RequestParam(required = false) String product,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer limit) {

        Pageable finalPageable = (limit != null && limit > 0) ? Pageable.ofSize(limit).withPage(pageable.getPageNumber()) : pageable;
        return invoiceService.getFilteredInvoiceSummaries(finalPageable, buyerId, sellerId, product, minPrice, maxPrice);
    }

    /**
     * Retrieves a detailed invoice by its unique ID.
     *
     * @param invoiceId The unique ID of the invoice.
     * @return The detailed invoice DTO.
     */
    @GetMapping("/{invoiceId}")
    public InvoiceDTO getInvoice(@PathVariable Long invoiceId) {
        return invoiceService.getInvoice(invoiceId);
    }

    /**
     * Edits an existing invoice. The old invoice is "hidden" and a new one is created with the updated data.
     *
     * @param invoiceId The unique ID of the invoice to edit.
     * @param invoiceDTO The DTO containing the updated invoice data.
     * @return The DTO of the newly created invoice.
     */
    @PutMapping("/{invoiceId}")
    public InvoiceDTO editInvoice(@PathVariable Long invoiceId, @RequestBody InvoiceDTO invoiceDTO) {
        return invoiceService.editInvoice(invoiceId, invoiceDTO);
    }

    /**
     * "Deletes" an invoice by setting its hidden flag to true.
     *
     * @param invoiceId The unique ID of the invoice to delete.
     */
    @DeleteMapping("/{invoiceId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteInvoice(@PathVariable Long invoiceId) {
        invoiceService.removeInvoice(invoiceId);
    }

    /**
     * Retrieves a paginated list of invoices where the specified person is the seller.
     *
     * @param identificationNumber The identification number of the seller.
     * @param pageable The pagination information.
     * @return A page of invoice DTOs.
     */
    @GetMapping("/identification/{identificationNumber}/sales")
    public Page<InvoiceDTO> getInvoicesBySellerIdentificationNumber(
            @PathVariable String identificationNumber,
            @PageableDefault(size = 20) Pageable pageable) {
        return invoiceService.getInvoicesBySellerIdentificationNumber(identificationNumber, pageable);
    }

    /**
     * Retrieves a paginated list of invoices where the specified person is the buyer.
     *
     * @param identificationNumber The identification number of the buyer.
     * @param pageable The pagination information.
     * @return A page of invoice DTOs.
     */
    @GetMapping("/identification/{identificationNumber}/purchases")
    public Page<InvoiceDTO> getInvoicesByBuyerIdentificationNumber(
            @PathVariable String identificationNumber,
            @PageableDefault(size = 20) Pageable pageable) {
        return invoiceService.getInvoicesByBuyerIdentificationNumber(identificationNumber, pageable);
    }

    /**
     * Retrieves general statistics about invoices, including total counts and revenue sums.
     *
     * @return An object containing the invoice statistics.
     */
    @GetMapping("/statistics")
    public InvoiceStatisticsDTO getInvoiceStatistics() {
        return invoiceService.getInvoiceStatistics();
    }
}
