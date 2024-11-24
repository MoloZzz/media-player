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
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            tabButtons.forEach((btn) => btn.classList.remove('active'));
            tabContents.forEach((content) => content.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    document.getElementById('loadStream').addEventListener('click', () => {
        const streamURL = document.getElementById('streamURL').value.trim();
        const youtubeRegex = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&?/\s]+)/;

        const youtubePlayer = document.getElementById('youtubePlayer');
        const streamMedia = document.getElementById('streamMedia');

        if (youtubeRegex.test(streamURL)) {
            const videoId = streamURL.match(youtubeRegex)[1];

            youtubePlayer.innerHTML = `<iframe width="100%" height="390" 
                src="https://www.youtube.com/embed/${videoId}" 
                frameborder="0" allowfullscreen></iframe>`;
            youtubePlayer.style.display = 'block';
            streamMedia.style.display = 'none';
        } else if (streamURL.endsWith('.m3u8')) {
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(streamURL);
                hls.attachMedia(streamMedia);
                streamMedia.style.display = 'block';
                youtubePlayer.style.display = 'none';
            } else {
                alert('Ваш браузер не підтримує HLS.');
            }
        } else {
            alert('Будь ласка, введіть дійсний URL потоку.');
        }
    });

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
