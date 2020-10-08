// var hero
// const s = () => document.documentElement.style.scrollSnapType = hero.getBoundingClientRect().top > 0 ? 'y mandatory' : 'none'
// window.addEventListener('load', () => {
//     hero = document.getElementById('projektübersicht')
//     s()
//     window.addEventListener('scroll', s)
// })

window.addEventListener('scroll', () => document.querySelector('header').classList.toggle('stick', window.scrollY > 0))