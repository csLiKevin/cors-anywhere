'use strict';

const corsAnywhere = require("../lib/cors-anywhere");

const isOffline = process.env.VERCEL_ENV === "development";

function getRequireHeaders() {
    if (isOffline) {
        // Allow direct access.
        return [];
    }

    return ['origin', 'x-requested-with'];
}

function getOriginWhitelist() {
    const originWhitelist = process.env.ORIGIN_WHITELIST;
    if (isOffline || !originWhitelist) {
        // Allow all origins.
        return [];
    }

    return originWhitelist.split(',');
}

const proxy = corsAnywhere.createServer({
    originWhitelist: getOriginWhitelist(),
    requireHeader: getRequireHeaders(),
    removeHeaders: [
        'cookie',
        'cookie2',

        'host',
        'x-real-ip',
        'x-vercel-deployment-url',
        'x-vercel-forwarded-for',
        'x-vercel-id',
        'x-vercel-ip-city',
        'x-vercel-ip-country',
        'x-vercel-ip-country-region',
        'x-vercel-ip-latitude',
        'x-vercel-ip-longitude',
        'x-vercel-ip-timezone',
    ],
    redirectSameOrigin: true,
    httpProxyOptions: {
        xfwd: false,
    }
});

export default async function handler(request, response) {
    proxy.emit('request', request, response);
}
