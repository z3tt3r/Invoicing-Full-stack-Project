package cz.z3tt3r.invoicing.dto.mapper;

import cz.z3tt3r.invoicing.dto.InvoiceDTO;
import cz.z3tt3r.invoicing.dto.InvoiceSummary;
import cz.z3tt3r.invoicing.dto.PersonDTO;
import cz.z3tt3r.invoicing.entity.InvoiceEntity;
import cz.z3tt3r.invoicing.entity.PersonEntity;
import java.math.BigDecimal;
import java.time.LocalDate;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.3.Final, compiler: javac, environment: Java 17.0.16 (Azul Systems, Inc.)"
)
@Component
public class InvoiceMapperImpl implements InvoiceMapper {

    @Override
    public InvoiceEntity toEntity(InvoiceDTO source) {
        if ( source == null ) {
            return null;
        }

        InvoiceEntity invoiceEntity = new InvoiceEntity();

        invoiceEntity.setId( source.getId() );
        if ( source.getInvoiceNumber() != null ) {
            invoiceEntity.setInvoiceNumber( source.getInvoiceNumber() );
        }
        invoiceEntity.setIssued( source.getIssued() );
        invoiceEntity.setDueDate( source.getDueDate() );
        invoiceEntity.setProduct( source.getProduct() );
        invoiceEntity.setPrice( source.getPrice() );
        if ( source.getVat() != null ) {
            invoiceEntity.setVat( source.getVat() );
        }
        invoiceEntity.setNote( source.getNote() );

        return invoiceEntity;
    }

    @Override
    public InvoiceDTO toDTO(InvoiceEntity source) {
        if ( source == null ) {
            return null;
        }

        InvoiceDTO invoiceDTO = new InvoiceDTO();

        invoiceDTO.setId( source.getId() );
        invoiceDTO.setInvoiceNumber( source.getInvoiceNumber() );
        invoiceDTO.setIssued( source.getIssued() );
        invoiceDTO.setDueDate( source.getDueDate() );
        invoiceDTO.setProduct( source.getProduct() );
        invoiceDTO.setPrice( source.getPrice() );
        invoiceDTO.setVat( source.getVat() );
        invoiceDTO.setNote( source.getNote() );
        invoiceDTO.setBuyer( personEntityToPersonDTO( source.getBuyer() ) );
        invoiceDTO.setSeller( personEntityToPersonDTO( source.getSeller() ) );

        return invoiceDTO;
    }

    @Override
    public void updateEntityFromDto(InvoiceDTO invoiceDTO, InvoiceEntity entity) {
        if ( invoiceDTO == null ) {
            return;
        }

        if ( invoiceDTO.getInvoiceNumber() != null ) {
            entity.setInvoiceNumber( invoiceDTO.getInvoiceNumber() );
        }
        entity.setIssued( invoiceDTO.getIssued() );
        entity.setDueDate( invoiceDTO.getDueDate() );
        entity.setProduct( invoiceDTO.getProduct() );
        entity.setPrice( invoiceDTO.getPrice() );
        if ( invoiceDTO.getVat() != null ) {
            entity.setVat( invoiceDTO.getVat() );
        }
        entity.setNote( invoiceDTO.getNote() );
    }

    @Override
    public InvoiceSummary toSummary(InvoiceEntity source) {
        if ( source == null ) {
            return null;
        }

        String buyerName = null;
        String sellerName = null;
        String buyerIdentificationNumber = null;
        String sellerIdentificationNumber = null;
        Long id = null;
        String invoiceNumber = null;
        String product = null;
        BigDecimal price = null;
        LocalDate issued = null;

        buyerName = sourceBuyerName( source );
        sellerName = sourceSellerName( source );
        buyerIdentificationNumber = sourceBuyerIdentificationNumber( source );
        sellerIdentificationNumber = sourceSellerIdentificationNumber( source );
        id = source.getId();
        invoiceNumber = String.valueOf( source.getInvoiceNumber() );
        product = source.getProduct();
        price = source.getPrice();
        issued = source.getIssued();

        InvoiceSummary invoiceSummary = new InvoiceSummary( id, invoiceNumber, product, price, issued, buyerName, sellerName, buyerIdentificationNumber, sellerIdentificationNumber );

        return invoiceSummary;
    }

    protected PersonDTO personEntityToPersonDTO(PersonEntity personEntity) {
        if ( personEntity == null ) {
            return null;
        }

        PersonDTO personDTO = new PersonDTO();

        personDTO.setId( personEntity.getId() );
        personDTO.setName( personEntity.getName() );
        personDTO.setIdentificationNumber( personEntity.getIdentificationNumber() );
        personDTO.setTaxNumber( personEntity.getTaxNumber() );
        personDTO.setAccountNumber( personEntity.getAccountNumber() );
        personDTO.setBankCode( personEntity.getBankCode() );
        personDTO.setIban( personEntity.getIban() );
        personDTO.setTelephone( personEntity.getTelephone() );
        personDTO.setMail( personEntity.getMail() );
        personDTO.setStreet( personEntity.getStreet() );
        personDTO.setZip( personEntity.getZip() );
        personDTO.setCity( personEntity.getCity() );
        personDTO.setCountry( personEntity.getCountry() );
        personDTO.setNote( personEntity.getNote() );

        return personDTO;
    }

    private String sourceBuyerName(InvoiceEntity invoiceEntity) {
        if ( invoiceEntity == null ) {
            return null;
        }
        PersonEntity buyer = invoiceEntity.getBuyer();
        if ( buyer == null ) {
            return null;
        }
        String name = buyer.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private String sourceSellerName(InvoiceEntity invoiceEntity) {
        if ( invoiceEntity == null ) {
            return null;
        }
        PersonEntity seller = invoiceEntity.getSeller();
        if ( seller == null ) {
            return null;
        }
        String name = seller.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private String sourceBuyerIdentificationNumber(InvoiceEntity invoiceEntity) {
        if ( invoiceEntity == null ) {
            return null;
        }
        PersonEntity buyer = invoiceEntity.getBuyer();
        if ( buyer == null ) {
            return null;
        }
        String identificationNumber = buyer.getIdentificationNumber();
        if ( identificationNumber == null ) {
            return null;
        }
        return identificationNumber;
    }

    private String sourceSellerIdentificationNumber(InvoiceEntity invoiceEntity) {
        if ( invoiceEntity == null ) {
            return null;
        }
        PersonEntity seller = invoiceEntity.getSeller();
        if ( seller == null ) {
            return null;
        }
        String identificationNumber = seller.getIdentificationNumber();
        if ( identificationNumber == null ) {
            return null;
        }
        return identificationNumber;
    }
}
