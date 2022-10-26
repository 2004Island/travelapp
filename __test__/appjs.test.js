import { getRandomInt } from "../src/client/js/app.js";
import { queueData } from "../src/client/js/app.js";

describe('check getRandomInt is in system', function () {
    test("return true", () => {
        expect(getRandomInt).toBeDefined();
    })
})

describe('check queueData', function () {
    test("return true", () => {
        expect(queueData).toBeDefined();
    })
})