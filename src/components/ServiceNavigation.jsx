// GOV.UK Service navigation (govuk-frontend v6) — service-name variant:
// https://design-system.service.gov.uk/components/service-navigation/
// Sits directly below the header and carries its own govuk-width-container.
// The service name links back to the service start page.
export default function ServiceNavigation({
  serviceName = 'Check if you can get a Green Home Grant',
  serviceUrl = '/',
}) {
  return (
    <section
      aria-label="Service information"
      className="govuk-service-navigation"
      data-module="govuk-service-navigation"
    >
      <div className="govuk-width-container">
        <div className="govuk-service-navigation__container">
          <span className="govuk-service-navigation__service-name">
            <a href={serviceUrl} className="govuk-service-navigation__link">
              {serviceName}
            </a>
          </span>
        </div>
      </div>
    </section>
  );
}
