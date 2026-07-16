import { proxyRequest } from '~/server/utils/requestProxy'

export default defineEventHandler(async (event) => {
  return await proxyRequest<unknown>(event, '/api/r/cms/graphql', {
    method: 'POST',
    headers: {
      'X-CMS-Api-Type': 'read',
    },
    body: {
      query: `{
        listBrandCarousel {
          data {
            id
            carouselSort
            brandName
            brandLogo
          }
        }
      }`,
    },
    errorMessage: 'Fetch intranets brand carousel failed',
  })
})
