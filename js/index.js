var jsmediatags = window.jsmediatags;
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
            //document.querySelector("#album").textContent = tag.tags.album;
            //document.querySelector("#genre").textContent = tag.tags.genre;
        },
        onError: function(error) {
            console.log(error)
        }
    });  
});