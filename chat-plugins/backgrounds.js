exports.commands = {

backgrounds: 'background',
background: function(target, room, user) {
        if (!this.runBroadcast()) return;
        this.sendReplyBox('<center><font size=3><b>Sora Backgrounds</b></font><br>This is a list of past and current server backgrounds made available for you to download and use as desktop backgrounds.<br><br>Simply browse through the images and click on the ones you would like to download, accept the external website link and the download will start automatically.<br><br><br>'+
        	
        	'<details><summary>Jeratt\'s 2013 Collection (Click me to expand)</summary><br><table style="width:100%"><tr>'+
                '<td><a href="https://www.dropbox.com/s/l0g3wm01jcdewa0/Arani%27s%20Dedication.png?dl=1"><img src="http://i.imgur.com/B0J62kf.png" width=170></a></td>'+
                '<td><a href="https://www.dropbox.com/s/3jpqyt76wch91la/Jeratt%27s%20Team.png?dl=1"><img src="http://i.imgur.com/yINqS9w.png" width=170></a></td>'+
                '<td><a href="https://www.dropbox.com/s/fk3ypvjduwqnls5/Noah%27s%20Water%20Mono.png?dl=1"><img src="http://i.imgur.com/yrzodOo.png" width=170></a></td></tr>'+
                
                '<tr><td><a href="https://www.dropbox.com/s/09349rs0w29096v/Normal%20Type.png?dl=1"><img src="http://i.imgur.com/UKYOFTL.png" width=170></a></td>'+
                '<td><a href="https://www.dropbox.com/s/pxlbeylejj0a5ec/Onyx%27s%20Rock%20Mono.png?dl=1"><img src="http://i.imgur.com/lZbrX8m.png" width=170></a></td>'+
                '<td><a href="https://www.dropbox.com/s/r79nb8rwzvflx34/Poison%20Type.png?dl=1"><img src="http://i.imgur.com/iBMDE6g.png" width=170></a></td></tr>'+
                
                '<tr><td><a href="https://www.dropbox.com/s/jr38uagsk6wyksb/Risu%27s%20Dragon%20Mono.png?dl=1"><img src="http://i.imgur.com/g4QeSP8.png" width=170></a></td></tr></table><br>'+
                '<font size=0.5>These images belong to <b>Artiste Jeratt</b>, citing is required before reusage.</font></details><br><br>'+
                
                
                '<details><summary>Jeratt\'s 2014 Collection (Click me to expand)</summary><table style="width:100%"><tr>'+
                '<td><a href="https://www.dropbox.com/s/82xvmq22aoeas3b/Bug%20Type.png?dl=1"><img src="http://i.imgur.com/SaepSCp.png" width=170></a></td>'+
                '<td><a href="https://www.dropbox.com/s/p8tcozimsnwpizz/Dark%20Type.png?dl=1"><img src="http://i.imgur.com/T7C8R0G.png" width=170></a></td>'+
                '<td><a href="https://www.dropbox.com/s/hg4fejrghcpq0k2/Dragon%20Type.png?dl=1"><img src="http://i.imgur.com/PhmyjpU.png" width=170></a></td></tr>'+
                
                '<tr><td><a href="https://www.dropbox.com/s/9gb3bl7j8g7sdyq/Electric%20Type.png?dl=1"><img src="http://i.imgur.com/9nY2thJ.png" width=170></a></td>'+
                '<td><a href="https://www.dropbox.com/s/b0tgqyr90jowdjf/Ghost%20Type.png?dl=1"><img src="http://i.imgur.com/OV7y9Xz.png" width=170></a></td>'+
                '<td><a href="https://www.dropbox.com/s/wj1ml2mfwkrfw1c/Jeratt%27s%20Dedication.png?dl=1"><img src="http://i.imgur.com/u93VDak.png" width=170></a></td></tr>'+
                
                '<tr><td><a href="https://www.dropbox.com/s/wpu4g3qu388ipdc/Onyx%27s%20Dedication.png?dl=1"><img src="http://i.imgur.com/g4GGZXw.png" width=170></a></td>'+
                '<td><a href="https://www.dropbox.com/s/kf3me6ebcaidaws/Sora%27s%20X-mas.png?dl=1"><img src="http://i.imgur.com/h3MxvAr.png" width=170></a></td>'+
                '<td><a href="https://www.dropbox.com/s/gijxahuc894odcq/Toast%27s%20Fire%20Mono.png?dl=1"><img src="http://i.imgur.com/Cc6FJwG.png" width=170></a></td></tr></table><br>'+
                '<font size=0.5>These images belong to <b>Artiste Jeratt</b>, citing is required before reusage.</font></details><br><br>'+
                
                
                '<details><summary>Jeratt\'s 2015 Collection (Click me to expand)</summary><table style="width:100%"><tr>'+
                '<td><a href="https://www.dropbox.com/s/j01f535zpgf0ycc/Electric%20Type%20Remake.png?dl=1"><img src="http://i.imgur.com/j58Ro3Z.png" width=170></a></td>'+
                '<td><a href="https://www.dropbox.com/s/aw2wn0e3hdrhrpm/Fairy%20Type.png?dl=1"><img src="http://i.imgur.com/EpBAigM.png" width=170></a></td>'+
                '<td><a href="https://www.dropbox.com/s/52mxsnfvnhgc09p/Fighting%20Type.png?dl=1"><img src="http://i.imgur.com/qkwkGTL.png" width=170></a></td></tr>'+
                
                '<tr><td><a href="https://www.dropbox.com/s/x99cjgjbwnilth5/Grass%20Type.jpg?dl=1"><img src="http://i.imgur.com/S0cfN5x.jpg" width=170></a></td></tr></table><br>'+
                '<font size=0.5>These images belong to <b>Artiste Jeratt</b>, citing is required before reusage.</font></details><br><br>'+
                
                
                '<details><summary>ABootToTheHead\'s 2015 Collection (Click me to expand)</summary><table style="width:100%"><tr>'+
                '<td><a href="https://www.dropbox.com/s/ybk5gaa4rkzf16k/Blue%20Shield.jpg?dl=1"><img src="http://i.imgur.com/APAQS7y.jpg" width=170></a></td>'+
                '<td><a href="https://www.dropbox.com/s/fbhsz5vlfwmamuf/Grey%20Shield.jpg?dl=1"><img src="http://i.imgur.com/MP37DTZ.jpg" width=170></a></td>'+
                '<td><a href="https://www.dropbox.com/s/lcsx1bqprw8bjmp/Old%20Moonlight.png?dl=1"><img src="http://i.imgur.com/sAzIMJk.png" width=170></a></td></tr>'+
                
                '<tr><td><a href="https://www.dropbox.com/s/do1kfdyrkpm7lfl/New%20Moonlight.png?dl=1"><img src="http://i.imgur.com/97FLTsX.png" width=170></a></td>'+
                '<td><a href="https://www.dropbox.com/s/l64b1vqby7knb8x/Christmas2015.png?dl=1"><img src="http://i.imgur.com/JE2lfer.png" width=170></a></td></tr></table><br>'+
                '<font size=0.5>These images belong to <b>ABootToTheHead</b>, citing is required before reusage. Please always cite Twitter account <a href="https://twitter.com/MetatyphT">@MetatyphT</a> and/or Tumblr <a href="http://metatyphtempest.tumblr.com/">Typh\'s Art Stash</a></font></details><br><br>'+
                
                '<details><summary>ABootToTheHead\'s 2016 Collection (Click me to expand)</summary><table style="width:100%"><tr>'+
                '<td><a href="https://www.dropbox.com/s/33oszwqq8gczylo/Gardevoir.png?dl=1"><img src="http://i.imgur.com/0CPvA7O.png" width=170></a></td>'+
                '<td><a href="https://www.dropbox.com/s/t8p9q63w5bwd9m1/Smeargle%2BChansey.png?dl=1"><img src="http://i.imgur.com/YIm3pLh.png" width=170></a></td></tr></table><br>'+
                '<font size=0.5>These images belong to <b>ABootToTheHead</b>, citing is required before reusage. Please always cite Twitter account <a href="https://twitter.com/MetatyphT">@MetatyphT</a> and/or Tumblr <a href="http://metatyphtempest.tumblr.com/">Typh\'s Art Stash</a></font></details>'
                );
	}
		         

};
/*'<td><a href=""><img src="" width=170></a></td>'+
                '<td><a href=""><img src="" width=170></a></td>'+
                '<td><a href=""><img src="" width=170></a></td>'+
*/
