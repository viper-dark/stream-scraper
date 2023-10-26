import date from "date-and-time"

const TWO_HOURS =(60*2) * 60 * 1000
const ev = new Date()

  ev.setHours("10","12",0)
  const p = ev.toISOString()

  let after =date.addMilliseconds(ev,-TWO_HOURS).toISOString()
