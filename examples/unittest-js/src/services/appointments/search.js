const db = require('./db');
const helpers = require('./helpers');
const security = require('../security');

async function findUsingIndex(filter) {
    const dbRequest = {
        KeyExpression: 'partitionKey = :pk and begins_with(indexedValue, :value)',
        ExpressionAttributeValues: { ':pk': filter.department, ':value': filter.index },
    }
    return await db.query(dbRequest)
}

async function findAndFilter(filter) {
    const {filterExpression, namesMapping, valuesMapping} = helpers.buildDbFilter(filter);
    return await db.query({
        KeyExpression: 'partitionKey = :pk',
        FilterExpression: filterExpression,
        ExpressionAttributeValues: {
            ':pk': filter.department,
            ...valuesMapping,
        },
        ExpressionAttributeNames: namesMapping,
    })
}

function canUseIndex(filter) {
    return !!filter['index']
}

async function doSearch(userId, filter) {
    if (await security.isSearchLimitExceeded(userId)) {
        throw { message: 'Stop DDoSing'}
    }
    if (canUseIndex(filter)) {
        return await findUsingIndex(filter);
    }
    return await findAndFilter(filter);
}

module.exports = {
    doSearch,
}