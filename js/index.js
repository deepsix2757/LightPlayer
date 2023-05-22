// set global 
const player_width = 366;
const lyric_width =  366;
const play_list_width = 332;
let spectrum_width = 698;
let musicFiles = [];
// play control
const audio_info = document.getElementById("audio-controller");
const sourceLst = document.querySelector("audio");
// playlist control
const fileInput = document.querySelector(".song-input");
const musicLst = document.querySelector(".list ol");
var lstCnt = 0;
var currIdx = 0;
// media control
const jsmediatags = window.jsmediatags;
// lyric window
const lyricBox = document.querySelector(".lyric-box");
let intScroll = 0;

const autoScroll = () => {
    intScroll = setInterval(() => {
        lyricBox.scrollTo(0, audio_info.currentTime / audio_info.duration * lyricBox.scrollHeight * 0.6);
    }, 1000);
    // console.log("intScroll : " + intScroll);
};


// play event handling
audio_info.addEventListener('playing', function(e){
    // play next music if not loop mode
    const musicLstItems = Array.from(document.getElementsByTagName("li"));
    listPlaying(musicLstItems[currIdx]);

    if(scroll_check.is(":checked"))
        autoScroll();
    else
        clearInterval(intScroll);
}, false);

const setRamdom = () => {
    // console.log("shuffle lstCnt : " + lstCnt + ",Math.random() * lstCnt : " + Math.floor(Math.random() * lstCnt));
    currIdx = Math.floor(Math.random() * lstCnt);
    setMusic(musicFiles[currIdx], 1);
}


const audioEnded = () => {
    if(audio_info.loop === false){
        // console.log("ended $(#shuffle-switch).is(:checked) " + $("#shuffle-switch").is(":checked"));
        if($("#shuffle-switch").is(":checked")) {
            setRamdom();
        }
        else if(currIdx + 1 < lstCnt){
            setMusic(musicFiles[++currIdx], 1);
        } 

        audio_info.autoplay = true;
    }
}

audio_info.addEventListener('ended', function(e){
    // play next music if not loop mode
    audioEnded();
}, false);

// play list control
// add click event listener for each collection item

const listHighlight = (object) => {
    $(object).parent().find('li.active').removeClass('active');
    $(object).addClass('active');
}

const listPlaying = (object) => {
    $(object).parent().find('li.playing').removeClass('playing');
    $(object).addClass('playing');
}

const itemEvent = () => {
    const musicLstItems = Array.from(document.getElementsByTagName("li"));
    musicLstItems.forEach((row, index) => {
        // click setting
        row.addEventListener("click", function(e){
            listHighlight($(this));
        });

        // double click setting
        row.addEventListener("dblclick", () => {
            // just set music info
            // console.log("dblclick currIdx : " + currIdx + ", index : " + index );
            currIdx = index;
            setMusic(musicFiles[currIdx], 1);
            audio_info.autoplay = true;
        });
    });
}

// set music info
const setMusic = (song, option) => {
    /* 
        option
            0 : meta setting & list adding
            1 : meta setting only
    */
    const songUrl = URL.createObjectURL(song);
    jsmediatags.read(song, {
        onSuccess: function(tag) {
            // Array buffer to base64
            const data = tag.tags.picture.data;
            const format = tag.tags.picture.format;
            let base64String = "";
            for (let i = 0; i < data.length; i++) {
                base64String += String.fromCharCode(data[i]);
            }
            const blobUrl = `data:${format};base64,${window.btoa(base64String)}`;

            if(option >= 1 || lstCnt === 0){
                // Output the metadata
                document.querySelector(".album-cover-img").src = blobUrl ? blobUrl : "./images/logo.jpg";
                document.querySelector(".song-title").textContent = tag.tags.title ? tag.tags.title : "Unknown";
                document.querySelector(".artist-name").textContent = tag.tags.artist ? tag.tags.artist : "Unknown";
                document.querySelector(".audio-control").src = songUrl ? songUrl : "";
                document.querySelector(".lyric-box").textContent = (typeof tag.tags.lyrics === "undefined") ? "no lyrics" : tag.tags.lyrics.lyrics;
            }
            if(option === 0){
                ++lstCnt;
                // add to playlist window
                let li = `
                    <li data-index="${lstCnt}">
                        <div class="list_row upper">
                            <div class="select" style="display:none;">▶</div>
                            <div class="name">${tag.tags.title}</div>
                            <div class="singer">${tag.tags.artist}</div>
                            <div id="music_url_${lstCnt}" class="url" style="display:none;">${songUrl}</div>
                        </div>
                    </li>
                `;
                musicLst.insertAdjacentHTML("beforeend", li);
                // add event listener
                itemEvent();
            }
        },
        onError: function(error) {
            console.log(error)
        }
    });  
};

// music add 
fileInput.addEventListener("change", (event) => {
    const song = event.target.files;
    for(let i = 0; i < song.length; ++i){
        setMusic(song[i], 0);
        musicFiles.push(song[i]);
    }
});

// option change control
const loop_check = $("#loop-switch");
loop_check.click(function(){
    $("p").toggle();
    if(audio_info.loop === true)
        audio_info.loop = false;
    else
        audio_info.loop = true;
});

const lyric_check = $("#lyric-switch");
lyric_check.click(function(){
    $("p").toggle();
    $(".lyric").toggle();
    if(spectrum_width === (player_width + play_list_width)){
        spectrum_width += lyric_width;
    }
    else{
        spectrum_width -= lyric_width;
    }
    document.getElementById("spectrum-win").style.width = spectrum_width + "px";
});

const spectrum_check = $("#spectrum-switch");
spectrum_check.click(function(){
    $("p").toggle();
    $(".spectrum").toggle();
});

const shuffle_check = $("#shuffle-switch");
shuffle_check.click(function(){
    $("p").toggle();
    if(shuffle_check.is(":checked"))
        setRamdom();
});

const scroll_check = $("#scroll-switch");
scroll_check.click(function(){
    $("p").toggle();
    if(scroll_check.is(":checked"))
        autoScroll();
    else{
        console.log("shuffle_check intScroll : " + intScroll);
        clearInterval(intScroll);
    }
});


// keyboard shortcut add
const docKeyup = (e) => {
    switch (e.code){
        /* p for play */
        case "KeyP":
            audio_info.play();
            break;
        /* s for stop */
        case "KeyS":
            audio_info.pause();
            break;
        /* n for next song */
        case "KeyN":
        case "ArrowRight":
            audioEnded();
            break;
        /* b for before song */
        case "KeyB":
        case "ArrowLeft":
            if(shuffle_check.is(":checked"))
                setRamdom();
            else if(currIdx > 0)
                setMusic(musicFiles[--currIdx], 1);
            break;
        case "KeyO":
            $("#file-input").click();
            break;
    }
};
document.addEventListener('keyup', docKeyup, false);