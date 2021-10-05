import { https } from "firebase-functions";
import CORS from 'cors';
const cors = CORS({ origin: true });
import { load } from 'cheerio';
import fetch from 'node-fetch';
import getUrls from 'get-urls';

import scrapeImages from './scrapeimages.js';

/*
    Remark

    With this strategy, javascript will not be executed on the website that we request. For example,
    in react, the content isn't rendered until the javacript is executed, but by using cheerio and node-fetch
    we won't be able to get the dynamic content that's rendered by javascript because there fast.

    But still, this won't cause any problem for a link preview, because we be working with meta tags, 
    which are pre-rendered. 
*/


// text : it could be a tweet that has a couple of urls.
const scrapeMetaTags = function(text){

    const urls = Array.from(getUrls(text));
    const requests = urls.map( async (url) => {
        const res = await fetch(url);
        const html = await res.text();
        const $ = load(html);

        // For meta tags, there might be multiple formats included on a single website, there might be
        // tags for open graph or twitter. But in our case that's not important, we will be looking for the
        // first available meta tag using this function : 
        const getMetaTags = (name) => {
            return (
                $(`meta[name=${name}]`).attr('content') ||
                $(`meta[property="og:${name}"]`).attr('content') ||
                $(`meta[property="twitter:${name}"]`).attr('content')
            );
        }

        // But we could execute that javascript code using a browser environment : puppeteer

        return {
            url,
            title : $('title').first().text(),
            favicon : $('link[rel="shortcut icon"]').attr('href'),
            description : getMetaTags('description'),
            image : getMetaTags('image'),
            author : getMetaTags('author')
        }
    });

    return Promise.all(requests);

}


export const scraper = https.onRequest((req, res) => {
    // we wrap it in cors to ensure that could be call succefully from any front-end application.
    cors(req, res, async () => {
        const body = JSON.parse(req.body);
        try {
            const data = await scrapeMetaTags(body.text);
            //const data = await scrapeImages(body.username);
            res.send(data);
        } catch(e) {
            res.send({ message : e.message });
        }

    })
});