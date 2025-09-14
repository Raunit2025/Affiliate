const getDeviceInfo = (userAgent) => {
    const isMobile = /mobile/i.test(userAgent);
    const browser = userAgent.match(/(Chrome|Firefox|Safari|Edge|Opere)/i)?.[0] || 'unknown';
    return{
        isMobile,
        browser
    };
};

module.exports = { getDeviceInfo };