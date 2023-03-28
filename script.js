

function is_shown(target) {
	var wt = $(window).scrollTop(); 
	var wh = $(window).height();
 
    var $this = $(target);
    var offset = $this.offset().top;
    var height = $this.height();

    var centerY = offset;

	//if (wt + wh >= et && wt + wh - eh * 2 <= et + (wh - eh)){
    if (wt >= centerY && wt < centerY + 1000) {
		return true;
	} else {
		return false;    
	}
}

if (is_shown('.mainList')) {
	console.log(true);
}