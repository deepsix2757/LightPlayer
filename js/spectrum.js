import AudioMotionAnalyzer from 'https://cdn.skypack.dev/audiomotion-analyzer?min';

// audio source
const audioEl = document.getElementById('audio-controller');

// instantiate analyzer
const audioMotion = new AudioMotionAnalyzer(
    document.getElementById('spectrum-analyzer'),
    {
        source: audioEl,
        height: 240,
        mode: 3,
        barSpace: .4,
        ledBars: true,
        showScaleX: false
    }
);