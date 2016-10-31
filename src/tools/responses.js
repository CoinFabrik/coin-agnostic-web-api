


exports.S_SUCCESS = 0;

exports.E_ADDRESS_INVALID               = 100;
exports.E_ARRAY_ADDRESS_INVALID         = 101;
exports.E_CSV_ADDRESS_INVALID           = 102;
exports.E_STRING_TOO_LONG               = 105;
exports.E_ARRAY_TOO_LONG                = 106;

exports.E_TX_HASH_INVALID               = 110;
exports.E_BLOCK_NUMBER_INVALID          = 111;
exports.E_TRANSACTION_INDEX_INVALID     = 112;
exports.E_BLOCK_IDENTIFIER_INVALID      = 113;
exports.E_BLOCK_HASH_INVALID            = 114;
exports.E_TRANSACTION_BINARY_INVALID    = 115;
exports.E_LAST_QUERY_INFO_INVALID       = 116;

exports.E_SEND_NULL_TX_INVALID          = 120;

exports.E_DAO_TOKEN_INVALID                 = 150;
exports.E_DAO_ARRAY_TOKEN_INVALID = 151;
exports.E_DAO_ERROR = 152;
exports.E_DAO_PROPOSAL_HASH_INVALID = 153;
exports.E_DAO_VOTE_NUMBER_INVALID = 154;
exports.E_DAO_PROPOSAL_ID_INVALID = 155;

exports.E_ETH_WEB3 = 200;
exports.E_DB                    = 300;

exports.E_QUERY_ORDER_INVALID  = 400;
exports.E_QUERY_LIMIT_INVALID = 401;
exports.E_QUERY_START_INVALID = 402;

exports.E_RPC_CALL_ERROR = 450;

exports.E_UNKNOWN_ERROR = 900;

var errorMessages = {};
errorMessages[exports.S_SUCCESS] = 'Success';

errorMessages[exports.E_ADDRESS_INVALID]    = 'Invalid address';
errorMessages[exports.E_ARRAY_ADDRESS_INVALID] = 'Invalid array of address';
errorMessages[exports.E_CSV_ADDRESS_INVALID] = 'Invalid CSV of address';
errorMessages[exports.E_STRING_TOO_LONG] = 'Invalid string parameter, string too long';
errorMessages[exports.E_ARRAY_TOO_LONG] = 'Too many elements';

errorMessages[exports.E_TX_HASH_INVALID]    = 'Invalid transaction hash';
errorMessages[exports.E_BLOCK_NUMBER_INVALID] = 'Invalid block number';
errorMessages[exports.E_BLOCK_IDENTIFIER_INVALID] = 'Invalid block identifier';
errorMessages[exports.E_BLOCK_HASH_INVALID] = 'Invalid block hash';
errorMessages[exports.E_TRANSACTION_BINARY_INVALID] = 'Invalid binary transaction';
errorMessages[exports.E_LAST_QUERY_INFO_INVALID] = 'Invalid Last Query info object. Use the object returned by the previous call.';

errorMessages[exports.E_SEND_NULL_TX_INVALID] = 'Cannot send null tx';

errorMessages[exports.E_DAO_TOKEN_INVALID] = 'Invalid TheDAO token';
errorMessages[exports.E_DAO_ARRAY_TOKEN_INVALID] = 'Invalid array of TheDAO tokens';
errorMessages[exports.E_DAO_ERROR] = 'TheDAO returned error';
errorMessages[exports.E_DAO_PROPOSAL_HASH_INVALID] = 'TheDAO Proposal Hash is invalid';
errorMessages[exports.E_DAO_VOTE_NUMBER_INVALID] = 'TheDAO vote number is invalid';
errorMessages[exports.E_DAO_PROPOSAL_ID_INVALID] = 'TheDAO Proposal ID is invalid';


errorMessages[exports.E_TRANSACTION_INDEX_INVALID] = 'Invalid transaction index';




errorMessages[exports.E_ETH_WEB3] = 'Web3 error';
errorMessages[exports.E_DB]                     = 'Database error';

errorMessages[exports.E_QUERY_ORDER_INVALID] = 'Invalid query order';
errorMessages[exports.E_QUERY_LIMIT_INVALID] = 'Invalid query limit';
errorMessages[exports.E_QUERY_START_INVALID] = 'Invalid query start';

errorMessages[exports.E_RPC_ERROR] = 'Remote procedure call failed';

errorMessages[exports.E_UNKNOWN_ERROR] = 'Unknown error';

exports.sendResponse = function (code, res, result) {
    if (code === exports.S_SUCCESS) {
        exports.sendSuccessResponse(res, result);
    }
    else {
        exports.sendErrorResponse(code, res, result);
    }
}

exports.sendSuccessResponse = function (res, result) {
    var response = result !== undefined ? result : { message: exports.getSuccessMessage() };

    res.status(200);
    res.json(response);
}

exports.sendErrorResponse = function (code, res, message) {
    res.status(400);
    res.json({
        subCode: code,
        message: ((message === undefined ? exports.getErrorMessage(code) : (exports.getErrorMessage(code) + ': ' +  message)))
    });
}

exports.sendErrorResponseObject = function (code, res, result) {
    if (code === exports.E_TOKEN_EXPIRED && message !== undefined) {
        message = exports.getErrorMessage(code, message);
    }
    res.status(400);
    result.subCode = code;
    result.message = exports.getErrorMessage(code);
    res.json(result);
}

exports.getSuccessMessage = function () {
    return errorMessages[exports.S_SUCCESS];
}

exports.getErrorMessage = function (code, arg) {
    var ret = errorMessages[code];
    if (ret === undefined)
        ret = '';
    return ret;
}
