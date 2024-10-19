import ISO6391 from "iso-639-1"; // Languages
import { iso31661 as ISO3166_1 } from "iso-3166"; // Country Codes

export const getCountryFromCountryCode = (isocode) => {
    if (!isocode) return null;

    const country = ISO3166_1.find(
        (entry) => entry.alpha2 === isocode || entry.alpha3 === isocode
    );

    return country ? country.name : null; // Return the country name or null
};

export const getLanguageFromCode = (isocode) => {
    if (!isocode) return null;

    const language = ISO6391.getName(isocode);

    return language || null;
};