import { forwardRef } from 'react';

// GOV.UK notification banner — used to surface important information, often in
// response to a user action. Pass the body as children. Forwards a ref so the
// page can move focus to the banner when it appears.
const NotificationBanner = forwardRef(function NotificationBanner(
  { title = 'Important', titleId = 'notification-banner-title', children },
  ref,
) {
  return (
    <div
      className="govuk-notification-banner"
      role="region"
      aria-labelledby={titleId}
      tabIndex={-1}
      ref={ref}
    >
      <div className="govuk-notification-banner__header">
        <h2 className="govuk-notification-banner__title" id={titleId}>
          {title}
        </h2>
      </div>
      <div className="govuk-notification-banner__content">
        {children}
      </div>
    </div>
  );
});

export default NotificationBanner;
