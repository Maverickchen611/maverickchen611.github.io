
var player;
var songStartTimes = []; // Time stamps for each song
var songEndTimes = []; // Time stamps for each song
var currentSongIndex = parseInt(getCookie('currentSongIndex')) || 0; // Index of the current song
//var currentSongIndex = 0; // Index of the current song
var videoId = getCookie("videoId") || getvideoid(0)
var playlistData = getGabuPlaylist(videoId)["playlist"]
var currentTime = songStartTimes[currentSongIndex]
var playerReady = false;
console.log("video id", videoId)
//console.log(getGabuPlaylist(videoId))

// Function to initialize the YouTube player
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '315',
        width: '560',
        videoId: videoId, // Replace with your video ID
        playerVars: {
            'autoplay': 1,
            'controls': 1
        },
        events: {
            'onReady': onPlayerReady
        }
    });

    function onPlayerReady(event) {
        // Player is ready, seek to the desired time
        playerReady = true
        player.seekTo(songStartTimes[currentSongIndex], true);

    }

    // Add click event listener to the "Next Song" button
    document.getElementById('nextSongButton').addEventListener('click', function () {
        // Increment the current song index
        currentSongIndex = (currentSongIndex + 1) % songStartTimes.length;
        // Seek the player to the start time of the next song
        player.seekTo(songStartTimes[currentSongIndex], true);
        setCookie('currentSongIndex', currentSongIndex, 30); // Cookie expires in 30 days
        updatePlayingUIAndScroll();
    });

    document.getElementById('previousSongButton').addEventListener('click', function () {
        // Increment the current song index
        currentSongIndex = (currentSongIndex - 1) % songStartTimes.length;
        // Seek the player to the start time of the next song
        player.seekTo(songStartTimes[currentSongIndex], true);
        // Store the current song index in a cookie
        setCookie('currentSongIndex', currentSongIndex, 30); // Cookie expires in 30 days
        updatePlayingUIAndScroll();
    });
}

function timeToSeconds(timeString) {
    var parts = timeString.split(':');
    var hours = parseInt(parts[0], 10);
    var minutes = parseInt(parts[1], 10);
    var seconds = parseInt(parts[2], 10);
    return hours * 3600 + minutes * 60 + seconds;
}




// Function to set a cookie
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Function to get a cookie
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Function to update the playlist UI and scroll to the current song row
function updatePlayingUIAndScroll() {
    try {
        const playlistRows = document.querySelectorAll('#playlistTable tr');
        const currentSongRow = playlistRows[currentSongIndex];

        // Remove 'current-song' class from all rows
        playlistRows.forEach(row => {
            row.classList.remove('current-song');
        });

        // Add 'current-song' class to the row representing the current playing song
        currentSongRow.classList.add('current-song');

        // Scroll to the current song row
        currentSongRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        console.log("current playing", currentSongIndex, playlistData[currentSongIndex].title)
        updateCurrentSong(playlistData[currentSongIndex].title)
    }
    catch (e) {
        console.log(e)

    }
}

function generatePlaylistTable(playlistData) {
    const playlistTable = document.getElementById('playlistTable');
    playlistTable.innerHTML = '';
    songStartTimes = []
    songEndTimes = []
    playlistData.forEach(item => {
        function normalize(time) {
            if (typeof (time) !== "string") {
                return
            }
            if (time.length === 5) {
                time = "00:" + time
            }
            if (time.length === 7) {
                time = "0" + time
            }
            return time
        }
        const startTime = normalize(item.start);
        const endTime = normalize(item.end);
        console.log(startTime, endTime)
        songStartTimes.push(timeToSeconds(startTime))
        songEndTimes.push(timeToSeconds(endTime))
        const title = item.title;
        var artist = item.artist;
        if (item.artist == "") {
            artist = partFindArtist(title)
        }
        if (artist == undefined) {
            artist = ""
        }

        const row = document.createElement('tr');
        const playbtn = document.createElement("button")
        playbtn.innerText = "播放"
        playbtn.addEventListener('click', function () {
            currentSongIndex = playlistData.indexOf(item)
            player.seekTo(songStartTimes[currentSongIndex], true);
            // Store the current song index in a cookie
            setCookie('currentSongIndex', currentSongIndex, 30); // Cookie expires in 30 days
            updatePlayingUIAndScroll();
        });
        row.appendChild(playbtn);

        const startTimeCell = document.createElement('td');
        startTimeCell.textContent = startTime;
        row.appendChild(startTimeCell);

        const endTimeCell = document.createElement('td');
        endTimeCell.textContent = endTime;
        row.appendChild(endTimeCell);

        const titleCell = document.createElement('td');
        titleCell.textContent = title.trim();
        row.appendChild(titleCell);

        const artistCell = document.createElement('td');
        artistCell.textContent = artist.trim();
        row.appendChild(artistCell);

        playlistTable.appendChild(row);
    });
    updatePlayingUIAndScroll();
}

