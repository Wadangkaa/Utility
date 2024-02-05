function getLastDayOfMonth(date) {
  const lastDayOfMonth = new Date(date)
  lastDayOfMonth.setDate(1)
  lastDayOfMonth.setMonth(date.getMonth() + 1)
  lastDayOfMonth.setDate(0)

  return lastDayOfMonth
}

export function getWeeksInMonth(dateString) {
  const weeks = []

  const date = new Date(dateString)
  const lastDayOfMonth = getLastDayOfMonth(date)
  const dayOfWeek = date.getDay()

  // Calculate the start date of the week (Sunday)
  const startDate = new Date(date)
  startDate.setDate(date.getDate() - dayOfWeek)

  let currentWeekStart = new Date(startDate)

  while (currentWeekStart.getMonth() != date.getMonth() + 1) {
    const currentWeekEnd = new Date(currentWeekStart)
    currentWeekEnd.setDate(currentWeekEnd.getDate() + 6) // Assuming a week has 7 days

    let startDayOfWeek = new Date(currentWeekStart)
    let endDateOfWeek = new Date(currentWeekEnd)

    if (startDayOfWeek.getMonth() != date.getMonth()) {
      startDayOfWeek = new Date(date)
      startDayOfWeek.setDate(1)
    }

    if (endDateOfWeek.getMonth() != date.getMonth()) {
      endDateOfWeek = lastDayOfMonth
    }

    weeks.push({
      start: startDayOfWeek.toISOString(),
      end: endDateOfWeek.toISOString(),
    })

    // Move to the next week
    currentWeekStart.setDate(currentWeekStart.getDate() + 7)
  }

  return weeks
}
