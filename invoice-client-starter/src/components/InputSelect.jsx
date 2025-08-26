import React from "react";

export function InputSelect(props) {
    const { name, label, prompt, items, value, handleChange, required, multiple, enum: enumItems } = props;
    
    // Debug logging
    console.log(`InputSelect ${name}:`, {
        value: value,
        valueType: typeof value,
        items: items.map(item => ({ id: item.id, idType: typeof item.id, name: item.name }))
    });
    
    // příznak objektové struktury položek
    const objectItems = enumItems ? false : true;
    
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}:</label>
            <select
                id={name}
                required={required}
                className="browser-default form-select"
                multiple={multiple}
                name={name}
                onChange={handleChange}
                value={value}
            >
                {/* Prázdná hodnota pro placeholder, nyní s prázdným řetězcem */}
                <option disabled={required} value="">
                    {prompt}
                </option>
                {objectItems
                    ? /* vykreslení položek jako objektů z databáze (osobnosti) */
                    items.map((item) => {
                        const optionValue = String(item.id);
                        const isSelected = optionValue === value;
                        console.log(`Option ${item.name}: value="${optionValue}", selected=${isSelected}, matches="${value}"`);
                        
                        return (
                            <option key={item.id} value={optionValue}>
                                {item.name} ({item.identificationNumber})
                            </option>
                        );
                    })
                    : /* vykreslení položek jako hodnot z výčtu (žánry) */
                    items.map((item) => (
                        <option key={item} value={item}>
                            {enumItems[item]}
                        </option>
                    ))}
            </select>
        </div>
    );
}

export default InputSelect;