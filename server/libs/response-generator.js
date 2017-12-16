exports.generate = function(err, message, status, data){
    myResponse = {
        error       :   error,
        message     :   message,
        status      :   status,
        data        :   data
    };
    return myResponse
}