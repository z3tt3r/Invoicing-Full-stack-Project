package cz.itnetwork.entity.repository;

import cz.itnetwork.dto.PersonStatisticsDTO;
import cz.itnetwork.entity.PersonEntity;
import cz.itnetwork.entity.PersonLookup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for managing {@link PersonEntity} data.
 * This interface provides methods for CRUD operations and custom queries
 * related to person entities.
 */
@Repository
public interface PersonRepository extends JpaRepository<PersonEntity, Long> {

    /**
     * Retrieves all persons based on their hidden status.
     *
     * @param hidden The hidden status to filter by.
     * @return A list of {@link PersonEntity} objects.
     */
    List<PersonEntity> findByHidden(boolean hidden);

    /**
     * Retrieves a paginated list of {@link PersonLookup} objects based on their hidden status.
     *
     * @param hidden The hidden status to filter by.
     * @param pageable The pagination information.
     * @return A page of {@link PersonLookup} objects.
     */
    Page<PersonLookup> findByHidden(boolean hidden, Pageable pageable);

    /**
     * Finds a list of persons by their identification number.
     *
     * @param identificationNumber The identification number to search for.
     * @return A list of {@link PersonEntity} objects.
     */
    List<PersonEntity> findByIdentificationNumber(String identificationNumber);

    /**
     * Retrieves a list of all persons that are not hidden.
     *
     * @return A list of {@link PersonLookup} objects.
     */
    List<PersonLookup> findAllByHiddenFalse();

    /**
     * Retrieves a paginated list of person statistics, including total revenue.
     * Revenue is calculated by summing the prices of all sales and purchases
     * for each non-hidden person.
     *
     * @param pageable The pagination information.
     * @return A page of {@link PersonStatisticsDTO} objects.
     */
    @Query(value = "SELECT new cz.itnetwork.dto.PersonStatisticsDTO(" +
            "p.id AS personId, " +
            "p.name AS personName, " +
            "COALESCE(SUM(sell_inv.price), 0) + COALESCE(SUM(buy_inv.price), 0) AS revenue) " +
            "FROM person p " +
            "LEFT JOIN p.sales sell_inv " +
            "LEFT JOIN p.purchases buy_inv " +
            "WHERE p.hidden = FALSE " +
            "GROUP BY p.id, p.name " +
            "ORDER BY p.id")
    Page<PersonStatisticsDTO> getPersonRevenueStatistics(Pageable pageable);
}
