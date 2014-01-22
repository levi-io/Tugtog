// Generated by LiveScript 1.2.0
var Point, Vector, ImplicitLine;
Point = (function(){
  Point.displayName = 'Point';
  var prototype = Point.prototype, constructor = Point;
  function Point(x, y){
    this.x = x;
    this.y = y;
  }
  return Point;
}());
Vector = (function(){
  Vector.displayName = 'Vector';
  var prototype = Vector.prototype, constructor = Vector;
  function Vector(x, y){
    this.x = x;
    this.y = y;
  }
  prototype.mag = function(){
    return Math.pow(Math.pow(this.x, 2) + Math.pow(this.y, 2), 0.5);
  };
  prototype.unit = function(){
    return new Vector(this.x / this.mag(), this.y / this.mag());
  };
  prototype.add = function(vector){
    return new Vector(this.x + vector.x, this.y + vector.y);
  };
  prototype.dot = function(vector){
    return this.x * vector.x + this.y * vector.y;
  };
  prototype.norm = function(){
    return new Vector(-this.y, this.x);
  };
  prototype.neg = function(){
    return new Vector(-1 * this.x, -1 * this.y);
  };
  prototype.draw = function(ctx){
    ctx.beginPath();
    ctx.arc(this.x, this.y, 10, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fillStyle = 'red';
    return ctx.fill();
  };
  return Vector;
}());
ImplicitLine = (function(){
  ImplicitLine.displayName = 'ImplicitLine';
  var prototype = ImplicitLine.prototype, constructor = ImplicitLine;
  function ImplicitLine(point1, point2){
    this.point1 = point1;
    this.point2 = point2;
    this.d = new Vector(this.point2.x - this.point1.x, this.point2.y - this.point1.y);
    this.v = this.d.unit();
    this.vn = this.v.norm();
  }
  prototype.pointFromIntersectionWith = function(line){
    var a, x3x4, b, x1x2, y3y4, y1y2, c, x, y;
    a = this.point1.x * this.point2.y - this.point1.y * this.point2.x;
    x3x4 = line.point1.x - line.point2.x;
    b = line.point1.x * line.point2.y - line.point1.y * line.point2.x;
    x1x2 = this.point1.x - this.point2.x;
    y3y4 = line.point1.y - line.point2.y;
    y1y2 = this.point1.y - this.point2.y;
    c = x1x2 * y3y4 - y1y2 * x3x4;
    x = (a * x3x4 - b * x1x2) / c;
    y = (a * y3y4 - b * y1y2) / c;
    return new Vector(x, y);
  };
  prototype.err = function(x, y){
    var a, b, c;
    a = this.vn.x;
    b = this.vn.y;
    c = -(a * this.point1.x) - b * this.point1.y;
    return a * x + b * y + c;
  };
  prototype.errWithPoint = function(point){
    return this.err(point.x, point.y);
  };
  prototype.findValWithAxis = function(axis, val){
    var a, b, c;
    a = this.vn.x;
    b = this.vn.y;
    c = -(a * this.point1.x) - b * this.point1.y;
    if (axis === 'y') {
      return (-b * val - c) / a;
    } else {
      return (-a * val - c) / b;
    }
  };
  prototype.findY = function(x){
    return this.findValWithAxis('x', x);
  };
  prototype.findX = function(y){
    return this.findValWithAxis('y', y);
  };
  prototype.majorAxis = function(){
    if (abs(this.v.y) > abs(this.v.x)) {
      return 'y';
    } else {
      return 'x';
    }
  };
  prototype.createPointWithAxis = function(majorAxis, val){
    var minorAxis, ref$;
    if (majorAxis === 'x') {
      minorAxis = 'y';
    } else {
      minorAxis = 'x';
    }
    return ref$ = {}, ref$[majorAxis + ""] = val, ref$[minorAxis + ""] = Math.round(this.findValWithAxis(majorAxis, val) * 100) / 100, ref$;
  };
  prototype.intPointsContainingPoint = function(point){
    var ceil, floo;
    if (point.x % 1 === 0 && point.y % 1 === 0) {
      return [{
        x: point.x,
        y: point.y,
        factor: 1
      }];
    } else if (point.x % 1 === 0) {
      ceil = Math.ceil(point.y);
      floo = Math.floor(point.y);
      return [
        {
          x: point.x,
          y: ceil,
          factor: 1 - abs(this.err(point.x, ceil))
        }, {
          x: point.x,
          y: floo,
          factor: 1 - abs(this.err(point.x, floo))
        }
      ];
    } else if (point.y % 1 === 0) {
      ceil = Math.ceil(point.x);
      floo = Math.floor(point.x);
      return [
        {
          x: ceil,
          y: point.y,
          factor: 1 - abs(this.err(ceil, point.y))
        }, {
          x: floo,
          y: point.y,
          factor: 1 - abs(this.err(floo, point.y))
        }
      ];
    } else {
      return console.log("neither axes are integers");
    }
  };
  prototype.rasterPoints = function(){
    var axis, points, sign, i$, to$, i, _point, j$, ref$, len$, point;
    axis = this.majorAxis();
    points = [];
    sign = signum(this.point2[axis] - this.point1[axis]);
    for (i$ = this.point1[axis], to$ = this.point2[axis]; sign < 0 ? i$ > to$ : i$ < to$; i$ += sign) {
      i = i$;
      _point = this.createPointWithAxis(axis, i);
      for (j$ = 0, len$ = (ref$ = this.intPointsContainingPoint(_point)).length; j$ < len$; ++j$) {
        point = ref$[j$];
        points.push(point);
      }
    }
    return points;
  };
  prototype.rasterPointsTo = function(){
    var axis, points, sign, i$, to$, i, _point, j$, ref$, len$, point;
    axis = this.majorAxis();
    points = [];
    sign = signum(this.point2[axis] - this.point1[axis]);
    for (i$ = this.point1[axis], to$ = this.point2[axis]; sign < 0 ? i$ >= to$ : i$ <= to$; i$ += sign) {
      i = i$;
      _point = this.createPointWithAxis(axis, i);
      for (j$ = 0, len$ = (ref$ = this.intPointsContainingPoint(_point)).length; j$ < len$; ++j$) {
        point = ref$[j$];
        points.push(point);
      }
    }
    return points;
  };
  return ImplicitLine;
}());