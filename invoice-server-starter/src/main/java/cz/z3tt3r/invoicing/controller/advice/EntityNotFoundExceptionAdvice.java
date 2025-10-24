package cz.z3tt3r.invoicing.controller.advice;

import jakarta.persistence.EntityNotFoundException;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.webjars.NotFoundException;

@Slf4j // Anotace Lombok pro automatické vytvoření loggeru
@ControllerAdvice
public class EntityNotFoundExceptionAdvice {

    // Vnitřní třída pro reprezentaci chybové odpovědi
    @Getter
    @Setter
    private static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }
    }

    @ExceptionHandler({NotFoundException.class, EntityNotFoundException.class})
    public ResponseEntity<ErrorResponse> handleEntityNotFoundException(RuntimeException ex) {
        // Pomocí Lombok anotace @Slf4j je logger k dispozici jako 'log'
        log.error("A NotFoundException occurred: {}", ex.getMessage());

        // Vytvoření a vrácení strukturované chybové odpovědi
        ErrorResponse errorResponse = new ErrorResponse(ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }
}
