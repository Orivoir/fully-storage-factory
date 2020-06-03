function prepareAppend() {

    const emptyAricles = document.querySelector('.empty-articles');

    emptyAricles.classList.add('hide');

    const listArticles = document.createElement('ul');

    listArticles.classList.add('articles-list')

    const wrapArticlesList = document.querySelector('.wrap-articles-list');

    wrapArticlesList.appendChild( listArticles );
}

function appendArticle( { title, text } ) {

    let articlesList = document.querySelector('.articles-list');

    if( !articlesList ) {
        // first append
        prepareAppend();
    }

    articlesList = document.querySelector('.articles-list');

    const item = document.createElement('li');

    item.classList.add('article-item');

    item.innerHTML = `
        <div>
            <h2>
                ${title}
            </h2>

            <p>
                ${text}
            </p>
        </div>
    `;

    articlesList.appendChild( item );
}

function showError( message ) {

    const formError = document.querySelector('.form-error');

    formError.textContent = message;

    formError.classList.remove('hide');

}

function hideError() {

    const formError = document.querySelector('.form-error');

    formError.textContent = "";

    formError.classList.add('hide');
}

document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('form').addEventListener('submit', function( e ) {

        e.preventDefault();

        const text = this['text'].value;
        const title = this['title'].value;

        this['title'].value = '';
        this['text'].value = '';

        this['title'].focus();

        fetch( this.getAttribute('action'),  {

            method: 'POST',
            body: `text=${text}&title=${title}`,

            headers: {

                'Content-Type': 'application/x-www-form-urlencoded'
            }
        } )
        .then( async response => {

            const data = await response.json();

            if( data.statusCode === 201 ) { // Created!

                appendArticle( data.article );

            } else {

                const {error} = data;
                showError( error );
            }
        } )
        .catch( error => {

            console.error( error );
            throw "fetch post article have fail";

        } );
    } )

} );
