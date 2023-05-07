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
const musicLst = document.querySelector(".list ol");
let lstCnt = 0;
let currIdx = 0;
// media control
const jsmediatags = window.jsmediatags;

// play event handling
audio_info.addEventListener('ended', function(e){
    // play next music if not loop mode
    if(audio_info.loop === false && currIdx + 1 < lstCnt){
        setMusic(musicFiles[++currIdx], 1);
        audio_info.autoplay = true;
    }
}, false);

// play list control
// add click event listener for each collection item

const listHighlight = (object) => {
    $(object).parent().find('li.active').removeClass('active');
    $(object).addClass('active');
}

// const setPlayItem = (idx) => {
//     console.log($(".list_ol").parent().find("li.div.select"));
//     console.log($(".list_ol").find("li[data-index=${idx}]"));
//     $(".list_ol").parent().find("li.div.selected").removeClass("selected");
//     $(".list_ol").find("li[data-index=${idx}]").addClass("selected");
// }

const itemEvent = () => {
    const musicLstItems = Array.from(document.getElementsByTagName("li"));
    musicLstItems.forEach( ( row, index ) => {
        // click setting
        row.addEventListener("click", function(e){
            listHighlight($(this));
        });

        // double click setting
        row.addEventListener("dblclick", () => {
            // just set music info
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
            //console.log(tag);
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
                lstCnt++;

                // add to playlist window
                let li = `
                    <li data-index="${lstCnt}">
                        <div class="list_row upper">
                            // <div class="select" style="display:none;">▶</div>
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
            // if(lstCnt===1){
            //     console.log("call setPlayItem");
            //     setPlayItem(lstCnt);
            // }
        },
        onError: function(error) {
            console.log(error)
        }
    });  
};

// music add 
document.querySelector(".song-input").addEventListener("change", (event) => {
    const song = event.target.files[0];
    musicFiles.push(song);
    setMusic(song, 0);
});

// option change control
var loop_check = $("input:checkbox[id='loop-switch']");
loop_check.click(function(){
    $("p").toggle();
    if(audio_info.loop === true)
        audio_info.loop = false;
    else
        audio_info.loop = true;
});

var lyric_check = $("input:checkbox[id='lyric-switch']");
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

var spectrum_check = $("input:checkbox[id='spectrum-switch']");
spectrum_check.click(function(){
    $("p").toggle();
    $(".spectrum").toggle();
});

var shuffle_check = $("input:checkbox[id='shuffle-switch']");
shuffle_check.click(function(){
    $("p").toggle();
});