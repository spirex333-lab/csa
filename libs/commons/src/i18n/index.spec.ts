import { t } from "./index.ts";

describe("Internationalization utlities", () => {
    it('should translate to provided localte', () => {
        const res = t("Value");
        expect(res).toEqual("Value")
    });
})