var responses = require('./responses');

var MAX_ARRAY_LENGTH = 100;
var MAX_STRING_LENGTH = 4000;

exports.isValidEthAddress = function (address, res) {
    if (typeof address !== 'string' || !/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        if (res) {
            responses.sendErrorResponse(responses.E_ADDRESS_INVALID, res, address);
        }
        return false;
    }

    return true;
};

exports.isValidArrayEthAddress = function (addresses, res) {
    if (!Array.isArray(addresses) || addresses.length > MAX_ARRAY_LENGTH) {
        if (res) {
            responses.sendErrorResponse(responses.E_ARRAY_ADDRESS_INVALID, res);
        }
        return false;
    }
    for (var i = 0; i < addresses.length; i++) {
        if (!exports.isValidEthAddress(addresses[i], res)) {
            return false;
        }
        addresses[i] = addresses[i].toLowerCase();
    }

    return true;
};

exports.isValidAddressCSV = function (addresses, res) {
    if (typeof addresses !== 'string' || addresses.length > MAX_STRING_LENGTH) {
        if (res) {
            responses.sendErrorResponse(responses.E_STRING_TOO_LONG, res);
        }
        return false;
    }

    var addressArray = addresses.split(',');
    if (addressArray.length > MAX_ARRAY_LENGTH || addressArray.length === 0) {
        if (res) {
            responses.sendErrorResponse(responses.E_ARRAY_TOO_LONG, res);
        }
        return false;
    }
    /* var error = false;
    addressArray.forEach(function (val, index, array) {
        array[index] = val = val.toLowerCase().trim();
        if (!exports.isValidEthAddress(val, res)) {
            error = true;
            return false;
        }
        array[index] = val.toLowerCase().trim();
    });

    if (error) return undefined; */

    return addressArray;
};

exports.isValidTransactionCSV = function (txs, res) {
    if (typeof txs !== 'string' || txs.length > MAX_STRING_LENGTH) {
        if (res) {
            responses.sendErrorResponse(responses.E_ETH_STRING_TOO_LONG, res);
        }
        return false;
    }

    var txArray = txs.split(',');
    if (txArray.length > MAX_ARRAY_LENGTH || txArray.length === 0) {
        if (res) {
            responses.sendErrorResponse(responses.E_ETH_ARRAY_TOO_LONG, res);
        }
        return false;
    }
    /* var error = false;
    txArray.forEach(function (val, index, array) {
        array[index] = val = val.toLowerCase().trim();
        if (!exports.isValidTransactionHash(val, res)) {
            error = true;
            return false;
        }
        array[index] = val.toLowerCase().trim();
    });

    if (error) return undefined; */

    return txArray;
};

exports.isValidEthTransactionHash = function (hash, res) {
    if (typeof hash !== 'string' || !/^(0x)?[0-9a-f]{64}$/i.test(hash)) {
        responses.sendErrorResponse(responses.E_TX_HASH_INVALID, res, hash);
        return false;
    }

    return true;
};

exports.isValidNumber = function (str, len) {
    return (typeof str === 'string' && /^\d+$/.test(str) && (!len || str.length <= len));
};

exports.isValidBlockNumber = function (str, res) {
    if (exports.isValidNumber(str) && str.length < 30) {
        return true;
    }
    responses.sendErrorResponse(responses.E_BLOCK_NUMBER_INVALID, res);
};

exports.isValidBlockHash = function (hash, res) {
    if (typeof hash !== 'string' || !/^(0x)?[0-9a-f]{64}$/i.test(hash)) {
        responses.sendErrorResponse(responses.E_BLOCK_HASH_INVALID, res);
        return false;
    }
    return true;
};

exports.isValidBlockHashOrNumber = function (str, res) {
    if (typeof str !== 'string') {
        responses.sendErrorResponse(responses.E_BLOCK_IDENTIFIER_INVALID, res);
        return false;
    }
    if (str.startsWith('0x')) {
        return exports.isValidBlockHash(str, res);
    }
    return exports.isValidBlockNumber(str, res);
};

