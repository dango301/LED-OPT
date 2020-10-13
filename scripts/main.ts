import mostVisible from 'most-visible'

var
    _sections: NodeListOf<HTMLElement>,
    sections: Array<HTMLElement>,
    contentLI: NodeListOf<Element>,
    contentLinks: NodeListOf<Element>,
    table: HTMLElement,
    container: HTMLElement,
    figures: HTMLElement[],
    modal: HTMLElement,
    modalImg: HTMLImageElement,
    title: HTMLElement,
    link: HTMLAnchorElement
const pages = ['home', 'leuchtdioden', 'datensätze', 'optimierung', 'impressum']

if (window.location.hash == '')
    Array.from(document.getElementsByClassName('page-transition')).forEach(el => el.classList.add('hide'))

window.onload = pageLoad
function pageLoad() {

    console.log('%c' + 'Welcome!', 'font-weight: 900; color: lightblue')
    Array.from(document.getElementsByClassName('page-transition')).forEach(el => el.classList.add('loaded'))


    const n = pages.indexOf(Array.from(document.getElementsByTagName('main'))[0].getAttribute('data-barba-namespace'))
    Array.from(document.querySelectorAll('header nav a')).forEach((navLink, i) => navLink.classList.toggle('active', i == n))

    _sections = document.querySelectorAll('section')
    sections = Array.from(_sections)
    contentLI = document.querySelectorAll('aside.content li')
    contentLinks = document.querySelectorAll('aside.content li a')
    table = document.querySelector('aside.content .table-of-contents')
    container = document.querySelector('main .container')
    scrollVisibility()
    window.onscroll = scrollVisibility

    figures = Array.from(document.getElementsByTagName('figure'))
    modal = <HTMLElement>document.querySelector('.modal')
    modalImg = <HTMLImageElement>document.querySelector('.modal img')
    title = document.querySelector('.modal h4')
    link = <HTMLAnchorElement>document.querySelector('.modal a')
    figures.forEach(fig => fig.addEventListener('click', () => enlargeImg(<HTMLImageElement>fig.firstElementChild.firstElementChild)))
    if (modal) modal.addEventListener('click', e => hideImg(<HTMLElement>e.target))
    resize()
    window.onresize = resize
}


function enlargeImg(img: HTMLImageElement) {
    const imgSrc = img.getAttribute('data-imgSrc')

    modal.classList.add('show')
    modalImg.src = img.src
    modalImg.alt = img.alt
    title.innerHTML = img.alt
    link.innerHTML = imgSrc
    link.href = imgSrc.substring(0, imgSrc.indexOf(' '))
}
function hideImg(el: HTMLElement) {

    if (el.tagName != 'a')
        modal.classList.remove('show')
}


function scrollVisibility() {

    const visEl = mostVisible(_sections)
    const n = sections.indexOf(visEl)
    contentLI.forEach((link, i) => link.classList.toggle('active', i == n))
    contentLinks.forEach((link, i) => link.classList.toggle('active', i == n))

    const { top, bottom } = container.getBoundingClientRect()
    const containerHeight = bottom - top
    const tableHeight = table.offsetHeight
    const pos = -top + 45 + tableHeight / 2
    table.style.top = `${pos < 0 ? 0 : bottom < (tableHeight * 1.5 + 45) ? containerHeight - tableHeight : pos}px`
}


const
    minP = 650,
    maxP = 800,
    minImg = 400,
    maxImg = 600,
    changeOrder = (fig: HTMLElement, pushDown: boolean) => { //TODO: set max height
        const section = fig.parentNode
        const isFloating = fig.getAttribute('data-isFloating') == 'true'

        if (pushDown && fig.nextElementSibling && isFloating) {
            fig.style.float = 'none'
            fig.style.width = (.5 * (minImg + maxImg)) + 'px'
            section.insertBefore(fig, fig.nextElementSibling.nextElementSibling)
            fig.setAttribute('data-isFloating', 'false')
        } else if (!pushDown && fig.previousElementSibling && !isFloating) {
            fig.style.float = 'right'
            section.insertBefore(fig, fig.previousElementSibling)
            fig.setAttribute('data-isFloating', 'true')
        }
    }
function resize() { //TODO: if aspect ratio too wide make it go under text

    const totalW = document.querySelector('article').getBoundingClientRect().width
    const availableW = totalW - 2 * 45 - 20 // total minus section padding and figure margin

    if (availableW - minImg < minP) { // both text and img would become too small
        figures.forEach(fig => changeOrder(fig, true))
    } else {
        let finalW = minImg + .5 * (availableW - minP - minImg) //distribute space evenly

        while (finalW > maxImg) finalW--
        //FIXME: while (availableW - finalW > maxP) finalW++ // if text is has enough space too reach maximum (800px) then give the remaining space to img

        figures.forEach(fig => {
            fig.style.width = finalW + 'px'
            changeOrder(fig, false)
        })
    }
}

