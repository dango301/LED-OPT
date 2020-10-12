// var hero
// const s = () => document.documentElement.style.scrollSnapType = hero.getBoundingClientRect().top > 0 ? 'y mandatory' : 'none'
// window.addEventListener('load', () => {
//     hero = document.getElementById('projektübersicht')
//     s()
//     window.addEventListener('scroll', s)
// })

window.addEventListener('load', scrollNav)
window.addEventListener('scroll', scrollNav)
function scrollNav() {

    document.querySelector('header').classList.toggle('stick', window.scrollY > 0)
    document.querySelectorAll('.page-transition').forEach(el => el.classList.toggle('stick', window.scrollY > 0))
}