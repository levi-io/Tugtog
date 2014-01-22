// Generated by LiveScript 1.2.0
var Renderer;
Renderer = (function(){
  Renderer.displayName = 'Renderer';
  var prototype = Renderer.prototype, constructor = Renderer;
  function Renderer(canvas, sdata){
    this.canvas = canvas;
    this.sdata = sdata;
    this.ctx = this.canvas.getContext('2d');
  }
  prototype.drawFinishLine = function(){
    this.ctx.fillStyle = "white";
    return this.ctx.fillRect(0, settings.finishline, settings.screenW, 1);
  };
  prototype.drawStartLine = function(){
    this.ctx.fillStyle = "white";
    return this.ctx.fillRect(0, settings.startline, settings.screenW, 1);
  };
  prototype.drawChars = function(chars){
    var i$, len$, char, results$ = [];
    for (i$ = 0, len$ = chars.length; i$ < len$; ++i$) {
      char = chars[i$];
      results$.push(char.draw(this.ctx, this.sdata));
    }
    return results$;
  };
  prototype.drawUI = function(ui){
    var i$, len$, elem, results$ = [];
    for (i$ = 0, len$ = ui.length; i$ < len$; ++i$) {
      elem = ui[i$];
      elem.draw(this.ctx);
    }
    for (i$ = 0, len$ = ui.length; i$ < len$; ++i$) {
      elem = ui[i$];
      results$.push(elem.draw(this.ctx));
    }
    return results$;
  };
  prototype.redraw = function(game){
    var innerRedraw, this$ = this;
    innerRedraw = function(){
      var i$, ref$, lane, len$, note, notif;
      this$.clearCanvas();
      if (game.hasLevelStarted) {
        for (i$ in ref$ = game.level.lanes) {
          lane = ref$[i$];
          lane.draw(this$.ctx);
        }
        for (i$ in ref$ = game.level.lanes) {
          lane = ref$[i$];
          lane.char.draw(this$.ctx, this$.sdata);
        }
        for (i$ = 0, len$ = (ref$ = game.notesToRender).length; i$ < len$; ++i$) {
          note = ref$[i$];
          note.draw(this$.ctx, this$.sdata);
        }
        this$.drawFinishLine();
        for (i$ = 0, len$ = (ref$ = game.notifs).length; i$ < len$; ++i$) {
          notif = ref$[i$];
          notif.draw(this$.ctx);
        }
      }
      return this$.drawChars(game.chars);
    };
    return innerRedraw();
  };
  prototype.clearCanvas = function(){
    return this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
  return Renderer;
}());