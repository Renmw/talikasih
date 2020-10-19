const supertest = require("supertest");
const app = require("../../app/main/app");
class helper {
    constructor(model) {
        this.apiServer = supertest(app);
    }
}

module.exports = helper;