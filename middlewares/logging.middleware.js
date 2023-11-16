function loggingMiddleware(req, res, next) {
    const startTime = Date.now();
    const originalSend = res.send;

    res.send = function (body) {
        console.log(
            `HTTP-Request: method=${req.method} url=${
                req.originalUrl
            } params=${JSON.stringify(req.params)} query=${JSON.stringify(
                req.query
            )} body=${JSON.stringify(req.body)} headers=${JSON.stringify(
                req.headers
            )} cookies=${JSON.stringify(req.cookies)}`
        );

        const endTime = Date.now();
        const elapsedTime = endTime - startTime;

        console.log(
            `HTTP-Response: status=${res.statusCode} body=${JSON.stringify(
                body
            )} headers=${JSON.stringify({
                ...res.getHeaders()
            })} timeTaken=${elapsedTime}`
        );

        return originalSend.call(res, body);
    };

    next();
}

export { loggingMiddleware };
