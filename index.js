const wpcom = require('wpcom')(process.env.OAuthToken);
const queryString = require('query-string');

exports.handler = async function(event) {
    //The Twilio message comes in as Base64 encoded query string so convert to JSON
    const message = queryString.parse(Buffer.from(event.body, 'base64').toString());
    //Create a post on the blog with the SMS message
    return wpcom.site( process.env.BlogEndpoint )
                .addPost( { title: message.Body,
                            content: message.Body } );
};
