// Generated by LiveScript 1.2.0
var Level;
Level = (function(){
  Level.displayName = 'Level';
  var prototype = Level.prototype, constructor = Level;
  function Level(meta){
    this.meta = meta;
    this.audio = new buzz.sound(this.meta.src);
    this.drum = new buzz.sound("/audio/drum.mp3");
    this.sheetProto = this.meta.sheet;
    this.sheet = clone$(this.sheetProto);
    this.bpm = this.meta.bpm;
    this.leadTime = this.meta.leadTime;
    this.measure = this.meta.measure;
    this.vp = new Vector(settings.screenW / 2, 0);
    this.initPerspective();
    this.lanes = {
      's': new PerspLane('s', settings.margin, settings.laneW, this.vp, this.ap),
      'd': new PerspLane('d', settings.margin + settings.laneW, settings.laneW, this.vp, this.ap),
      'f': new PerspLane('f', settings.margin + settings.laneW * 2, settings.laneW, this.vp, this.ap),
      'space': new PerspLane('space', settings.margin + settings.laneW * 3, settings.laneW, this.vp, this.ap),
      'j': new PerspLane('j', settings.margin + settings.laneW * 4, settings.laneW, this.vp, this.ap),
      'k': new PerspLane('k', settings.margin + settings.laneW * 5, settings.laneW, this.vp, this.ap),
      'l': new PerspLane('l', settings.margin + settings.laneW * 6, settings.laneW, this.vp, this.ap)
    };
    this.init(this);
  }
  prototype.initPerspective = function(){
    var l3, l4;
    this.bottomLeft = new Vector(settings.laneW, settings.finishline);
    this.bottomRight = new Vector(settings.screenW - settings.laneW, settings.finishline);
    this.l1 = new ImplicitLine(this.bottomLeft, this.vp);
    this.l2 = new ImplicitLine(this.bottomRight, this.vp);
    this.topLeft = new Vector(this.l1.findX(settings.startline), settings.startline);
    this.topRight = new Vector(this.l2.findX(settings.startline), settings.startline);
    l3 = new ImplicitLine(this.bottomRight, this.topLeft);
    l4 = new ImplicitLine(this.bottomLeft, this.topRight);
    return this.ap = new Vector(l4.findX(this.vp.y), this.vp.y);
  };
  prototype.beatDur = function(beat){
    return 60 * beat / this.bpm;
  };
  prototype.beatToTime = function(beat){
    return state.timeStartLevel + this.beatDur(beat);
  };
  prototype.beatInc = function(beat){
    return beat += 1;
  };
  prototype.spawnNote = function(lane){
    var deadlineBeat, deadline;
    deadlineBeat = state.currBeat + this.measure;
    deadline = this.beatToTime(deadlineBeat);
    return new PerspNote(lane, this.audio.getTime(), deadline, this.meta.theme);
  };
  prototype.ageOfNote = function(note){
    return (this.audio.getTime() - note.birthday) / (note.deadline - note.birthday);
  };
  prototype.gradeNote = function(note){
    note.diff = this.audio.getTime() - note.deadline;
    return note.grade = settings.grade(note.diff);
  };
  prototype.ageToPersp = function(age){
    var p1, l;
    p1 = new Vector(age * settings.laneW * 7 + settings.margin, settings.finishline);
    l = new ImplicitLine(p1, this.ap);
    return l.pointFromIntersectionWith(this.l2).y;
  };
  prototype.updateNote = function(note){
    if (note.isPlaying) {
      note.y = this.ageToPersp(this.ageOfNote(note));
      note.x = note.lane.l1.findX(note.y);
      note.w = note.lane.l2.findX(note.y) - note.x;
      note.h = note.w;
      note.opacity -= 0.6 * state.delta * 1000 / this.beatDur(1);
      if (this.audio.getTime() > note.deadline + 1) {
        return note.isPlaying = false;
      }
    }
  };
  prototype.init = function(level){
    this.audio.load();
    return this.drum.load();
  };
  return Level;
}());
function clone$(it){
  function fun(){} fun.prototype = it;
  return new fun;
}