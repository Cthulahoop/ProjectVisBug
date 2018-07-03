import $ from 'blingblingjs'
import hotkeys from 'hotkeys-js'

const key_events = 'up,down,left,right,backspace,del,delete'
// todo: indicator for when node can descend
// todo: indicator where left and right will go
// todo: indicator when left or right hit dead ends
// todo: undo
export function Moveable(selector) {
  hotkeys(key_events, (e, handler) => {
    e.preventDefault()
    e.stopPropagation()
    let el = $(selector)[0]
    moveElement(el, handler.key)
    updateFeedback(el)
  })

  return () => {
    hotkeys.unbind(key_events)
    hotkeys.unbind('up,down,left,right')
  }
}

export function moveElement(el, direction) {
  if (!el) return

  switch(direction) {
    case 'left':
      if (canMoveLeft(el))
        el.parentNode.insertBefore(el, el.previousElementSibling)
      break

    case 'right':
      if (canMoveRight(el) && el.nextElementSibling.nextSibling)
        el.parentNode.insertBefore(el, el.nextElementSibling.nextSibling)
      else if (canMoveRight(el))
        el.parentNode.appendChild(el)
      break

    case 'up':
      if (canMoveUp(el))
        el.parentNode.parentNode.prepend(el)
      break

    case 'down':
      // if last child, down can pop up a level and after (want??)
      // if (!el.nextElementSibling && el.parentNode && el.parentNode.parentNode && el.parentNode.nodeName != 'BODY')
      //   el.parentNode.parentNode.appendChild(el)
      if (canMoveDown(el))
        el.nextElementSibling.prepend(el)
      break

    case 'backspace': case 'del': case 'delete':
      el.remove()
      break
  }
}

export const canMoveLeft = el => el.previousElementSibling
export const canMoveRight = el => el.nextElementSibling
export const canMoveDown = el => 
  el.nextElementSibling && el.nextElementSibling.children.length
export const canMoveUp = el => 
  el.parentNode && el.parentNode.parentNode && el.parentNode.nodeName != 'BODY'

export function updateFeedback(el) {
  let options = ''
  // get current elements offset/size
  if (canMoveLeft(el))  options += '⇠'
  if (canMoveRight(el)) options += '⇢'
  if (canMoveDown(el))  options += '⇣'
  if (canMoveUp(el))    options += '⇡'
  // create/move arrows in absolute/fixed to overlay element
  console.info('%c'+options, "font-size: 2rem;")
}