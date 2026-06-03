// GOV.UK radios for a single-choice question, with the question as the page
// heading (legend = h1) per the Design System. Reusable by any question page.
//
// Props:
//   idPrefix  unique id stem for the inputs (also the default input `name`)
//   legend    the question text (rendered as the page <h1>)
//   caption   optional small caption shown above the heading
//   hint      optional hint text shown under the heading
//   name      optional radio group name (defaults to idPrefix)
//   options   array of { value, label }
//   value     currently selected value
//   onChange  called with the newly selected value
//   error     optional error message string
function RadioField({
  idPrefix,
  legend,
  caption,
  hint,
  name,
  options,
  value,
  onChange,
  error,
}) {
  const hintId = hint ? `${idPrefix}-hint` : undefined;
  const errorId = error ? `${idPrefix}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`govuk-form-group ${error ? 'govuk-form-group--error' : ''}`}>
      <fieldset className="govuk-fieldset" aria-describedby={describedBy}>
        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
          {caption && <span className="govuk-caption-l">{caption}</span>}
          <h1 className="govuk-fieldset__heading">{legend}</h1>
        </legend>

        {hint && (
          <div id={hintId} className="govuk-hint">
            {hint}
          </div>
        )}

        {error && (
          <p id={errorId} className="govuk-error-message">
            <span className="govuk-visually-hidden">Error:</span> {error}
          </p>
        )}

        <div className="govuk-radios" data-module="govuk-radios">
          {options.map((option, index) => {
            const id = index === 0 ? idPrefix : `${idPrefix}-${index + 1}`;
            return (
              <div className="govuk-radios__item" key={option.value}>
                <input
                  className="govuk-radios__input"
                  id={id}
                  name={name || idPrefix}
                  type="radio"
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                />
                <label className="govuk-label govuk-radios__label" htmlFor={id}>
                  {option.label}
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}

export default RadioField;
