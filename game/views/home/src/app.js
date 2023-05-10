const onload = () => {
    const goToArena = element => {
        element.addEventListener('click', () => {
            const room = document.getElementById('room').value;
            if (!room) {
                alert('Wrong Room!!!');
                return;
            }

            window.open('/views/arena/?room=' + room);
        })
    }

    const start = document.getElementById('start');
    
    goToArena(start);
}

window.onload = onload;