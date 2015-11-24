exports.commands = {

backgrounds: 'background',
background: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><font size=3><b>Sora Backgrounds</b></font><br>This is a list of past and current server backgrounds made available for you to download and use as a desktop backgrounds.<br><br>Simply browse through the images and click on the ones you would like to download, accept the external website link and the download will start automatically.<br><br><br>'+
        	
        	'<details><summary>Jeratt\'s 2013 Collection (Click me to expand)</summary><br><table style="width:100%"><tr>'+
                '<td><a href="https://www.dropbox.com/s/l0g3wm01jcdewa0/Arani%27s%20Dedication.png?dl=1"><img src="http://i.imgur.com/B0J62kf.png" width=170></a></td>'+
                '<td><a href="https://www.dropbox.com/s/3jpqyt76wch91la/Jeratt%27s%20Team.png?dl=1"><img src="http://i.imgur.com/yINqS9w.png" width=170></a></td>'+
                '<td><a href="https://www.dropbox.com/s/fk3ypvjduwqnls5/Noah%27s%20Water%20Mono.png?dl=1"><img src="http://i.imgur.com/yrzodOo.png" width=170></a></td></tr>'+
                
                '<tr><td><a href="https://www.dropbox.com/s/09349rs0w29096v/Normal%20Type.png?dl=1"><img src="http://i.imgur.com/UKYOFTL.png" width=170></a></td>'+
                '<td><a href="https://www.dropbox.com/s/pxlbeylejj0a5ec/Onyx%27s%20Rock%20Mono.png?dl=1"><img src="http://i.imgur.com/lZbrX8m.png" width=170></a></td>'+
                '<td><a href="https://www.dropbox.com/s/r79nb8rwzvflx34/Poison%20Type.png?dl=1"><img src="http://i.imgur.com/iBMDE6g.png" width=170></a></td></tr>'+
                
                '<tr><td><a href="https://www.dropbox.com/s/jr38uagsk6wyksb/Risu%27s%20Dragon%20Mono.png?dl=1"><img src="http://i.imgur.com/g4QeSP8.png" width=170></a></td>'+
                '<td>These images belong to <b>Artiste Jeratt</b>, citing is required before reusage.</tr></details>'
                );
	}
		         

};
/*'<td><a href=""><img src="" width=170></a></td>'+
                '<td><a href=""><img src="" width=170></a></td>'+
                '<td><a href=""><img src="" width=170></a></td>'+
*/