document.addEventListener('DOMContentLoaded', function () {
    generatePlaylistTable(playlistData);
    var videoIndex = document.getElementById('videoIndex');
    videoIndex.textContent = getallid().length - getallid().indexOf(videoId)
});


function updateCurrentSong(title) {

    var currentSongElement = document.getElementById('currentSongTitle');
    if (title == undefined) {
        currentSongElement.textContent = "尚未更新"
        return
    }
    currentSongElement.textContent = title;
}


function changeVideo(videoId) {
    currentSongIndex = 0
    playlistData = getGabuPlaylist(videoId)["playlist"]
    generatePlaylistTable(playlistData)
    updatePlayingUIAndScroll(); // Assuming this function is defined elsewhere in your code
    player.loadVideoById({
        'videoId': videoId,
        'startSeconds': songStartTimes[currentSongIndex], // Start playing from the current song time
    });
    var videoIndex = document.getElementById('videoIndex');
    videoIndex.textContent = getallid().length - getallid().indexOf(videoId)
    setCookie("videoId", videoId, 30)
}
document.addEventListener('DOMContentLoaded', function () {
    const playlistID = getallid();
    const playerIdTable = document.getElementById('playerIdTable');

    playlistID.forEach(item => {
        const videoName = getGabuPlaylist(item).name;
        var thumbnailURL = `https://img.youtube.com/vi/${item}/0.jpg`; // Assuming you have the URL of the thumbnail for each video

        const row = document.createElement('tr');
        row.addEventListener('click', function () {
            // Call changeVideo function when a table row is clicked
            changeVideo(item); // Pass the video ID to the changeVideo function
        });
        const videoIndexCell = document.createElement('td');
        videoIndexCell.textContent = playlistID.length - playlistID.indexOf(item)
        row.append(videoIndexCell)

        const videoNameCell = document.createElement('td');
        videoNameCell.textContent = videoName;
        row.appendChild(videoNameCell);

        const thumbnailCell = document.createElement('td');
        const thumbnailImg = document.createElement('img');
        thumbnailImg.src = thumbnailURL;
        thumbnailImg.width = 200
        thumbnailCell.appendChild(thumbnailImg);
        row.appendChild(thumbnailCell);

        playerIdTable.appendChild(row); // Change playlistBody to playerIdTable

        getGabuPlaylist(item)["playlist"].forEach(song => {
            //console.log(song)
            if (song.artist != "") {
                if (!(song.title in singerData)) {
                    singerData[song.title] = song.artist
                }
            }
            storeSong(partFindKey(song.title),item)
        });
    });
    //console.log(singerData)
    console.log(songDateBase)
});


// Assuming you have already created the YouTube player 'player'

// Function to get and display the current time of the video

function autoNextSong() {
    if (!playerReady) { return }
    // Get the current time of the video
    currentTime = Math.floor(Number(player.getCurrentTime()))
    //setCookie('currentTime', currentTime.toString(), 30); // Cookie expires in 30 days
    //console.log("set currentTime to cookie" ,currentTime.toString() )
    if (currentTime >= Number(songEndTimes[currentSongIndex])) {
        currentSongIndex++
        player.seekTo(songStartTimes[currentSongIndex], true);
        setCookie('currentSongIndex', currentSongIndex, 30); // Cookie expires in 30 days
        updatePlayingUIAndScroll();
    }
    function changeSongbyTime(time) {
        for (var i = 0; i < songStartTimes.length; i++) {
            Math.floor(Number())
        }

    }
    // Display the current time wherever you want, for example, in the console
    //console.log("Current time: " + currentTime);
}


// Assuming you have already created the YouTube player 'player'

// Function to check if the player is paused or playing
function isPausedOrPlaying() {
    // Get the current state of the player
    var playerState = player.getPlayerState();

    // Check if the player state is paused (2) or playing (1)
    if (playerState === 2) {
        console.log("Player is paused");
        return "pause"
    } else if (playerState === 1) {
        console.log("Player is playing");
        return "play"
    } else {
        console.log("Player state is neither paused nor playing");
        return "error"
    }
}


// Set an interval to call the displayCurrentTime function every second (1000 milliseconds)
var timer = setInterval(autoNextSong, 1000);



function search() {
    var searchInput = document.getElementById('searchInput');
    var query = searchInput.value // Trim whitespace from the inpu
    var resultDiv = document.getElementById("result");
    if(query ==""){resultDiv.textContent = ""; return}
    console.log("serach", query)
    var queryArray = songDateBase[partFindKey(query)]["id"]
    console.log("queryArray", queryArray)
    var arrayContent = ""
    queryArray.forEach((id, index) => {
        arrayContent += getallid().length - getallid().indexOf(id) + " ";
        if ((index + 1) % 5 === 0) {
            arrayContent += "\n"; // Add a line break
        }
    })
   
    
    // Assign the content of the array to the div
    resultDiv.textContent = "搜尋結果: "+arrayContent;
}
