export const formatNewsDate = (value: string, locale: string) => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  const parts = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).formatToParts(date)

  const day = parts.find(item => item.type === 'day')?.value ?? ''
  const month = parts.find(item => item.type === 'month')?.value ?? ''
  const year = parts.find(item => item.type === 'year')?.value ?? ''

  if (locale === 'en') {
    return `${day} ${month}, ${year}`
  }

  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}
