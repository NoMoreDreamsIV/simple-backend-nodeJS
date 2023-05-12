import './style.css'
import { createModal, isValid } from './utility';
import { Comment } from './comment';
import { authWithEmailAndPassword, getAuthForm } from './auth';

const form = document.getElementById('form');
const input = form.querySelector('#question-input');
const submitButton = form.querySelector('#submit');
const modalButton = document.querySelector('#modal-button');

form.addEventListener('submit', submitFormHandler);
input.addEventListener('input', () => {
    submitButton.disabled = !isValid(input.value);
});
window.addEventListener('load', Comment.renderList);
modalButton.addEventListener('click', openModal);

function submitFormHandler(event) {
    event.preventDefault();

    if (isValid(input.value)) {
        const comment = {
            text: input.value.trim(),
            date: new Date().toJSON()
        };

        submitButton.disabled = true;
        Comment.create(comment).then(() => {
            input.value = '';
            input.className = '';
            submitButton.disabled = false;
        })
    }
}


function openModal() {
    createModal('Авторизация', getAuthForm());
    document.getElementById('auth-form').addEventListener('submit', authFormHandler, {once: true});
}

function renderModalAfterAuth(content) {
    if (typeof content === 'string') {
        createModal('Ошибка', content)
    } else {
        createModal('Комментарии', Comment.listToHTML(content))
    }
}

function authFormHandler(event) {
    event.preventDefault();

    const email = event.target.querySelector('#email').value;
    const password = event.target.querySelector('#password').value;
    const button = event.target.querySelector('button');

    button.disabled = true;
    authWithEmailAndPassword(email, password)
        .then(Comment.fetch)
        .then(renderModalAfterAuth)
        .then(() => button.disabled = false)
}