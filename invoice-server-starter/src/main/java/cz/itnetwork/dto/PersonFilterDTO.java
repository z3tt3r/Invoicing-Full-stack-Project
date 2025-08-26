package cz.itnetwork.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object (DTO) used for frontend filtering buyers and sellers on invoices.
 * This DTO is designed to ensure the filtering logic remains independent of
 * any potential changes to the person data in the main database.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PersonFilterDTO {
    /**
     * The unique identifier of the person.
     */
    private String id;

    /**
     * The name of the person or company.
     */
    private String name;
}
