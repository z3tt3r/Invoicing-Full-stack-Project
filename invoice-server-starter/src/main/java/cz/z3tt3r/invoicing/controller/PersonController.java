package cz.z3tt3r.invoicing.controller;

import cz.z3tt3r.invoicing.dto.PersonDTO;
import cz.z3tt3r.invoicing.dto.PersonFilterDTO;
import cz.z3tt3r.invoicing.dto.PersonStatisticsDTO;
import cz.z3tt3r.invoicing.entity.PersonLookup;
import cz.z3tt3r.invoicing.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PersonController {

    @Autowired
    private PersonService personService;

    /**
     * Adds a new person to the database.
     * @param personDTO The DTO containing the person's data.
     * @return The DTO of the newly created person.
     */
    @PostMapping("/persons")
    public PersonDTO addPerson(@RequestBody PersonDTO personDTO) {
        return  personService.addPerson(personDTO);
    }

    /**
     * Retrieves a paginated list of persons using a lightweight {@link PersonLookup} object.
     * This endpoint is optimized for listing purposes, returning only essential data.
     * @param identificationNumber Optional filter by identification number (IČO).
     * @param pageable Pagination information (e.g., page number, size).
     * @return A page of {@link PersonLookup} objects.
     */
    @GetMapping("/persons")
    public Page<PersonLookup> getPersons(
            @RequestParam(required = false) String identificationNumber,
            @PageableDefault(size = 20) Pageable pageable) {
        return personService.getPersonsLookup(identificationNumber, pageable);
    }

    /**
     * Retrieves a paginated list of person statistics, including revenue.
     * The results are sorted by the person's name by default.
     * @param pageable Pagination and sorting information.
     * @return A page of {@link PersonStatisticsDTO} objects.
     */
    @GetMapping("/persons/statistics")
    public Page<PersonStatisticsDTO> getPersonStatistics(
            @PageableDefault(size = 10, sort = "personName") Pageable pageable) {
        return personService.getPersonStatistics(pageable);
    }

    /**
     * Retrieves the detailed information of a specific person.
     * @param personId The ID of the person to retrieve.
     * @return The detailed {@link PersonDTO} object.
     */
    @GetMapping("/persons/{personId}")
    public PersonDTO getPerson(@PathVariable Long personId) {
        return personService.getPerson(personId);
    }

    /**
     * Deletes a person by setting their `hidden` flag to true.
     * @param personId The ID of the person to delete.
     */
    @DeleteMapping("/persons/{personId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePerson(@PathVariable Long personId) {
        personService.removePerson(personId);
    }

    /**
     * Edits an existing person's information. A new person entity is created and the old one is hidden.
     * The identification number (IČO) cannot be changed.
     * @param personId The ID of the person to edit.
     * @param personDTO The DTO with the updated person data.
     * @return The DTO of the newly created person entity.
     */
    @PutMapping("/persons/{personId}")
    public PersonDTO editPerson(@PathVariable Long personId, @RequestBody PersonDTO personDTO) {
        return personService.editPerson(personId, personDTO);
    }

    /**
     * Retrieves a list of all non-hidden persons as lightweight {@link PersonLookup} objects.
     * This endpoint is typically used for populating dropdowns or autocomplete fields.
     * @return A list of {@link PersonLookup} objects.
     */
    @GetMapping("/persons/lookup")
    public List<PersonLookup> getAllPersonsLookup() {
        return personService.getAllPersonsLookup();
    }

    /**
     * Retrieves a single {@link PersonLookup} object by its ID.
     * @param id The ID of the person to retrieve.
     * @return The {@link PersonLookup} object.
     */
    @GetMapping("/persons/lookup/{id}")
    public PersonLookup getPersonLookupById(@PathVariable Long id) {
        return personService.getPersonLookupById(id);
    }

    /**
     * New endpoint to get a list of all persons (buyers and sellers) for invoice filtering.
     * This endpoint returns a list of {@link PersonFilterDTO} objects with ID and name.
     * @return A list of {@link PersonFilterDTO} objects.
     */
    @GetMapping("/persons/invoice-related")
    public List<PersonFilterDTO> getInvoiceRelatedPersons() {
        return personService.getInvoiceRelatedPersons();
    }
}
