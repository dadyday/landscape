import go from "gojs";

export class GradientLink extends go.Link {
  startColor = "red";
  midColor = "yellow";
  endColor = "blue";
  strokeDashArray = [2];
  //colors = {0: "red", 0.5: "green", 1.0: "blue"};

  constructor(init: Partial<GradientLink> = {}) {
    super(init);
    if (init) Object.assign(this, init);
  }

  updateBrush() {
    var path = this.path;
    if (path !== null) {
      if (this.startColor === this.endColor) {
        path.stroke = this.startColor;
      } else if (this.pointsCount >= 2) {
        var br = new go.Brush(go.BrushType.Linear);
        var p0 = this.getPoint(0);
        var pn = this.getPoint(this.pointsCount - 1);
        var dx = pn.x - p0.x;
        var dy = pn.y - p0.y;
        var ex = (dx > 0) ? 1.0 : 0.0;
        var ey = (dy > 0) ? 1.0 : 0.0;
        br.end = new go.Spot(ex, ey);
        br.start = br.end.opposite();
        // Object.entries(this._colors).forEach(([pos, color]) => br.addColorStop(parseFloat(pos), color))
        br.addColorStop(0.0, this.startColor);
        br.addColorStop(0.5, this.midColor);
        br.addColorStop(1.0, this.endColor);
        path.stroke = br;
      }
      path.strokeDashArray = this.strokeDashArray;
    }
  }

  override computePoints() {
    var result = super.computePoints();
    if (result) this.updateBrush();
    return result;
  }
}
