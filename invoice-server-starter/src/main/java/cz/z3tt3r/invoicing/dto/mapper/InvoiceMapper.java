package cz.z3tt3r.invoicing.dto.mapper;

import cz.z3tt3r.invoicing.dto.InvoiceDTO;
import cz.z3tt3r.invoicing.entity.InvoiceEntity;
import cz.z3tt3r.invoicing.dto.InvoiceSummary;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * MapStruct mapper for converting between Invoice DTOs, entities, and summaries.
 * This interface defines the mapping rules for creating, reading, and updating invoices.
 */
@Mapper(componentModel = "spring")
public interface InvoiceMapper {

    /**
     * Converts an {@link InvoiceDTO} to an {@link InvoiceEntity} for creation purposes.
     * The buyer and seller are ignored in this mapping, as they are handled separately in the service layer.
     *
     * @param source The InvoiceDTO to convert.
     * @return A new InvoiceEntity instance.
     */
    @Mapping(target = "buyer", ignore = true)
    @Mapping(target = "seller", ignore = true)
    InvoiceEntity toEntity(InvoiceDTO source);

    /**
     * Converts an {@link InvoiceEntity} to an {@link InvoiceDTO}.
     *
     * @param source The InvoiceEntity to convert.
     * @return A new InvoiceDTO instance.
     */
    InvoiceDTO toDTO(InvoiceEntity source);

    /**
     * Updates an existing {@link InvoiceEntity} with data from an {@link InvoiceDTO}.
     * The ID, buyer, and seller fields are ignored to prevent accidental updates.
     *
     * @param invoiceDTO The source DTO with updated data.
     * @param entity The target entity to update.
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "buyer", ignore = true)
    @Mapping(target = "seller", ignore = true)
    void updateEntityFromDto(InvoiceDTO invoiceDTO, @MappingTarget InvoiceEntity entity);

    /**
     * Converts an {@link InvoiceEntity} to an {@link InvoiceSummary} projection.
     * This method is used for creating a simplified view of the invoice for lists.
     * It maps specific fields from the nested buyer and seller entities to the flat summary DTO.
     *
     * @param source The InvoiceEntity to convert.
     * @return A new InvoiceSummary instance.
     */
    @Mapping(target = "buyerName", source = "buyer.name")
    @Mapping(target = "sellerName", source = "seller.name")
    @Mapping(target = "buyerIdentificationNumber", source = "buyer.identificationNumber")
    @Mapping(target = "sellerIdentificationNumber", source = "seller.identificationNumber")
    InvoiceSummary toSummary(InvoiceEntity source);
}
