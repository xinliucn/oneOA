<template>
  <div class="intranets-newsletter-page">
    <div class="intranets-newsletter-page__body">
      <IntranetsNewsletterDirectory
        title-key="pages.intranets.navigation.dchLetter"
        :issues="issues"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'mobile',
  middleware: 'auth',
})

const issues = [
  { title: 'Message from the CEO' },
  { title: '大昌行集团佳供应链经理冯骥德女士 2025年9月号' },
  { title: '大昌行产品总经理李颖娴女士 2025年7月号', featured: true },
  { title: '大昌行汽车（香港及海外）数字平台主管黄嘉周总经理 2025年5月号' },
  { title: 'Austin Chesterfield, General Manager - Consumer Brands - March 2025' },
  { title: '大昌行汽车（香港及海外）售后服务（维修部）主管黄振锋先生 2025年1月号' },
  { title: 'Adam Waters, Managing Director of DCH Marine - 2024' },
  { title: '大昌行汽车（香港及海外）汽车销售及售后服务总监余政明先生 2024年5月号' },
  { title: '大昌行物流总经理陈焕婷女士 2024年3月号' },
  { title: '大昌行集团行政总裁黎汝杰先生 2024年1月号' },
  { title: '大昌行集团财务总经理何鸿菁先生 2023年11月号' },
  { title: '大昌行集团人力资源部助理总经理黄文心小姐 2023年9月号' },
  { title: '大昌行集团执行董事、新零售、汽车及进驻主管李德辉先生 2023年7月号' },
  { title: '大昌行政府关系及业务协同副总经理周清贤先生 2023年5月号' },
]
</script>

<style scoped>
.intranets-newsletter-page {
  height: 100%;
  min-height: 0;
  background: #efefef;
}

.intranets-newsletter-page__body {
  height: 100%;
  overflow-y: auto;
}
</style>
