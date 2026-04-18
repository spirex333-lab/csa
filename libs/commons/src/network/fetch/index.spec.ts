import { API_DOMAIN, API_URL, customFetch, fromURIToAPIURL, fromURIToImageURL } from ".";

describe('Network utilities', () => {
    it('should convert plain uri to api url ', () => {
        expect(fromURIToAPIURL("/users").includes(API_URL)).toBeTruthy()
    });

    it('should not convert url to api url ', () => {
        expect(fromURIToAPIURL("proto://site.com/api/path").includes(API_URL)).toBeFalsy()
    });

    it('should convert plain uri to image url ', () => {
        expect(fromURIToImageURL("/users").includes(API_DOMAIN)).toBeTruthy()
    });

    it('should not convert url to image url ', () => {
        expect(fromURIToImageURL("proto://site.com/api/path").includes(API_DOMAIN)).toBeFalsy()
    });

    it('should fetch data from url', async () => {
        const data = await customFetch("/");
        if (typeof fetch !== "undefined") {
            expect(data).toBeDefined()
        } else {
            expect(data).toBeUndefined()

        }
    });
});