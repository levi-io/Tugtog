// Generated by LiveScript 1.2.0
var Game;
Game = (function(){
  Game.displayName = 'Game';
  var requestAnimationFrame, prototype = Game.prototype, constructor = Game;
  function Game(canvas, songs, sdata, scope){
    this.canvas = canvas;
    this.songs = songs;
    this.sdata = sdata;
    this.scope = scope;
    this.frame = bind$(this, 'frame', prototype);
    this.update = bind$(this, 'update', prototype);
    this.renderer = new Renderer(this.canvas, this.sdata);
    this.ctx = this.canvas.getContext('2d');
    this.reset();
  }
  prototype.highlightedLane = '';
  requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(callback){
    return setTimeout(callback, 1);
  };
  prototype.reset = function(){
    this.score = 0;
    this.hasLevelStarted = false;
    this.hasLevelEnded = false;
    this.haveNotesComeOut = false;
    state.currBeat = 0;
    this.notifs = [];
    this.chars = [];
    return this.notesToRender = [];
  };
  prototype.start = function(){
    this.hasLevelStarted = true;
    this.level.audio.play();
    this.timeStartAudio = Date.now();
    return state.timeStartLevel = this.level.audio.getTime() + this.level.leadTime / 1000;
  };
  prototype.end = function(){
    return this.hasLevelEnded = true;
  };
  prototype.startLevel = function(){
    state.currBeat = 0;
    return this.haveNotesComeOut = true;
  };
  prototype.cleanNotifs = function(){
    return this.notifs = this.notifs.filter(function(notif){
      return notif.age <= notif.lifespan;
    });
  };
  prototype.cleanNotes = function(){
    return this.notesToRender = filter(function(it){
      return it.isPlaying;
    })(
    this.notesToRender);
  };
  prototype.triggerNote = function(note, lane){
    note.isActive = false;
    this.notifs.push(new Notif(lane.char, note.grade + "!"));
    return this.score += settings.score(note.grade);
  };
  prototype.update = function(){
    var notes, ref$, i$, len$, note, lane, notif;
    if (this.hasLevelStarted) {
      if (this.level.audio.getTime() >= state.timeStartLevel && !this.haveNotesComeOut) {
        this.startLevel();
      }
      if (this.haveNotesComeOut) {
        if (this.level.audio.getTime() >= this.level.beatToTime(state.currBeat)) {
          notes = (ref$ = this.level.sheet.shift()) != null
            ? ref$
            : [];
          for (i$ = 0, len$ = notes.length; i$ < len$; ++i$) {
            note = notes[i$];
            lane = this.level.lanes[note];
            if (lane) {
              this.notesToRender.push(this.level.spawnNote(lane));
              lane.char.hit();
            }
          }
          for (i$ = 0, len$ = (ref$ = this.notesToRender).length; i$ < len$; ++i$) {
            note = ref$[i$];
            note.pulse();
          }
          for (i$ in ref$ = this.level.lanes) {
            lane = ref$[i$];
            lane.char.pulse();
          }
          state.currBeat += 1;
        }
        for (i$ = 0, len$ = (ref$ = this.notesToRender).length; i$ < len$; ++i$) {
          note = ref$[i$];
          this.level.updateNote(note);
        }
        for (i$ = 0, len$ = (ref$ = this.notifs).length; i$ < len$; ++i$) {
          notif = ref$[i$];
          notif.animUpdate();
        }
        for (i$ in ref$ = this.level.lanes) {
          lane = ref$[i$];
          lane.char.animUpdate();
        }
      }
      this.cleanNotifs();
      this.cleanNotes();
      if (this.level.audio.getPercent() >= 100) {
        this.end();
        state.isDone = true;
        return this.scope.$apply();
      }
    }
  };
  prototype.frame = function(){
    this.setDelta();
    this.renderer.redraw(this);
    this.update();
    return requestAnimationFrame(this.frame);
  };
  prototype.setDelta = function(){
    state.now = Date.now();
    state.delta = (state.now - state.then) / 1000;
    return state.then = state.now;
  };
  prototype.init = function(){
    this.setDelta();
    return this.frame();
  };
  return Game;
}());
function bind$(obj, key, target){
  return function(){ return (target || obj)[key].apply(obj, arguments) };
}