exports.isValidTransactionIndex = function (str, res) {
    if (exports.isValidNumber(str) && str.length < 10) {
        return true;
    }
    responses.sendErrorResponse(responses.E_TRANSACTION_INDEX_INVALID, res);
    return false;
};

exports.isValidTransactionBinary = function (tx, res) {
    if (typeof tx === 'string' && tx.length < 10000 && /(0x)?[0-9a-f]+/i.test(tx)) {
        return true;
    }

    responses.sendErrorResponse(responses.E_TRANSACTION_BINARY_INVALID, res);
    return false;
};

exports.isValidQueryPreviousNext = function (direction, res) {
    if (typeof direction === 'string' && direction.length < 50) {
        var dirLower = direction.toLowerCase();
        if (dirLower === 'previous' || dirLower === 'next')
            return true;
    }
    // if undefined is valid -> use default value
    else if (!direction) {
        return true;
    }

    // any other thing is invalid
    responses.sendErrorResponse(responses.E_QUERY_PREVIOUS_NEXT_INVALID, res);
    return false;
};

exports.isValidQueryDirection = function (direction, res) {
    if (typeof direction === 'string' && direction.length < 50) {
        var dirLower = direction.toLowerCase();
        if (dirLower === 'ascending' || dirLower === 'descending') {
            return true;
        }
    }
    // if undefined is valid -> use default value
    else if (!direction) {
        return true;
    }

    // any other thing is invalid
    responses.sendErrorResponse(responses.E_QUERY_DIRECTION_INVALID, res);
    return false;
};

exports.parseLimit = function (limit, res) {
    if (typeof limit === 'string' && limit.length <= 2 && exports.isValidNumber(limit)) {
        return parseInt(limit, 10);
    }

    // any other thing is invalid
    responses.sendErrorResponse(responses.E_QUERY_LIMIT_INVALID, res);
    return null;
};

exports.isValidDaoToken = function (address, res) {
    if (typeof address !== 'string' || !/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        if (res) {
            responses.sendErrorResponse(responses.E_DAO_TOKEN_INVALID, res, address);
        }
        return false;
    }

    return true;
};

exports.isValidDaoProposalHash = function (address, res) {
    if (typeof address !== 'string' || !/^(0x)?[0-9a-f]{32}$/i.test(address)) {
        if (res) {
            responses.sendErrorResponse(responses.E_DAO_PROPOSAL_HASH_INVALID, res, address);
        }
        return false;
    }

    return true;
};

exports.isValidDaoProposalID = function (proposalID, res) {
    if (typeof proposalID === 'string' && exports.isValidNumber(proposalID, 18)) {
        return true;
    }

    responses.sendErrorResponse(responses.E_DAO_PROPOSAL_ID_INVALID, res, proposalID);

    return false;
};

exports.isValidArrayDaoTokens = function (addresses, res) {
    if (!Array.isArray(addresses) || addresses.length > MAX_ARRAY_LENGTH) {
        if (res) {
            responses.sendErrorResponse(responses.E_DAO_ARRAY_TOKEN_INVALID, res);
        }
        return false;
    }
    for (var i = 0; i < addresses.length; i++) {
        if (!exports.isValidDaoToken(addresses[i], res)) {
            return false;
        }
        addresses[i] = addresses[i].toLowerCase();
    }

    return true;
};

exports.isValidTransactionQuery = function (options, res) {
    if (typeof options.limit !== 'undefined' && (typeof options.limit !== 'string' || !exports.isValidNumber(options.limit))) {
        responses.sendErrorResponse(responses.E_QUERY_LIMIT_INVALID, res);
        return false;
    }
    if (typeof options.order !== 'undefined' && (typeof options.order !== 'string' || (options.order.toLowerCase() !== 'asc' && options.order.toLowerCase() !== 'desc'))) {
        responses.sendErrorResponse(responses.E_QUERY_ORDER_INVALID, res);
        return false;
    }
    if (typeof options.start !== 'undefined' && typeof options.start !== 'string') {
        responses.sendErrorResponse(responses.E_QUERY_START_INVALID, res);
        return false;
    }
    return true;
};
