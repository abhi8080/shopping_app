const Sentry = require('@sentry/node');
const {
  NotFoundError,
  ValidationError,
  AuthorizeError,
} = require('./app-errors');

Sentry.init({
  dsn: 'https://9398fc59b5e704aa795509c5941280e5@o4505631382962176.ingest.sentry.io/4505631392923648',

  tracesSampleRate: 1.0,
});

module.exports = (app) => {
  app.use((error, req, res, next) => {
    let reportError = true;

    [NotFoundError, ValidationError, AuthorizeError].forEach((typeOfError) => {
      if (error instanceof typeOfError) {
        reportError = false;
      }
    });

    if (reportError) {
      Sentry.captureException(error);
    }
    const statusCode = error.statusCode || 500;
    const data = error.data || error.message;
    return res.status(statusCode).json(data);
  });
};
