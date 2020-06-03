const express = require('express');

const app = express();

const http = require('http');

const server = http.createServer( app );


const bodyParser = require('body-parser');

const fullyStorage = require('fully-storage');

app.set('view engine', 'ejs' );

// create a new collection of docs for stock articles,
// if already exists the collection is not erease,
// you can explicit ask to erease collection with method: `deleteCollection( collectionName: string ): void`
fullyStorage.addCollection('articles');

app
    .use( '/public', express.static( 'public' ) )
    .use( bodyParser.urlencoded( { extended: false } ) )
;

app
    .get('/', function( request, response ) {

        response.status( 200 );

        response.type('text/html');

        const articles = [];

        // get list docs name of articles collection
        const docsname = fullyStorage.getDocsList( 'articles' );

        // for each doc name get content doc ( article )
        docsname.forEach( docname => {

            const article = fullyStorage.getDocByDocname( docname );

            articles.push( article );

        } );

        response.render('index', {
            articles: articles
        } );

    } )

    .post( '/new-article', function( request, response ) {

        response.type('json');

        const responseJSON = {
            success: true,
        };

        let statusCode = 200;
        let statusText = "Success";

        const {title, text} = request.body;

        if( title.trim().length && text.trim().length ) {

            const newArticle = {
                title: title,
                text: text,
                createAt: Date.now()
            };

            fullyStorage.addDoc(
                'articles',
                newArticle,

                // auto append a id key with a integer auto increment
                fullyStorage.AUTO_SAVE_ID
            );

            statusCode = 201;
            statusText = "Created";
            responseJSON.article = newArticle;

        } else {
            responseJSON.success = false;
            responseJSON.error = "title and text cant be empty value";
        }

        responseJSON.statusCode = statusCode;
        responseJSON.statusText = statusText;

        response.status( statusCode );

        response.json( responseJSON );

    } )
;

server.listen( 3001, function() {

    console.log('server run at: http://localhost:3001/');

} );
