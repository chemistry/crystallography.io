import * as React from "react";

export const Input = ({ value, onChange, placeholder }: {
    value: string, onChange: (event: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string
})=> {
    return (
        <input value={value} onChange={onChange} className="form-input" placeholder="Enter keyword" />
    )
}
