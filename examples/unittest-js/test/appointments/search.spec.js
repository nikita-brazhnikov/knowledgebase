const mock = jest.mock;
mock('../../src/services/security');
mock('../../src/services/appointments/db');

const security = require('../../src/services/security');
const db = require('../../src/services/appointments/db');
const service = require('../../src/services/appointments/search');

describe('doSearch', () => {
    describe('security check', () => {
        beforeEach(() => {
        })
        it('should throw exception', async () => {
            security.isSearchLimitExceeded.mockResolvedValue(true);
            await expect(service.doSearch('foo', {})).toReject();
        })
        it('should pass exception', async () => {
            security.isSearchLimitExceeded.mockResolvedValue(false);
            db.query.mockResolvedValue([]);
            await expect(service.doSearch('foo', {})).toResolve();
        })
    });
    describe('find using index', () => {
        let result;
        beforeEach(async () => {
            security.isSearchLimitExceeded.mockResolvedValue(false);

            db.query.mockReset()
            db.query.mockResolvedValue([]);

            result = await service.doSearch('foo', {index: 'value'})
        });
        it('should return array of results', async () => {
            expect(result).toBeArray();
        });
        it('should make correct request to the db', async () => {
            expect(db.query).toHaveBeenCalled();
            expect(db.query).toHaveBeenCalledWith(expect.objectContaining({
                ExpressionAttributeValues: {
                    [':value']: 'value'
                }
            }))
        })
    })
})