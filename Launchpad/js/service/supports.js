var alphabets = [{value:'a',label:'A'},
				{value:'b',label:'B'},
				{value:'c',label:'C'},
				{value:'d',label:'D'},
				{value:'e',label:'E'},
				{value:'f',label:'F'},
				{value:'g',label:'G'},
				{value:'h',label:'H'},
				{value:'i',label:'I'},
				{value:'j',label:'J'},
				{value:'k',label:'K'},
				{value:'l',label:'L'},
				{value:'m',label:'M'},
				{value:'n',label:'N'},
				{value:'o',label:'O'},
				{value:'p',label:'P'},
				{value:'q',label:'Q'},
				{value:'r',label:'R'},
				{value:'s',label:'S'},
				{value:'t',label:'T'},
				{value:'u',label:'U'},
				{value:'v',label:'V'},
				{value:'w',label:'W'},
				{value:'x',label:'X'},
				{value:'y',label:'Y'},
				{value:'z',label:'Z'},
				];
var deniedPath = [
                {value:'/a'},
				{value:'/b'},
				{value:'/c'},
				{value:'/d'},
				{value:'/e'},
				{value:'/f'},
				{value:'/g'},
				{value:'/h'},
				{value:'/i'},
				{value:'/j'},
				{value:'/k'},
				{value:'/l'},
				{value:'/m'},
				{value:'/n'},
				{value:'/o'},
				{value:'/p'},
				{value:'/q'},
				{value:'/r'},
				{value:'/s'},
				{value:'/t'},
				{value:'/u'},
				{value:'/v'},
				{value:'/w'},
				{value:'/x'},
				{value:'/y'},
				{value:'/z'},
				];				
function checkPathForAnim(path){
  var flag =false;
  for (var i = 0; i < deniedPath.length; i++) {
  	if(deniedPath[i].value == path){
  		flag = true;
  	}
  };
  return flag;
}