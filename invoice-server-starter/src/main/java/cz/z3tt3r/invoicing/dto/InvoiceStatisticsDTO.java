package cz.z3tt3r.invoicing.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Data Transfer Object (DTO) for displaying invoice statistics.
 * This DTO aggregates key metrics like the sum of invoice prices for the current year,
 * the total sum of all invoice prices, and the total count of all invoices.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvoiceStatisticsDTO {

    /**
     * The sum of prices from all invoices issued in the current year.
     */
    private BigDecimal currentYearSum;

    /**
     * The total sum of prices from all invoices across all time.
     */
    private BigDecimal allTimeSum;

    /**
     * The total number of all invoices.
     */
    private long invoicesSum;

}
