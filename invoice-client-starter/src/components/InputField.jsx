import React from "react";

export function InputField(props) {
  // podporované typy pro element input
  const INPUTS = ["text", "number", "date"];

  // validace elementu a typu
  const type = props.type.toLowerCase();
  const isTextarea = type === "textarea";
  const required = props.required || false;
  // --- ZMĚNA: Přidání prop readOnly ---
  const readOnly = props.readOnly || false;

  if (!isTextarea && !INPUTS.includes(type)) {
    return null;
  }

  // přiřazení hodnoty minima do atributu příslušného typu
  const minProp = props.min || null;
  const min = ["number", "date"].includes(type) ? minProp : null;
  const minlength = ["text", "textarea"].includes(type) ? minProp : null;

  return (
    <div className="form-group">
      <label htmlFor={props.name}>{props.label}:</label>

      {/* vykreslení aktuálního elementu */}
      {isTextarea ? (
        <textarea
          id={props.name}
          required={required}
          className="form-control"
          placeholder={props.prompt}
          rows={props.rows}
          minLength={minlength}
          name={props.name}
          value={props.value}
          onChange={props.handleChange}
          // --- ZMĚNA: Aplikace atributu readOnly ---
          readOnly={readOnly}
        />
      ) : (
        <input
          id={props.name}
          required={required}
          type={type}
          className="form-control"
          placeholder={props.prompt}
          minLength={minlength}
          min={min}
          name={props.name}
          value={props.value}
          onChange={props.handleChange}
          // --- ZMĚNA: Aplikace atributu readOnly ---
          readOnly={readOnly}
        />
      )}
    </div>
  );
}

export default InputField;