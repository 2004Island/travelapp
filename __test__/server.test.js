import { serverlink } from '../src/client/js/app';  

describe('check post route is correct', function () {
    test("return true", () => {
        const output = "http://localhost:4202/all_data"
        expect(serverlink).toEqual(output)
    })
})
