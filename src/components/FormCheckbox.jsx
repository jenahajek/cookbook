import React from "react";

const FormCheckbox = ({ count, value, label, onChange, checked }) => (
  <div className="checkbox">
    <span className="checkbox__inner">
      <input
        type="checkbox"
        className="checkbox__input"
        id={value}
        name={value}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <span className="checkbox__visual-input" aria-hidden="true" hidden>
        <svg className="checkbox__tick" viewBox="0 0 22 22" focusable="false">
          <path
            d="M6.2 11.7L8.5 14a1.6 1.6 0 0 0 2.4 0L16 7.1"
            className="checkbox__tick-determinate"
          />
          <path d="M6,11 H16" className="checkbox__tick-indeterminate" />
        </svg>
      </span>
      <span className="checkbox__label-wrapper">
        <label className="checkbox__label" htmlFor={value}>
          <span className="checkbox__label-text">
            {label} <span>({count})</span>
          </span>
        </label>
      </span>
    </span>
  </div>
);

export default FormCheckbox;
