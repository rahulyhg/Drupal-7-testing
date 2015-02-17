var inProgress = false;
function fbloader_start(){
  animEl = document.querySelector( '.' + 'fb-anim' );
  console.log(animEl.outerHTML);
  classie.add( animEl, 'la-animate' );
  if( inProgress ) return false;
    inProgress = true;
}
function fbloader_stop(){
  animEl = document.querySelector( '.' + 'fb-anim' );
  classie.remove( animEl, 'la-animate' );
  inProgress = false;
}