const scrollNav = () => {
    document.querySelector('header').classList.toggle('stick', window.scrollY > 0)
    document.querySelectorAll('.page-transition').forEach(el => el.classList.toggle('stick', window.scrollY > 0))
}
window.addEventListener('load', scrollNav)
window.addEventListener('scroll', scrollNav)