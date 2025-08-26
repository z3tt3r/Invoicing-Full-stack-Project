package cz.itnetwork.service;

import cz.itnetwork.dto.PersonDTO;
import cz.itnetwork.dto.PersonFilterDTO;
import cz.itnetwork.dto.PersonStatisticsDTO;
import cz.itnetwork.entity.PersonLookup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PersonService {

    /**
     * Creates a new person.
     * @param personDTO Person to create.
     * @return newly created person.
     */
    PersonDTO addPerson(PersonDTO personDTO);

    /**
     * <p>Sets a person's 'hidden' flag to true.</p>
     * <p>In case a person with the passed [id] isn't found, the method <b>silently fails</b>.</p>
     * @param id The ID of the person to "remove".
     */
    void removePerson(long id);

    /**
     * Fetches a detailed person by their ID.
     * @param personId The ID of the person.
     * @return The detailed person DTO.
     */
    PersonDTO getPerson(long personId);

    /**
     * Edits an existing person's information.
     * A new person entity is created and the old one is hidden.
     * The identification number (IČO) cannot be changed.
     * @param personId The ID of the person to edit.
     * @param personDTO The DTO with the updated person data.
     * @return The DTO of the newly created person entity.
     */
    PersonDTO editPerson(long personId, PersonDTO personDTO);

    /**
     * Retrieves a paginated list of person statistics, including revenue.
     * @param pageable Pagination and sorting information.
     * @return A page of person statistics DTOs.
     */
    Page<PersonStatisticsDTO> getPersonStatistics(Pageable pageable);

    /**
     * Retrieves a paginated list of all non-hidden persons as lightweight lookup objects.
     * This method is optimized for listing purposes.
     * @param identificationNumber Optional filter by identification number.
     * @param pageable Pagination information.
     * @return A page of person lookup objects.
     */
    Page<PersonLookup> getPersonsLookup(String identificationNumber, Pageable pageable);

    /**
     * Retrieves a list of all non-hidden persons as lightweight lookup objects.
     * This is useful for populating dropdowns or autocomplete fields.
     * @return A list of person lookup objects.
     */
    List<PersonLookup> getAllPersonsLookup();

    /**
     * Retrieves a single person lookup object by its ID.
     * @param id The ID of the person to retrieve.
     * @return The person lookup object.
     */
    PersonLookup getPersonLookupById(Long id);

    /**
     * Gets a list of all unique persons (buyers and sellers) from invoices.
     * @return A list of DTOs with person IDs and names.
     */
    List<PersonFilterDTO> getInvoiceRelatedPersons();
}
