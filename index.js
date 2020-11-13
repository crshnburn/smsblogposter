const wpcom = require('wpcom')(process.env.OAuthToken);
const wpapi = require('wpapi');
const queryString = require('query-string');

exports.handler = async function(event) {
    //The Twilio message comes in as Base64 encoded query string so convert to JSON
    const message = queryString.parse(Buffer.from(event.body, 'base64').toString());
    //Create a post on the blog with the SMS message
    //Use the message text as the blog title and content
    if(process.env.SelfHosted === "true"){
        const wp = new wpapi({
            endpoint: process.env.BlogEndpoint,
            username: process.env.Username,
            password: process.env.Password
        });
        wp.posts().create({
            title: `New SMS Message from ${message.From}`,
            content: message.Body,
            categories: [37],
            status: 'publish'
        }).then(console.log).catch(console.log);
        return {
            "isBase64Encoded": false,
            "statusCode": 200,
            "headers": { "Content-Type": "application/xml"},
            "body": "<Response></Response>"
        };
    } else {
        return wpcom.site(process.env.BlogEndpoint)
                    .addPost({
                        title: message.Body,
                        content: message.Body 
                    });
    }
};
