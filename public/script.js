//frontend js
const socket = io('/')
const videoGrid = document.getElementById('video-grid');
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
});
let flag=0;



let displayMediaOptions = {
  video: {
    cursor: "always"
  },
  audio: false
};

let myVideoStream;
const myVideo = document.createElement('video');
myVideo.muted = true;
const startElem = document.getElementById("screenshare");
const peers = {};
//let currentid;
navigator.mediaDevices.getUserMedia({                   //used to get access to webcam
  video: true,
  audio: true
}).then(stream => {                  //return a mediastream object (if no error then a stream object is recieved)
  myVideoStream=stream;
  addVideoStream(myVideo, stream);                       //user defined function

startElem.addEventListener("click",
async function startCapture() {
let stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
addVideoStream(myVideo, stream);
//socket.emit('sharescreen',stream);

myPeer.on('call', call => {
  call.answer(stream);
  const video = document.createElement('video');
  call.on('stream', userVideoStream => {    
     addVideoStream(video, userVideoStream);
  })
});
});


  myPeer.on('call', call => {
      call.answer(stream);
      const video = document.createElement('video');
      call.on('stream', userVideoStream => {    
         addVideoStream(video, userVideoStream);
      })
  
  });


socket.on('user-connected', (userId) => {
    connectToNewUser(userId, stream);
  });
})


/*
socket.on('ScreenShare',(stream,userId) => {
  connectToNewUser(userId, stream);
});*/


  // input value
  let text = $("input");
  // when press enter send message
  $('html').keydown(function (e) {                        //when a key is pressed
    if (e.which == 13 && text.val().length !== 0) {       //13 is the ascii value of enter
      socket.emit('message', text.val());
      text.val('');
      console.log(flag);
    }
  });
  socket.on("createMessage", (message,U) => {
    $("ul").append(`<li class="message"><b>${U}</b><br/>${message}</li>`);
    scrollToBottom()
  });



socket.on('user-disconnected', userId => {
  if (peers[userId]){
    peers[userId].close();
    delete peers[userId];
  }
        
});
myPeer.on('open', id => {                     //id->user id
  socket.emit('join-room', ROOM_ID, id);
});


//function definition
function connectToNewUser(userId, stream) 
{       //userId->new user id and new stream
  const call = myPeer.call(userId, stream);
  peers[userId] = call;
  const video = document.createElement('video');
  video.setAttribute("id","userId");
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  });
  call.on('close', () => {
    video.remove()
  })

}
//function definition
function addVideoStream(video, stream) {
  video.srcObject = stream;
  //event listener for video
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)                           //adding video to videoGrid
};


//on--->recieve
//emit-->send from server

const scrollToBottom = () => {
  var d = $('.main__chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}


const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const playStop = () => {
  console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
 
}

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}


function myfun() {
  var x = document.getElementById("main__right");
  if (x.style.display === "none") {
    x.style.display = "flex";

    const html = `
  <i class="fas fa-comment-alt"></i>
    <span>close chat</span>
  `
  document.querySelector('.chatbutton').innerHTML = html;


  } else {
    x.style.display = "none";
    const html = `
  <i class="fas fa-comment-alt"></i>
    <span>chat</span>
  `
  document.querySelector('.chatbutton').innerHTML = html;
  }
}

const displayusers= () =>
{
  Object.keys(peers).forEach((key,index)=>
  {
    console.log("hello");
    console.log(key);
  });
}


// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
  else if (event.target == pa) {
    pa.style.display = "none";
  }
}




// Get the modal
var  pa= document.getElementById("par");

// Get the button that opens the modal
var but = document.getElementById("sel");

// When the user clicks the button, open the modal 
but.onclick = function() {
  pa.style.display = "block";
}


