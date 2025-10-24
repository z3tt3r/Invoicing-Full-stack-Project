package cz.z3tt3r.invoicing.entity;

/**
 * <p>A projection interface for fetching a minimal set of person data.</p>
 * <p>This interface is used primarily for:</p>
 * <ul>
 * <li>Populating dropdowns and autocomplete fields.</li>
 * <li>Displaying a list of persons on the frontend with essential details.</li>
 * </ul>
 * <p>It ensures that only necessary data is retrieved from the database, improving performance.</p>
 */
public interface PersonLookup {

    /**
     * @return The unique identifier of the person.
     */
    Long getId();

    /**
     * @return The name of the person or company.
     */
    String getName();

    /**
     * @return The person's identification number (IČO).
     */
    String getIdentificationNumber();
}
