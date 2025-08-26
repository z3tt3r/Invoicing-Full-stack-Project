package cz.itnetwork.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Data Transfer Object (DTO) used to display statistics for a person.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonStatisticsDTO {

    /**
     * The unique identifier of the person.
     */
    private Long personId;

    /**
     * The name of the person.
     */
    private String personName;

    /**
     * The total revenue associated with the person.
     */
    private BigDecimal revenue;
}
