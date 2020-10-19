const Helper = require("../helpers/_donate.helper");
const helper = new Helper();
const urlPrefix = "/v1/auth";

describe("_donate endpoint", () => {
    it("Consuming API endpoint", async () => {
        const { body } = await helper.apiServer
            .post(`${urlPrefix}/donate/campaign/1`, {
                email: "email@mailinator.com"
            })
        expect(body).toHaveProperty("amount");
        expect(body).toHaveProperty("comment");
    });
});