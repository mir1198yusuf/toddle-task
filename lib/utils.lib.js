function getBaseUrlOfServer(protocol, host) {
    try {
        return `${protocol}://${host}`;
    } catch (error) {
        handleErrorCatch(error);
    }
}

export { getBaseUrlOfServer };
