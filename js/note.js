// Generated by LiveScript 1.2.0
var PerspNote;
PerspNote = (function(){
  PerspNote.displayName = 'PerspNote';
  var prototype = PerspNote.prototype, constructor = PerspNote;
  function PerspNote(lane, birthday, deadline, theme){
    this.lane = lane;
    this.birthday = birthday;
    this.deadline = deadline;
    this.theme = theme;
    this.h = 20;
    this.y = this.lane.start;
    this.opacity = 1;
    this.isPlaying = true;
    this.isActive = true;
    this.color = "blue";
    this.speed = 0;
    this.diff = 0;
    this.grade = 0;
    this.length = this.lane.end - this.lane.start;
  }
  prototype.pulse = function(){
    return this.opacity = 1;
  };
  prototype.draw = function(ctx, sdata){
    var theme, note, ref$, this$ = this;
    if (this.isPlaying) {
      ctx.globalAlpha = this.opacity;
      theme = find(function(x){
        return x.name === this$.theme;
      })(
      themes);
      note = sdata != null ? (ref$ = sdata.frames[theme.note]) != null ? ref$.frame : void 8 : void 8;
      ctx.drawImage(sprites, note.x, note.y, note.w, note.h, this.x, this.y - this.h / 2, this.w, this.h);
      return ctx.globalAlpha = 1;
    }
  };
  return PerspNote;
}());