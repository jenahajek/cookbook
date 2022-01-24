import React from "react";

const Checkbox = ({
  iconAfter,
  count,
  value,
  label,
  dimension,
  checked,
  disabled,
  onChange,
}) => (
  <div
    className={`checkbox${disabled ? " is-disabled" : ""} ${
      checked ? "checkbox--selected" : ""
    }`}>
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
      {label} {count ? <span>{`(${count})`}</span> : ""}
      {iconAfter ? (
        <span className="checkbox__icon-after">{iconAfter}</span>
      ) : (
        ""
      )}
    </label>
  </div>
);

export default Checkbox;
