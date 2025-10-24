package cz.z3tt3r.invoicing.entity.repository;

import cz.z3tt3r.invoicing.dto.InvoiceSummary;
import cz.z3tt3r.invoicing.entity.InvoiceEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * A repository for managing {@link InvoiceEntity} instances.
 * This interface extends JpaRepository for basic CRUD operations and JpaSpecificationExecutor
 * for advanced querying using specifications. It also includes custom-defined methods
 * for calculating invoice statistics and retrieving filtered summaries.
 */
@Repository
public interface InvoiceRepository extends JpaRepository<InvoiceEntity, Long>, JpaSpecificationExecutor<InvoiceEntity> {

    /**
     * Calculates the sum of all invoice prices (without VAT) for all time.
     * The query only considers invoices that are not hidden.
     *
     * @return The total sum of all non-hidden invoice prices, or {@code null} if no invoices exist.
     */
    @Query(value = "SELECT SUM(i.price) FROM invoice i WHERE i.hidden = false", nativeQuery = true)
    BigDecimal sumAllTimePricesWithoutVat();

    /**
     * Calculates the sum of all invoice prices (without VAT) for the current year.
     * The query only considers invoices that are not hidden and were issued in the current year.
     *
     * @return The total sum of non-hidden invoice prices from the current year, or {@code null} if no invoices exist.
     */
    @Query(value = "SELECT SUM(i.price) FROM invoice i WHERE YEAR(i.issued) = YEAR(CURDATE()) AND i.hidden = false", nativeQuery = true)
    BigDecimal sumCurrentYearPricesWithoutVat();

    /**
     * Counts the total number of invoices based on their hidden status.
     *
     * @param hidden A boolean flag to count either hidden or non-hidden invoices.
     * @return The count of invoices matching the hidden status.
     */
    long countByHidden(boolean hidden);

    //region Methods prepared for deletion
    // These methods are being replaced by the JpaSpecificationExecutor and new custom queries
    // and are slated for removal in a future refactoring.
    /**
     * Retrieves a list of invoices based on a list of seller IDs.
     * @param sellerIds A list of seller IDs to filter by.
     * @return A list of {@link InvoiceEntity} objects.
     */
    // List<InvoiceEntity> findBySellerIdIn(List<Long> sellerIds);
    /**
     * Retrieves a list of invoices based on a list of buyer IDs.
     * @param buyerIds A list of buyer IDs to filter by.
     * @return A list of {@link InvoiceEntity} objects.
     */
    // List<InvoiceEntity> findByBuyerIdIn(List<Long> buyerIds);
    //endregion

    /**
     * Retrieves a paginated list of all non-hidden invoices where a specific person is the seller.
     *
     * @param sellerIds A list of IDs of the seller(s).
     * @param pageable Pagination information.
     * @return A page of invoices sold by the specified person.
     */
    Page<InvoiceEntity> findBySellerIdInAndHiddenFalse(List<Long> sellerIds, Pageable pageable);

    /**
     * Retrieves a paginated list of all non-hidden invoices where a specific person is the buyer.
     *
     * @param buyerIds A list of IDs of the buyer(s).
     * @param pageable Pagination information.
     * @return A page of invoices purchased by the specified person.
     */
    Page<InvoiceEntity> findByBuyerIdInAndHiddenFalse(List<Long> buyerIds, Pageable pageable);

    /**
     * Retrieves a paginated and filtered list of invoice summaries.
     * The filtering is based on optional parameters for buyer ID, seller ID,
     * product name (case-insensitive substring match), and a price range.
     *
     * @param buyerId The ID of the buyer to filter by.
     * @param sellerId The ID of the seller to filter by.
     * @param product A substring of the product name for filtering.
     * @param minPrice The minimum price to filter by.
     * @param maxPrice The maximum price to filter by.
     * @param pageable Pagination information.
     * @return A page of filtered invoice summaries.
     */
    @Query(value = "SELECT new cz.z3tt3r.invoicing.dto.InvoiceSummary(i.id, i.invoiceNumber, i.product, i.price, i.issued, " +
            "i.buyer.name, i.seller.name, i.buyer.identificationNumber, i.seller.identificationNumber) " +
            "FROM invoice i " +
            "WHERE (:buyerId IS NULL OR i.buyer.id = :buyerId) " +
            "AND (:sellerId IS NULL OR i.seller.id = :sellerId) " +
            "AND (:product IS NULL OR i.product LIKE CONCAT('%', :product, '%')) " +
            "AND (:minPrice IS NULL OR i.price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR i.price <= :maxPrice) " +
            "AND (i.hidden = false)")
    Page<InvoiceSummary> getFilteredInvoiceSummaries(
            @Param("buyerId") Long buyerId,
            @Param("sellerId") Long sellerId,
            @Param("product") String product,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );

    /**
     * Retrieves a paginated list of invoice summaries based on a seller's identification number.
     * The result is a projection into the {@link InvoiceSummary} DTO.
     *
     * @param ic The identification number of the seller.
     * @param pageable Pagination information.
     * @return A page of invoice summaries where the person with the given IC is the seller.
     */
    @Query(value = "SELECT new cz.z3tt3r.invoicing.dto.InvoiceSummary(i.id, i.invoiceNumber, i.product, i.price, i.issued, " +
            "i.buyer.name, i.seller.name, i.buyer.identificationNumber, i.seller.identificationNumber) " +
            "FROM invoice i " +
            "WHERE i.seller.identificationNumber = :ic " +
            "AND i.hidden = false")
    Page<InvoiceSummary> getSalesInvoicesByPersonIdentificationNumber(
            @Param("ic") String ic,
            Pageable pageable
    );

    /**
     * Retrieves a paginated list of invoice summaries based on a buyer's identification number.
     * The result is a projection into the {@link InvoiceSummary} DTO.
     *
     * @param ic The identification number of the buyer.
     * @param pageable Pagination information.
     * @return A page of invoice summaries where the person with the given IC is the buyer.
     */
    @Query(value = "SELECT new cz.z3tt3r.invoicing.dto.InvoiceSummary(i.id, i.invoiceNumber, i.product, i.price, i.issued, " +
            "i.buyer.name, i.seller.name, i.buyer.identificationNumber, i.seller.identificationNumber) " +
            "FROM invoice i " +
            "WHERE i.buyer.identificationNumber = :ic " +
            "AND i.hidden = false")
    Page<InvoiceSummary> getPurchaseInvoicesByPersonIdentificationNumber(
            @Param("ic") String ic,
            Pageable pageable
    );
}
