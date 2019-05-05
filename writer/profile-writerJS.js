var selecteDay = document.getElementById('day');
var selectMonth = document.getElementById('month');
var selectYear = document.getElementById('year');


function generateDate(start, end, select){
	for (var i = start; i<=end; i++){
	    var opt = document.createElement('option');
	    opt.value = i;
	    opt.innerHTML = i;
	    select.appendChild(opt);
	}
}

generateDate(1,31,selecteDay);
generateDate(1,12,selectMonth);
generateDate(1980, 2000, selectYear);