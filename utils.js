/* small helpers used by app */
export function el(tag, attrs={}, ...children){
  const node = document.createElement(tag);
  for(const k in attrs){
    if(k.startsWith("on") && typeof attrs[k]==="function") node.addEventListener(k.substring(2).toLowerCase(), attrs[k]);
    else if(k==="html") node.innerHTML = attrs[k];
    else if(k==="classes") node.className = attrs[k];
    else node.setAttribute(k, attrs[k]);
  }
  for(const c of children) if(c) node.appendChild(typeof c==="string"?document.createTextNode(c):c);
  return node;
}
export function formatPercent(n){ return Math.max(0,Math.min(100,Math.round(n))) + "%"; }
export function mapBadgeClass(level){
  return level==="very_high"||level==="high" ? "danger"
    : level==="moderate" ? "warn"
    : level==="low" ? "success" : "none";
}

