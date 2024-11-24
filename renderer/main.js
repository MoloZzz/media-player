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
    const image = document.getElementById('image');
    
    loadVideoButton.addEventListener('click', () => {
        logEvent('loadVideoButton clicked');
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
            const extension = file.name.split('.').pop().toLowerCase();
            const unsupportedFormats = ['avi'];
            const audioFormats = ['mp3', 'wav', 'ogg', 'flac', 'aac'];
            if (unsupportedFormats.includes(extension)) {
                alert('AVI files are not supported. Please select a different format.');
                fileInput.value = '';
                return;
            }
    
            try {
                if(audioFormats.includes(extension)){
                    const fileURL = URL.createObjectURL(file);
                    media.src = fileURL;
                    media.load();
                    image.style.display = 'block';
                    media.style.display = 'none';
                    playPauseButton.textContent = 'Грати';
                    logEvent('File loaded successfully', { fileName: file.name });
                }else{
                    const fileURL = URL.createObjectURL(file);
                    media.src = fileURL;
                    media.load();
                    image.style.display = 'none';
                    media.style.display = 'block';
                    playPauseButton.textContent = 'Грати';
                    logEvent('File loaded successfully', { fileName: file.name });
                }
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
