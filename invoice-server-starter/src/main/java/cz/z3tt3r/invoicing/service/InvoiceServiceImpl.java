package cz.z3tt3r.invoicing.service;

import cz.z3tt3r.invoicing.dto.InvoiceDTO;
import cz.z3tt3r.invoicing.dto.InvoiceStatisticsDTO;
import cz.z3tt3r.invoicing.dto.InvoiceSummary;
import cz.z3tt3r.invoicing.dto.mapper.InvoiceMapper;
import cz.z3tt3r.invoicing.entity.InvoiceEntity;
import cz.z3tt3r.invoicing.entity.PersonEntity;
import cz.z3tt3r.invoicing.entity.repository.InvoiceRepository;
import cz.z3tt3r.invoicing.entity.repository.PersonRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.webjars.NotFoundException;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * The service layer implementation for managing invoices.
 * This class contains the business logic for all invoice-related operations.
 */
@Service
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceMapper invoiceMapper;
    private final InvoiceRepository invoiceRepository;
    private final PersonRepository personRepository;

    /**
     * Constructs the service with required dependencies.
     *
     * @param invoiceMapper The mapper for converting between DTO and Entity objects.
     * @param invoiceRepository The repository for accessing invoice data.
     * @param personRepository The repository for accessing person data (buyer/seller).
     */
    public InvoiceServiceImpl(InvoiceMapper invoiceMapper, InvoiceRepository invoiceRepository, PersonRepository personRepository) {
        this.invoiceMapper = invoiceMapper;
        this.invoiceRepository = invoiceRepository;
        this.personRepository = personRepository;
    }

    /**
     * Creates and saves a new invoice based on the provided DTO.
     * It first converts the DTO to an entity, links the buyer and seller,
     * and then persists the entity to the database.
     *
     * @param invoiceDTO The DTO containing the invoice data.
     * @return The DTO of the newly created invoice.
     */
    @Override
    @Transactional
    public InvoiceDTO addInvoice(InvoiceDTO invoiceDTO) {
        InvoiceEntity entity = invoiceMapper.toEntity(invoiceDTO);
        setBuyerAndSellerForInvoice(invoiceDTO, entity);
        entity = invoiceRepository.save(entity);
        return invoiceMapper.toDTO(entity);
    }

    /**
     * Marks an existing invoice as hidden by setting its {@code hidden} flag to true.
     * This simulates a soft-delete operation. If the invoice is not found,
     * it will throw a NotFoundException which is handled by the ControllerAdvice.
     *
     * @param invoiceId The unique identifier of the invoice to be removed.
     * @throws NotFoundException if the invoice with the given ID does not exist.
     */
    @Override
    public void removeInvoice(long invoiceId) {
        InvoiceEntity invoice = fetchInvoiceById(invoiceId);
        invoice.setHidden(true);
        invoiceRepository.save(invoice);
    }

    /**
     * Retrieves a single invoice by its unique ID.
     *
     * @param id The unique identifier of the invoice.
     * @return A detailed InvoiceDTO for the specified invoice.
     * @throws NotFoundException if no invoice with the given ID exists.
     */
    @Override
    public InvoiceDTO getInvoice(long id) {
        return invoiceMapper.toDTO(fetchInvoiceById(id));
    }

    /**
     * A private helper method to fetch an InvoiceEntity by its ID.
     * This centralizes the logic for retrieving an invoice and handling not-found cases.
     *
     * @param id The ID of the invoice to fetch.
     * @return The InvoiceEntity.
     * @throws NotFoundException if the invoice does not exist in the database.
     */
    private InvoiceEntity fetchInvoiceById(long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Faktura s ID " + id + " nebyla nalezena v databázi."));
    }

    /**
     * "Edits" an existing invoice by hiding the original and creating a new one
     * with the updated data. This approach preserves a record of the original invoice.
     *
     * @param invoiceId The ID of the invoice to be edited.
     * @param invoiceDTO The DTO with the new data for the invoice.
     * @return The DTO of the newly created invoice.
     */
    @Override
    @Transactional
    public InvoiceDTO editInvoice(long invoiceId, InvoiceDTO invoiceDTO) {
        InvoiceEntity originalInvoice = fetchInvoiceById(invoiceId);
        originalInvoice.setHidden(true);
        invoiceRepository.save(originalInvoice);

        InvoiceEntity newInvoice = invoiceMapper.toEntity(invoiceDTO);
        newInvoice.setId(null); // Ensure a new ID is generated
        setBuyerAndSellerForInvoice(invoiceDTO, newInvoice);
        newInvoice = invoiceRepository.save(newInvoice);
        return invoiceMapper.toDTO(newInvoice);
    }

    /**
     * Calculates and retrieves statistics about all invoices, including
     * the total count of visible invoices, the total sum of prices for all time,
     * and the total sum of prices for the current year.
     *
     * @return An {@link InvoiceStatisticsDTO} object containing the calculated statistics.
     */
    @Override
    public InvoiceStatisticsDTO getInvoiceStatistics() {
        long invoicesCount = invoiceRepository.countByHidden(false);

        BigDecimal allTimeSum = invoiceRepository.sumAllTimePricesWithoutVat();
        if (allTimeSum == null) {
            allTimeSum = BigDecimal.ZERO;
        }

        BigDecimal currentYearSum = invoiceRepository.sumCurrentYearPricesWithoutVat();
        if (currentYearSum == null) {
            currentYearSum = BigDecimal.ZERO;
        }

        return new InvoiceStatisticsDTO(currentYearSum, allTimeSum, invoicesCount);
    }

    /**
     * A private helper method that sets the buyer and seller entities on an invoice entity
     * based on the IDs provided in the DTO. It validates that the IDs are present and
     * that the corresponding person entities exist.
     *
     * @param invoiceDTO The DTO with buyer and seller IDs.
     * @param invoiceEntity The entity on which to set the buyer and seller.
     * @throws IllegalArgumentException if the buyer or seller ID is missing in the DTO.
     * @throws NotFoundException if a person with the given ID is not found.
     */
    private void setBuyerAndSellerForInvoice(InvoiceDTO invoiceDTO, InvoiceEntity invoiceEntity) {
        if (invoiceDTO.getBuyer() == null || invoiceDTO.getBuyer().getId() == null) {
            throw new IllegalArgumentException("ID odběratele musí být uvedeno.");
        }
        PersonEntity buyer = personRepository.findById(invoiceDTO.getBuyer().getId())
                .orElseThrow(() -> new NotFoundException("Odběratel s ID " + invoiceDTO.getBuyer().getId() + " nebyl nalezen."));
        invoiceEntity.setBuyer(buyer);

        if (invoiceDTO.getSeller() == null || invoiceDTO.getSeller().getId() == null) {
            throw new IllegalArgumentException("ID dodavatele musí být uvedeno.");
        }
        PersonEntity seller = personRepository.findById(invoiceDTO.getSeller().getId())
                .orElseThrow(() -> new NotFoundException("Dodavatel s ID " + invoiceDTO.getSeller().getId() + " nebyl nalezen."));
        invoiceEntity.setSeller(seller);
    }

    /**
     * Retrieves a paginated and filtered list of invoice summaries.
     * The filtering can be done by buyer's or seller's identification number,
     * a product name (case-insensitive), and a price range.
     *
     * @param pageable Pagination information.
     * @param buyerId The identification number of the buyer to filter by.
     * @param sellerId The identification number of the seller to filter by.
     * @param product A substring of the product name for filtering.
     * @param minPrice The minimum price to filter by.
     * @param maxPrice The maximum price to filter by.
     * @return A page of filtered invoice summaries.
     */
    @Override
    public Page<InvoiceSummary> getFilteredInvoiceSummaries(
            Pageable pageable,
            String buyerId,
            String sellerId,
            String product,
            BigDecimal minPrice,
            BigDecimal maxPrice) {

        Specification<InvoiceEntity> spec = Specification.where(null);
        spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("hidden"), false));

        if (buyerId != null && !buyerId.trim().isEmpty()) {
            PersonEntity buyer = personRepository.findByIdentificationNumber(buyerId).stream().findFirst()
                    .orElseThrow(() -> new NotFoundException("Odběratel s identifikačním číslem " + buyerId + " nebyl nalezen."));
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("buyer"), buyer));
        }

        if (sellerId != null && !sellerId.trim().isEmpty()) {
            PersonEntity seller = personRepository.findByIdentificationNumber(sellerId).stream().findFirst()
                    .orElseThrow(() -> new NotFoundException("Dodavatel s identifikačním číslem " + sellerId + " nebyl nalezen."));
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("seller"), seller));
        }

        if (product != null && !product.trim().isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("product")), "%" + product.toLowerCase() + "%"));
        }

        if (minPrice != null) {
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice));
        }

        if (maxPrice != null) {
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice));
        }

        return invoiceRepository.findAll(spec, pageable).map(invoiceMapper::toSummary);
    }

    /**
     * Retrieves a paginated list of all invoices where a specific person is the seller.
     *
     * @param identificationNumber The identification number of the seller.
     * @param pageable Pagination information.
     * @return A page of invoices sold by the specified person.
     */
    @Override
    public Page<InvoiceDTO> getInvoicesBySellerIdentificationNumber(String identificationNumber, Pageable pageable) {
        List<PersonEntity> sellers = personRepository.findByIdentificationNumber(identificationNumber);
        if (sellers.isEmpty()) {
            return Page.empty(pageable);
        }
        List<Long> sellerIds = sellers.stream().map(PersonEntity::getId).collect(Collectors.toList());
        return invoiceRepository.findBySellerIdInAndHiddenFalse(sellerIds, pageable).map(invoiceMapper::toDTO);
    }

    /**
     * Retrieves a paginated list of all invoices where a specific person is the buyer.
     *
     * @param identificationNumber The identification number of the buyer.
     * @param pageable Pagination information.
     * @return A page of invoices purchased by the specified person.
     */
    @Override
    public Page<InvoiceDTO> getInvoicesByBuyerIdentificationNumber(String identificationNumber, Pageable pageable) {
        List<PersonEntity> buyers = personRepository.findByIdentificationNumber(identificationNumber);
        if (buyers.isEmpty()) {
            return Page.empty(pageable);
        }
        List<Long> buyerIds = buyers.stream().map(PersonEntity::getId).collect(Collectors.toList());
        return invoiceRepository.findByBuyerIdInAndHiddenFalse(buyerIds, pageable).map(invoiceMapper::toDTO);
    }
}
