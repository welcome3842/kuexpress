module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    switch (true) {
        case typeof err === 'string':
            // custom application error
            const is404 = err.toLowerCase().endsWith('not found');
            const statusCode = is404 ? 404 : 400;
            return res.status(statusCode).json({error: true, status: statusCode, message: err });
        case err.name === 'UnauthorizedError':
            // jwt authentication error
            // console.log('authentication');
              console.log(err);
              console.log(err.code);
            if(err.code=='credentials_required')
            return res.status(err.status).json({error: true, status: 401, message: 'Unauthorized' });
              else
            return res.status(err.code).json({error: true, status: 401, message: 'Unauthorized' });
        default:
            const statusCodeDefault = err.code ? err.code : 200;
            return res.status(statusCodeDefault).json({error: true, status: statusCodeDefault, message: err.message });
        // console.log(err)
        //     return res.status(200).json({error: true, status: 500, message: err.message });


    }
}