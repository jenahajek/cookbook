import React from "react";

const Checkbox = ({
  count,
  value,
  label,
  dimension,
  checked,
  disabled,
  onChange,
}) => (
  <div className={`checkbox${disabled ? " is-disabled" : ""}`}>
    <input
      type="checkbox"
      className="checkbox__input"
      id={value}
      name={value}
      value={value}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      data-dimension={dimension}
    />

    <label className="checkbox__label" htmlFor={value}>
      {label} <span>{count ? `(${count})` : ""}</span>
    </label>
  </div>
);

export default Checkbox;
