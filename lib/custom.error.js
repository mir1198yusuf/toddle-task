class CustomError {
    constructor(statusCode, displayError, logError, data = {}) {
        this.statusCode = statusCode;
        this.displayError = displayError;
        this.logError = logError ?? displayError;
        this.data = data;

        console.error(`ERROR_DETAILS : ${logError}`);
        // notifyWebhook(logError)4
    }
}
export { CustomError };
