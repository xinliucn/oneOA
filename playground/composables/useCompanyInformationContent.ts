export type CompanyInformationContentBlock = {
  heading: string
  paragraphs: string[]
}

export const useCompanyInformationContent = () => {
  const { locale } = useAppI18n()

  const contentBlocks = computed<CompanyInformationContentBlock[]>(() => {
    if (locale.value === 'zh-CN') {
      return [
        {
          heading: '愿景、使命与价值观',
          paragraphs: [
            '七十多年来，大昌行始终秉持服务客户、合作伙伴与社会的初心。我们以客户为中心，将这一理念融入愿景与使命之中，并不断寻找新的方式，为品牌、客户与伙伴创造更高价值。',
          ],
        },
        {
          heading: '我们的使命',
          paragraphs: [
            '以优质产品与服务连接更多人群，丰富日常生活体验。',
          ],
        },
        {
          heading: '我们的愿景',
          paragraphs: [
            '凭借对亚洲市场及消费者的深刻理解，成为全球品牌首选的合作伙伴。',
          ],
        },
        {
          heading: '我们的价值观',
          paragraphs: [
            '价值观是企业文化的基础，帮助我们在机遇与挑战中保持方向一致。它影响着我们的互动方式、决策方式以及长期发展路径。',
            '我们坚持五项核心价值观：伙伴关系、成果导向、诚信、活力与投入。每一项价值观都让我们在个人与团队层面更紧密地协作，并共同构建长期竞争力。',
          ],
        },
      ]
    }

    if (locale.value === 'zh-TW') {
      return [
        {
          heading: '願景、使命與價值觀',
          paragraphs: [
            '七十多年來，大昌行始終秉持服務客戶、合作夥伴與社會的初心。我們以客戶為中心，將這一理念融入願景與使命之中，並持續尋找新的方式，為品牌、客戶與夥伴創造更高價值。',
          ],
        },
        {
          heading: '我們的使命',
          paragraphs: [
            '以優質產品與服務連結更多人群，豐富日常生活體驗。',
          ],
        },
        {
          heading: '我們的願景',
          paragraphs: [
            '憑藉對亞洲市場及消費者的深刻理解，成為全球品牌首選的合作夥伴。',
          ],
        },
        {
          heading: '我們的價值觀',
          paragraphs: [
            '價值觀是企業文化的基礎，幫助我們在機遇與挑戰中保持方向一致。它影響著我們的互動方式、決策方式以及長期發展路徑。',
            '我們堅持五項核心價值觀：夥伴關係、成果導向、誠信、活力與投入。每一項價值觀都讓我們在個人與團隊層面更緊密地協作，並共同構建長期競爭力。',
          ],
        },
      ]
    }

    return [
      {
        heading: 'Vision, mission and values',
        paragraphs: [
          'During our more than 70 years of history, Dah Chong Hong has been guided by the strong purpose to serve our principles and customers to best of our ability. Our customer-centric spirit is embodied in our vision and mission, and drives us to continually look for new and better ways to connect our customers with the brands we represent, delivering value, quality and exceptional service.',
        ],
      },
      {
        heading: 'Our Vision',
        paragraphs: [
          'Connect people with quality products and services to enrich daily living.',
        ],
      },
      {
        heading: 'Our Mission',
        paragraphs: [
          'Be the partner of choice for the world’s brands through an intimate understanding of Asian markets and consumers.',
        ],
      },
      {
        heading: 'Our Values',
        paragraphs: [
          'Our values are the foundation of our business and help create and maintain a strong performance culture. They guide our interactions, daily decisions and our long term strategies. If our values match yours, you’ll find DCH a rewarding, inspirational place to work.',
          'We have five core values. They are: Partnership, Results, Integrity, Dynamism, Engagement. Each of these values help us to achieve great things, individually and collectively. Together, they create a competitive advantage and have been the core of our long-term success.',
        ],
      },
    ]
  })

  return {
    contentBlocks,
  }
}
