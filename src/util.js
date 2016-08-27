export function closest(el, selector) {
  while (el) {
    if (el.matches.call(el, selector)) {
      break;
    }
    el = el.parentElement;
  }
  return el;
}