amr-player
play remote amr format audio with JavaScript  

License: This is a fork of "https://github.com/alex374/amr-player" and this work is dedicated to the public domain and is free for all uses, commercial or otherwise. No form of credit required.

inpired by https://github.com/yxl/opencore-amr-js  

-- AmrPlayer --

props:   
  >bool canPlay   
  >bool isPlaying
  
methods:   
  >load(url)   
  >play()   
  >stop()   
  >playback()   
  >setOnEnded(callback)   
  >setOnLoaded(callback)   
  >setOnProgress(callback)

usage:
    <script src="dir/amrnb.js"></script>
    <script src="dir/amrplayer.js"></script>
	  
	var player = new AmrPlayer();
	player.setOnLoaded(function(p){ p.play() })
		.setOnEnded(function(p){ console.log("Ended") })
		.setOnProgress(function(e){ console.log(e) })
		.load('http://example.com/audio.amr');
		
	// player.stop();
	// player.playback();
