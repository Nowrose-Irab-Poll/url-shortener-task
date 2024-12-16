// Ensure URL validation
const validateUrl = (url) => {
    const regex = /^(https?:\/\/)?([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)(:[0-9]+)?(\/.*)?$/;
    return regex.test(url);
};

// Ensure base62 Unique Id validation
const validateShortUrlKey = (shortUrlKey) => {
    if (shortUrlKey.length < 6) return false; // Ensure minimum length

    for (let i = 0; i < shortUrlKey.length; i++) {
        const c = shortUrlKey.charAt(i);
        if (!(c >= 'a' && c <= 'z') && !(c >= 'A' && c <= 'Z') && !(c >= '0' && c <= '9')) {
            return false;
        }
    }

    return true;
};

module.exports = { validateUrl, validateShortUrlKey } ;
