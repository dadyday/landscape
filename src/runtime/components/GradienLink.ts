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
    if (!this.path) return

    if (this.startColor === this.endColor) {
      this.path.stroke = this.startColor;
    }
    else if (this.pointsCount >= 2) {
        const br = new go.Brush(go.BrushType.Linear);
        const p0 = this.getPoint(0);
        const pn = this.getPoint(this.pointsCount - 1);
        const dx = pn.x - p0.x;
        const dy = pn.y - p0.y;
        const ex = (dx > 0) ? 1.0 : 0.0;
        const ey = (dy > 0) ? 1.0 : 0.0;
        br.end = new go.Spot(ex, ey);
        br.start = br.end.opposite();
        // Object.entries(this._colors).forEach(([pos, color]) => br.addColorStop(parseFloat(pos), color))
        br.addColorStop(0.0, this.startColor);
        br.addColorStop(0.5, this.midColor);
        br.addColorStop(1.0, this.endColor);
        this.path.stroke = br;
    }
    this.path.strokeDashArray = this.strokeDashArray;
  }

  override computePoints() {
    var result = super.computePoints();

    if (this.isOrthogonal || this.curve == go.Curve.Bezier || this.hasCurviness()) return result

    const curv = this.computeCurviness();
    if (curv !== 0) {
      const num = this.pointsCount;
      let pidx = 0;
      let qidx = num - 1;
      if (num >= 4) {
        pidx++;
        qidx--;
      }
      const frompt = this.getPoint(pidx);
      const topt = this.getPoint(qidx);
      const dx = topt.x - frompt.x;
      const dy = topt.y - frompt.y;
      let mx = frompt.x + (dx * 1) / 8;
      let my = frompt.y + (dy * 1) / 8;
      let px = mx;
      let py = my;
      if (-0.01 < dy && dy < 0.01) {
        if (dx > 0)
          py -= curv;
        else
          py += curv;
      }
      else {
        const slope = -dx / dy;
        let e = Math.sqrt((curv * curv) / (slope * slope + 1));
        if (curv < 0)
          e = -e;
        px = (dy < 0 ? -1 : 1) * e + mx;
        py = slope * (px - mx) + my;
      }
      mx = frompt.x + (dx * 7) / 8;
      my = frompt.y + (dy * 7) / 8;
      let qx = mx;
      let qy = my;
      if (-0.01 < dy && dy < 0.01) {
        if (dx > 0)
          qy -= curv;
        else
          qy += curv;
      }
      else {
        const slope = -dx / dy;
        let e = Math.sqrt((curv * curv) / (slope * slope + 1));
        if (curv < 0)
          e = -e;
        qx = (dy < 0 ? -1 : 1) * e + mx;
        qy = slope * (qx - mx) + my;
      }
      this.insertPointAt(pidx + 1, px, py);
      this.insertPointAt(qidx + 1, qx, qy);
    }

    // if (result) this.updateBrush();
    return result;
  }
}
