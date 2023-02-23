export function max(n1, n2) {
    return n1 > n2 ? n1 : n2;
  }

export function min(n1, n2) {
    return n1 < n2 ? n1 : n2;
  }

export function findLength(from, to){
    if (from.row===to.row){
      return Math.abs(from.col-to.col);
    } else if (from.col ===to.col){
      return Math.abs(from.row-to.row);
    } else {
      return Math.sqrt((to.row-from.row)**2+(to.col-from.col)**2);
    }
  }
  
export function findAngle(from, to){
    if (from.row===to.row){
      return 0;
    } else if (from.col ===to.col){
      return 90;
    } else {
      const angle = 180/Math.PI*Math.atan2((to.row-from.row),(to.col-from.col));
      return angle;
    }
  }
  
export function midPoint(from,to){
    if (from.row===to.row){
      return {x:(from.col+to.col)/2, y:from.row};
    } else if (from.col ===to.col){
      return {x: from.col, y: (from.row+to.row)/2};
    } else {
      return {
        y: (from.row+to.row)/2,
        x: (from.col+to.col)/2,
      }
    }
  }