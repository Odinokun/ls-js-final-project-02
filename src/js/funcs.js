function createPopup(coordsX, coordsY, popup) {
    const clientWidth = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;

    // поправка координат, что бы popup не вылазил за экран
    if (coordsX > (clientWidth-390)) {
        coordsX = clientWidth-400;
    }
    if (coordsY > (clientHeight - 560)) {
        coordsY = clientHeight - 570;
    }

    popup.style.display = 'block';
    popup.style.left = coordsX + 'px';
    popup.style.top = coordsY + 'px';
}

export {
    createPopup
}