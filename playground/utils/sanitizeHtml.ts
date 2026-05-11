const blockedTagPattern = /<\/?(?:script|style|iframe|object|embed|link|meta|base|form|input|button|textarea|select|option)[^>]*>/gi
const eventHandlerAttributePattern = /\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi
const dangerousUrlAttributePattern = /\s+(href|src|xlink:href)\s*=\s*(["'])\s*(?:javascript|data:text\/html)[^"']*\2/gi
const styleAttributePattern = /\s+style\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi

export const sanitizeControlledHtml = (html: string) => {
  return String(html || '')
    .replace(blockedTagPattern, '')
    .replace(eventHandlerAttributePattern, '')
    .replace(dangerousUrlAttributePattern, '')
    .replace(styleAttributePattern, '')
}
