import mostVisible from 'most-visible'
import jump from 'jump.js'
// import preload from 'preload-js'

var
    _sections: NodeListOf<HTMLElement>,
    sections: Array<HTMLElement>,
    contentLI: NodeListOf<Element>,
    contentLinks: NodeListOf<Element>,
    asideContent: Element,
    tableToggle: Element,
    table: HTMLElement,
    container: HTMLElement,
    figures: HTMLElement[],
    floatingFigs: HTMLElement[],
    modal: HTMLElement,
    modalImg: HTMLImageElement,
    title: HTMLElement,
    link: HTMLAnchorElement,
    figIndex = 0,
    figInfo = []
const pages = ['home', 'leuchtdioden', 'datensätze', 'optimierung', 'impressum']

// if (window.location.hash == '')
//     Array.from(document.getElementsByClassName('page-transition')).forEach(el => el.classList.add('hide'))


window.onload = pageLoad
function pageLoad() {

    console.log('%c' + 'Welcome!', 'font-weight: 900; color: lightblue')
    Array.from(document.getElementsByClassName('page-transition')).forEach(el => el.classList.add('loaded'))


    // let queue = new preload.LoadQueue(false)
    // let images = Array.from(document.querySelectorAll('main article img'))
    // let imgInfos = []

    // images.forEach(img => {
    //     let src = img.getAttribute('data-src')
    //     let alt = (<HTMLImageElement>img).alt
    //     let imgSrc = img.getAttribute('data-imgSrc')
    //     let parent = img.parentNode
    //     imgInfos.push({ src, alt, imgSrc, parent })
    // })

    // imgInfos.forEach(img => queue.loadFile(img.src))
    // queue.on('fileload', (event) => {
    //     let src = event.item.src
    //     let img = <HTMLImageElement>images.find(i => i.getAttribute('data-src') == src)
    //     console.log(img.alt)
    //     img.src = src

    //     // resize()
    //     // window.onresize = resize
    // })
    // queue.on('complete', () => {

    figures = Array.from(document.getElementsByTagName('figure'))
    floatingFigs = figures.filter(fig => fig.hasAttribute('data-isFloating'))
    modal = <HTMLElement>document.querySelector('.modal')
    modalImg = <HTMLImageElement>document.querySelector('.modal img')
    title = document.querySelector('.modal h4')
    link = <HTMLAnchorElement>document.querySelector('.modal a')
    document.querySelectorAll('.modal img.slider').forEach((slider, i) => slider.addEventListener('click', () => enlargeImg(figIndex + (i == 0 ? -1 : 1))))
    figures.forEach((fig, i) => {
        const img = <HTMLImageElement>fig.firstElementChild.firstElementChild
        const imgSrc = img.getAttribute('data-imgSrc')
        figInfo.push({
            src: img.src,
            alt: img.alt,
            imgSrc,
            href: imgSrc.substring(0, imgSrc.indexOf(' '))
        })
        fig.addEventListener('click', () => enlargeImg(i))
    })

    // })


    const n = pages.indexOf(Array.from(document.getElementsByTagName('main'))[0].getAttribute('data-namespace'))
    Array.from(document.querySelectorAll('header nav a')).forEach((navLink, i) => navLink.classList.toggle('active', i == n))

    _sections = document.querySelectorAll('section')
    sections = Array.from(_sections)
    asideContent = document.querySelector('aside.content')
    contentLI = asideContent.querySelectorAll('li')
    contentLinks = asideContent.querySelectorAll('li a')
    table = asideContent.querySelector('.table-of-contents')
    container = document.querySelector('main .container')
    scrollVisibility()
    window.onscroll = scrollVisibility


    tableToggle = document.querySelector('aside.content a.toggle')
    tableToggle.addEventListener('click', () => toggleAside())

    if (modal) modal.addEventListener('click', e => hideImg(<HTMLElement>e.target))


    Array.from(document.querySelectorAll('.info-box .content h4')).forEach(h4 => {

        function toggleInfoBox(h4: Element) {
            const infoBox = h4.parentElement.parentElement
            const isExpanded = infoBox.getAttribute('data-isExpanded') == 'true'
            infoBox.style.maxHeight = isExpanded ? `${(<HTMLElement>h4).offsetHeight}px` : '1000vh'
            infoBox.setAttribute('data-isExpanded', isExpanded ? 'false' : 'true')
        }

        toggleInfoBox(h4)
        h4.addEventListener('click', () => toggleInfoBox(h4))
    })

    resize()
    window.onresize = resize
    let target = document.getElementById(window.location.hash.substring(1))
    jump(target, { offset: -45 })
}


function toggleAside(forcedState = undefined) {

    const originalState = tableToggle.getAttribute('data-collapsed') == 'true'
    if (forcedState && forcedState == originalState) return

    const isCollapsed = forcedState != undefined ? forcedState : !originalState
    tableToggle.setAttribute('data-collapsed', isCollapsed ? 'true' : 'false')
    tableToggle.innerHTML = isCollapsed ? '🢚 OUT' : '🢘 IN'
    asideContent.classList.toggle('collapsed', isCollapsed)

    setTimeout(() => {
        table.classList.add('smooth-top')
        scrollVisibility()
        setTimeout(() => {
            table.classList.remove('smooth-top')
        }, 150);
        // resize()
    }, 333)
}


function enlargeImg(n: number) {

    if (n >= figInfo.length) figIndex = 0
    else if (n < 0) figIndex = figInfo.length - 1
    else figIndex = n

    const info = figInfo[figIndex]
    modal.classList.add('show')

    modalImg.src = info.src
    modalImg.alt = info.alt
    title.innerHTML = info.alt
    if (info.href) {
        link.style.display = 'initial'
        link.innerHTML = info.imgSrc
        link.href = info.href
    } else
        link.style.display = 'none'
}
function hideImg(el: HTMLElement) {

    if (el.tagName != 'a' && !el.classList.contains('slider'))
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
    const pos = -top + 45 - tableHeight / 2 + window.innerHeight / 2  //pos = yPos on screen + 45px navHeight and center table on screen

    let y: number
    if (pos < 0)
        y = 0
    else {
        if (bottom < window.innerHeight / 2 + tableHeight / 2) y = containerHeight - tableHeight
        else y = pos
    }
    table.style.top = `${y}px`
}


const
    minP = 600,
    maxP = 800,
    minImg = 250,
    maxImg = 450,
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
function resize() {

    toggleAside(window.innerWidth < 992)

    const totalW = document.querySelector('article').getBoundingClientRect().width
    const availableW = totalW - 2 * 45 - 20 // total minus section padding and figure margin

    if (availableW - minImg < minP) { // both text and img would become too small
        floatingFigs.forEach(fig => changeOrder(fig, true))
        if (window.innerWidth < 500) //mobile
            floatingFigs.forEach(fig => fig.style.width = 'auto')
    } else {
        let finalW = minImg + .5 * (availableW - minP - minImg) //distribute space evenly

        while (finalW > maxImg) finalW--
        //FIXME: while (availableW - finalW > maxP) finalW++ // if text is has enough space too reach maximum (800px) then give the remaining space to img

        floatingFigs.forEach(fig => {
            fig.style.width = finalW + 'px'
            changeOrder(fig, false)
        })
    }
    scrollVisibility()
}

