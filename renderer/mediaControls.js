function playPauseMedia(media, playPauseButton, logEvent) {
    if (media.paused || media.ended) {
        media.play()
            .then(() => {
                playPauseButton.textContent = 'Pause';
                logEvent('Media playback started');
            })
            .catch((error) => {
                logEvent('Error playing media', { error: error.message });
            });
    } else {
        media.pause();
        playPauseButton.textContent = 'Play';
        logEvent('Media playback paused');
    }
}

function stopMedia(media, playPauseButton, logEvent) {
    media.pause();
    media.currentTime = 0;
    playPauseButton.textContent = 'Play';
    logEvent('Media playback stopped');
}

function seekMedia(media, seconds, logEvent) {
    const newTime = Math.max(0, Math.min(media.duration, media.currentTime + seconds));
    media.currentTime = newTime;
    logEvent('Media seeked', { newTime });
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

module.exports = {
    playPauseMedia,
    stopMedia,
    seekMedia,
    formatTime,
};
