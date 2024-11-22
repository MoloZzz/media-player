window.addEventListener('DOMContentLoaded', () => {
    const media = document.getElementById('media');
    const playPauseButton = document.getElementById('playPause');
    const stopButton = document.getElementById('stop');
    const backwardButton = document.getElementById('backward');
    const forwardButton = document.getElementById('forward');
    const seekBar = document.getElementById('seekBar');
    const timeDisplay = document.getElementById('timeDisplay');
    const fileInput = document.getElementById('fileInput');
    const loadVideoButton = document.getElementById('loadVideo');

    // Кнопка завантаження відео
    loadVideoButton.addEventListener('click', () => {
        fileInput.click(); // Імітуємо натискання на прихований input
    });

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            media.src = fileURL; // Встановлюємо відео як джерело
            media.load(); // Завантажуємо відео
            playPauseButton.textContent = 'Play';
        }
    });

    // Інші події для управління медіаплеєром
    playPauseButton.addEventListener('click', () => {
        if (media.paused) {
            media.play();
            playPauseButton.textContent = 'Pause';
        } else {
            media.pause();
            playPauseButton.textContent = 'Play';
        }
    });

    stopButton.addEventListener('click', () => {
        media.pause();
        media.currentTime = 0;
        playPauseButton.textContent = 'Play';
    });

    backwardButton.addEventListener('click', () => {
        media.currentTime -= 10;
    });

    forwardButton.addEventListener('click', () => {
        media.currentTime += 10;
    });

    media.addEventListener('timeupdate', () => {
        seekBar.value = (media.currentTime / media.duration) * 100 || 0;
        const currentMinutes = Math.floor(media.currentTime / 60);
        const currentSeconds = Math.floor(media.currentTime % 60);
        const totalMinutes = Math.floor(media.duration / 60);
        const totalSeconds = Math.floor(media.duration % 60);

        timeDisplay.textContent = 
            `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')} / ${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
    });

    seekBar.addEventListener('input', () => {
        media.currentTime = (seekBar.value / 100) * media.duration;
    });
});
