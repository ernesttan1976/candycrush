export function add(arr){
    if (typeof arr === 'undefined' || arr === null) return 0;
    arr.push(getNumber());
    return arr.reduce((p,n)=>p+n,0);
  }

export function max(n1, n2) {
    return n1 > n2 ? n1 : n2;
  }

export function min(n1, n2) {
    return n1 < n2 ? n1 : n2;
  }

// export function getNumber() {
//     return 5;
//   }
  