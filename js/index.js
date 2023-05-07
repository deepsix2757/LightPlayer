// playlist control
const musicLst = document.querySelector(".list ol");
let lstCnt = 0;
// media control
const jsmediatags = window.jsmediatags;

document.querySelector(".song-input").addEventListener("change", (event) => {
    const song = event.target.files[0];
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
            // Output the metadata
            document.querySelector(".album-cover-img").src = `data:${format};base64,${window.btoa(base64String)}`;
            document.querySelector(".song-title").textContent = tag.tags.title;
            document.querySelector(".artist-name").textContent = tag.tags.artist;
            document.querySelector(".audio-control").src = songUrl;
            document.querySelector(".lyric-box").textContent = tag.tags.lyrics.lyrics;
            // add to playlist
            lstCnt++;
            let li = `
                <li data-index="${lstCnt}">
                    <div class="list_row upper">
                        <div class="name">${tag.tags.title}</div>
                        <div class="singer">${tag.tags.artist}</div>
                        <div class="url" style="display:none;">${songUrl}</div>
                    </div>
                </li>
            `;
            musicLst.insertAdjacentHTML("beforeend", li);
        },
        onError: function(error) {
            console.log(error)
        }
    });  
});

var loop_check = $("input:checkbox[id='loop-switch']");
    loop_check.click(function(){
    $("p").toggle();
    console.log($("audio-control"));
    var audio = document.getElementById("audio-controller");
    console.log(audio.loop);
    if(audio.loop === true)
        audio.loop = false;
    else
        audio.loop = true;
    console.log(audio.loop);
});

var lyric_check = $("input:checkbox[id='lyric-switch']");
    lyric_check.click(function(){
    $("p").toggle();
    $(".lyric").toggle();
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


