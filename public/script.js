console.log(window.location)

let path = window.location.pathname;

let tags = document.querySelectorAll('nav a');
tags.forEach(tag => {
    if (tag.getAttribute('href') === path) {
        tag.style.color = '#d58910';
    }
})