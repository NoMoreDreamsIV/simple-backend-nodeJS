export class Comment {
    static create(comment) {
        return fetch('https://simple-backend-db-default-rtdb.firebaseio.com/comments.json', {
            method: 'POST',
            body: JSON.stringify(comment),
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(response => {
                comment.id = response.name;
                return comment;
            })
            .then(addToLS)
            .then(Comment.renderList)
    }

    static fetch(token) {
        if (!token) {
            return Promise.resolve('<p class="error">Нет токена</p>')
        }
        return fetch(`https://simple-backend-db-default-rtdb.firebaseio.com/comments.json?auth=${token}`)
            .then(response => response.json())
            .then(response => {
                if (response && response.error) {
                    return `<p class="error">${response.error}</p>`
                }
                return response ? Object.keys(response).map(key => ({
                    ...response[key],
                    id: key
                })) : []
            })
    }

    static renderList() {
        const comments = getCommentsFromLS();
        const html = comments.length ? comments.map(toCard).join('') : `<div class="mui--text-headline">Комментариев нет</div>`;

        const list = document.getElementById('list');
        list.innerHTML = html;
    }

    static listToHTML(comments) {
        return comments.length ? `<ol>${comments.map(el => `<li>${el.text}</li>`).join('')}</ol>` : '<p>Комментариев нет<p/>'
    }
}

function addToLS(comment) {
    const all = getCommentsFromLS();
    all.push(comment);
    localStorage.setItem('comments', JSON.stringify(all));
}

function getCommentsFromLS() {
    return JSON.parse(localStorage.getItem('comments') || '[]');
}

function toCard(comment) {
    return `
        <div class="mui--text-black-54">
            ${new Date(comment.date).toLocaleDateString()}
            ${new Date(comment.date).toLocaleTimeString()}
        </div>
        <div>
            ${comment.text}
        </div>
        <br>
    `
}