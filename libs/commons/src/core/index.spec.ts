import { removeKeysForValues } from "."
describe('Core Utilities', () => {
    it('should remove keys from object for values in specified array', () => {
        let obj = removeKeysForValues({ a: null }, [null])
        expect(obj.a).toBeUndefined()
        obj = removeKeysForValues({ a: "a" }, [null])
        expect(obj.a).toBe("a")
    });
    it('should remove nested keys from object for values in specified array', () => {
        let obj = removeKeysForValues({ a: { b: null }, b: "a" }, [null])
        expect(obj.a).toBeDefined()
        expect(obj.a.b).toBeUndefined()
        expect(obj.b).toBe("a")
    });
})