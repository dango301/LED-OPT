var cards: Array<Element> = []
var cardLeaveTimeout = null

window.onload = () => {

    cards = [...document.getElementsByClassName('card')]
    cards.forEach((card) => card.addEventListener('mousemove', e => cardAnim(<MouseEvent>e, <HTMLElement>card)))
    cards.forEach((card) => card.addEventListener('mouseleave', () => cardLeave(<HTMLElement>card)))
    console.log(cards);
}

function cardAnim(e: MouseEvent, el: HTMLElement) {

    const perspec = 20
    let
        w = el.offsetWidth,
        h = el.offsetHeight,
        mouseX = e.clientX - el.offsetLeft - w / 2,
        mouseY = e.clientY - el.offsetTop - h / 2,
        mousePX = mouseX / w,
        mousePY = mouseY / h,
        rX = mousePX * perspec,
        rY = mousePY * -perspec

    clearTimeout(cardLeaveTimeout)
    if (rX < 0) rX = rX
    el.style.transform = `rotateY(${rX}deg) rotateX(${rY}deg)`
}

function cardLeave(el: HTMLElement) {
    cardLeaveTimeout = setTimeout(() => el.style.transform = 'rotateY(0deg) rotateX(0deg)', 1250)
}