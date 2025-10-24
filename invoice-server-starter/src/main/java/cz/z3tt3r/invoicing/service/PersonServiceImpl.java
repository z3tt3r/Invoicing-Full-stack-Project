package cz.z3tt3r.invoicing.service;

import cz.z3tt3r.invoicing.dto.PersonDTO;
import cz.z3tt3r.invoicing.dto.PersonFilterDTO;
import cz.z3tt3r.invoicing.dto.PersonStatisticsDTO;
import cz.z3tt3r.invoicing.dto.mapper.PersonMapper;
import cz.z3tt3r.invoicing.entity.PersonEntity;
import cz.z3tt3r.invoicing.entity.PersonLookup;
import cz.z3tt3r.invoicing.entity.repository.InvoiceRepository;
import cz.z3tt3r.invoicing.entity.repository.PersonRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.webjars.NotFoundException;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Service implementation for managing persons.
 * Provides methods for adding, removing, editing, and retrieving person data.
 */
@Service
public class PersonServiceImpl implements PersonService {

    private final PersonMapper personMapper;
    private final PersonRepository personRepository;
    private final InvoiceRepository invoiceRepository;

    public PersonServiceImpl(PersonMapper personMapper, PersonRepository personRepository, InvoiceRepository invoiceRepository) {
        this.personMapper = personMapper;
        this.personRepository = personRepository;
        this.invoiceRepository = invoiceRepository;
    }

    /**
     * Adds a new person to the database.
     * @param personDTO The DTO containing the person's data.
     * @return The DTO of the newly created person.
     */
    @Override
    @Transactional
    public PersonDTO addPerson(PersonDTO personDTO) {
        PersonEntity entity = personMapper.toEntity(personDTO);
        entity = personRepository.save(entity);
        return personMapper.toDTO(entity);
    }

    /**
     * "Removes" a person by setting their hidden flag to true.
     * @param id The ID of the person to remove.
     * @throws NotFoundException if the person with the given ID does not exist.
     */
    @Override
    public void removePerson(long id) {
        PersonEntity person = fetchPersonById(id);
        person.setHidden(true);
        personRepository.save(person);
    }

    /**
     * Fetches a person entity from the database by their ID,
     * throwing a {@link NotFoundException} if not found.
     * @param id The ID of the person.
     * @return The {@link PersonEntity}.
     */
    private PersonEntity fetchPersonById(long id) {
        return personRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Osoba s ID " + id + " nebyla nalezena v databázi."));
    }

    /**
     * Retrieves a detailed person by their ID.
     * @param personId The ID of the person.
     * @return The detailed {@link PersonDTO}.
     */
    @Override
    public PersonDTO getPerson(long personId) {
        return personMapper.toDTO(fetchPersonById(personId));
    }

    /**
     * Edits an existing person's information. A new person entity is created and the old one is hidden.
     * The identification number (IČO) cannot be changed.
     * @param personId The ID of the person to edit.
     * @param personDTO The DTO with the updated person data.
     * @return The DTO of the newly created person entity.
     * @throws ResponseStatusException if the identification number is attempted to be changed.
     */
    @Override
    @Transactional
    public PersonDTO editPerson(long personId, PersonDTO personDTO) {
        // Fetch the original person from the database
        PersonEntity originalPerson = fetchPersonById(personId);

        // KEY CHECK: Prevent changing the identification number (IČO)
        if (!originalPerson.getIdentificationNumber().equals(personDTO.getIdentificationNumber())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Změna IČO u existující osoby není povolena.");
        }

        // The rest of the logic to preserve history:
        // 1. Hide the original entity
        originalPerson.setHidden(true);
        personRepository.save(originalPerson);

        // 2. Create and save a new entity with the new data, but with the same IČO
        PersonEntity newPerson = personMapper.toEntity(personDTO);
        newPerson.setId(null); // Ensure a new record is created
        newPerson = personRepository.save(newPerson);

        // 3. Return the DTO of the new entity
        return personMapper.toDTO(newPerson);
    }

    /**
     * Retrieves a paginated list of person statistics, including revenue.
     * @param pageable Pagination and sorting information.
     * @return A page of {@link PersonStatisticsDTO} objects.
     */
    @Override
    public Page<PersonStatisticsDTO> getPersonStatistics(Pageable pageable) {
        return personRepository.getPersonRevenueStatistics(pageable);
    }

    /**
     * Retrieves a paginated list of all non-hidden persons as lightweight {@link PersonLookup} objects.
     * This method is optimized for listing purposes.
     * @param identificationNumber Optional filter by identification number.
     * @param pageable Pagination information.
     * @return A page of {@link PersonLookup} objects.
     */
    @Override
    public Page<PersonLookup> getPersonsLookup(String identificationNumber, Pageable pageable) {
        // If identificationNumber is provided, filter by it
        if (identificationNumber != null && !identificationNumber.trim().isEmpty()) {
            List<PersonEntity> persons = personRepository.findByIdentificationNumber(identificationNumber);
            // Filter out hidden persons and convert to PersonLookup
            List<PersonLookup> lookups = persons.stream()
                    .filter(person -> !person.isHidden())
                    .map(person -> new PersonLookup() {
                        @Override
                        public Long getId() {
                            return person.getId();
                        }

                        @Override
                        public String getName() {
                            return person.getName();
                        }

                        @Override
                        public String getIdentificationNumber() {
                            return person.getIdentificationNumber();
                        }
                    })
                    .collect(Collectors.toList());
            
            // Convert List to Page
            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), lookups.size());
            
            List<PersonLookup> pageContent = start > lookups.size() ? 
                    Collections.emptyList() : 
                    lookups.subList(start, end);
            
            return new PageImpl<>(pageContent, pageable, lookups.size());
        }
        
        // Otherwise, return all non-hidden persons
        return personRepository.findByHidden(false, pageable);
    }

    /**
     * Retrieves a list of all non-hidden persons as lightweight {@link PersonLookup} objects.
     * This is useful for populating dropdowns or autocomplete fields.
     * @return A list of {@link PersonLookup} objects.
     */
    @Override
    public List<PersonLookup> getAllPersonsLookup() {
        return personRepository.findAllByHiddenFalse();
    }

    /**
     * Retrieves a single {@link PersonLookup} object by its ID.
     * @param id The ID of the person to retrieve.
     * @return The {@link PersonLookup} object.
     */
    @Override
    public PersonLookup getPersonLookupById(Long id) {
        return personRepository.findById(id)
                .map(person -> new PersonLookup() {
                    @Override
                    public Long getId() {
                        return person.getId();
                    }

                    @Override
                    public String getName() {
                        return person.getName();
                    }

                    @Override
                    public String getIdentificationNumber() {
                        return person.getIdentificationNumber();
                    }
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Osoba s ID " + id + " nebyla nalezena."));
    }

    /**
     * Retrieves a unique list of persons who are either buyers or sellers on an invoice.
     * This is used for filtering invoices.
     * @return A list of unique {@link PersonFilterDTO} objects.
     */
    @Override
    public List<PersonFilterDTO> getInvoiceRelatedPersons() {
        return invoiceRepository.findAll().stream()
                .flatMap(invoice -> Stream.of(invoice.getBuyer(), invoice.getSeller()))
                .filter(person -> person != null && person.getIdentificationNumber() != null)
                .map(person -> new PersonFilterDTO(person.getIdentificationNumber(), person.getName()))
                .distinct()
                .collect(Collectors.toList());
    }
}
