const logEvent = require('./logging/logger');
const { playPauseMedia, stopMedia, seekMedia, formatTime } = require('./controllers');

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

    loadVideoButton.addEventListener('click', () => {
        logEvent('loadVideoButton clicked');
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
            try {
                const fileURL = URL.createObjectURL(file);
                media.src = fileURL;
                media.load();
                playPauseButton.textContent = 'Play';
                logEvent('File loaded successfully', { fileName: file.name });
            } catch (error) {
                logEvent('Error loading file', { error: error.message });
            }
        } else {
            logEvent('No file selected');
        }
    });

    playPauseButton.addEventListener('click', () => playPauseMedia(media, playPauseButton, logEvent));

    stopButton.addEventListener('click', () => stopMedia(media, playPauseButton, logEvent));

    backwardButton.addEventListener('click', () => seekMedia(media, -5, logEvent));

    forwardButton.addEventListener('click', () => seekMedia(media, 5, logEvent));

    media.addEventListener('timeupdate', () => {
        if (media.duration) {
            seekBar.value = (media.currentTime / media.duration) * 100;
        } else {
            seekBar.value = 0;
        }
        timeDisplay.textContent = `${formatTime(media.currentTime)} / ${formatTime(media.duration || 0)}`;
        logEvent('Time updated', { currentTime: media.currentTime });
    });

    seekBar.addEventListener('input', () => {
        const newTime = (seekBar.value / 100) * media.duration;
        media.currentTime = newTime;
        logEvent('Seek bar adjusted', { newTime });
    });
});
