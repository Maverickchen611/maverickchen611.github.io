
var player;
var songTimes = []; // Time stamps for each song
//var currentSongIndex = parseInt(getCookie('currentSongIndex')) || 0; // Index of the current song
var currentSongIndex = 0; // Index of the current song
var videoId = getvideoid(1)
var playlistData = getGabuPlaylist(videoId)["playlist"]


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
        player.seekTo(songTimes[currentSongIndex],true);
    }

    // Add click event listener to the "Next Song" button
    document.getElementById('nextSongButton').addEventListener('click', function () {
        // Increment the current song index
        currentSongIndex = (currentSongIndex + 1) % songTimes.length;
        // Seek the player to the start time of the next song
        player.seekTo(songTimes[currentSongIndex], true);
        setCookie('currentSongIndex', currentSongIndex, 30); // Cookie expires in 30 days
        updatePlayingUIAndScroll();
    });

    document.getElementById('previousSongButton').addEventListener('click', function () {
        // Increment the current song index
        currentSongIndex = (currentSongIndex - 1) % songTimes.length;
        // Seek the player to the start time of the next song
        player.seekTo(songTimes[currentSongIndex], true);
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



/*document.addEventListener('DOMContentLoaded', function () {
    // Retrieve the current song index from the cookie, default to 0 if not found
    const playlistBody = document.getElementById('playlistBody');
    console.log(playlistData)
    playlistData.forEach(item => {
        startTime = item.start
        songTimes.push(timeToSeconds(startTime))
        endTime = item.end
        title = item.title
        artist = item.artist

        console.log(startTime, endTime, title, artist);

        const row = document.createElement('tr');

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

        playlistBody.appendChild(row);
    });
    updatePlayingUIAndScroll()
});*/

function generatePlaylistTable(playlistData) {
    const playlistTable = document.getElementById('playlistTable');
    playlistTable.innerHTML = '';
    songTimes = []
    playlistData.forEach(item => {
        const startTime = item.start;
        songTimes.push(timeToSeconds(startTime))
        const endTime = item.end;
        const title = item.title;
        const artist = item.artist;

        
        const row = document.createElement('tr');
        row.addEventListener('click', function () {
            currentSongIndex = playlistData.indexOf(item)
            player.seekTo(songTimes[currentSongIndex], true);
            // Store the current song index in a cookie
            setCookie('currentSongIndex', currentSongIndex, 30); // Cookie expires in 30 days
            updatePlayingUIAndScroll();
        });


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
});


function updateCurrentSong(title) {

    var currentSongElement = document.getElementById('currentSongTitle');
    if (title === undefined) {
        currentSongElement.textContent = "尚未更新"
        return
    }
    currentSongElement.textContent = title;
}
// document.addEventListener('DOMContentLoaded', function () {
//     function handleplayingTableRowClick(event) {
//         currentSongIndex = event.target.parentElement.rowIndex - 1; // Get the row index
//         // Update currently playing song index or perform any other action as needed
//         player.seekTo(songTimes[currentSongIndex], true);
//         // Store the current song index in a cookie
//         setCookie('currentSongIndex', currentSongIndex, 30); // Cookie expires in 30 days
//         updatePlayingUIAndScroll();
//     }


//     var table = document.getElementById('playlistTable');
//     var rows = table.getElementsByTagName('tr');
//     for (var i = 0; i < rows.length; i++) {
//         rows[i].addEventListener('click', handleplayingTableRowClick);
//     }

// });

function changeVideo(videoId) {
    currentSongIndex = 0
    playlistData = getGabuPlaylist(videoId)["playlist"]
    generatePlaylistTable(playlistData)
    updatePlayingUIAndScroll(); // Assuming this function is defined elsewhere in your code
    player.loadVideoById({
        'videoId': videoId,
        'startSeconds': songTimes[currentSongIndex], // Start playing from the current song time
    });
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
    });
});






