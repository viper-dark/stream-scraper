"use strict";
let db = null;
exports.setDatabase = (_db) => {
    db = _db;
};
const someQuery = () => new Promise((resolve) => resolve(true));
exports.queries = {
    someQuery,
};
//# sourceMappingURL=user.collection.js.map