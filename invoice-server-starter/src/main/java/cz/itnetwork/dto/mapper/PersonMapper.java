package cz.itnetwork.dto.mapper;

import cz.itnetwork.dto.PersonDTO;
import cz.itnetwork.entity.PersonEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

/**
 * Mapper interface for converting between {@link PersonEntity} and {@link PersonDTO}.
 * It uses MapStruct to generate the implementation at compile time.
 */
@Mapper(componentModel = "spring")
public interface PersonMapper {

    /**
     * Converts a {@link PersonDTO} to a {@link PersonEntity}.
     *
     * @param source The DTO to convert.
     * @return The resulting {@link PersonEntity}.
     */
    PersonEntity toEntity(PersonDTO source);

    /**
     * Converts a {@link PersonEntity} to a {@link PersonDTO}.
     *
     * @param source The entity to convert.
     * @return The resulting {@link PersonDTO}.
     */
    PersonDTO toDTO(PersonEntity source);

    /**
     * Updates an existing {@link PersonEntity} with data from a {@link PersonDTO}.
     *
     * @param personDTO The DTO containing the updated data.
     * @param entity The target entity to update.
     */
    void updateEntityFromDto(PersonDTO personDTO, @MappingTarget PersonEntity entity);
}
