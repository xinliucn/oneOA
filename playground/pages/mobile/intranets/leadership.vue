<template>
  <div class="intranets-page">
    <div class="intranets-page__body">
      <section class="intranets-leadership">
        <nav class="intranets-leadership__breadcrumb">
          <NuxtLink to="/mobile/intranets">
            {{ t('pages.intranets.navigation.home') }}
          </NuxtLink>
          <span aria-hidden="true">›</span>
          <span>{{ t('pages.intranets.leadership.title') }}</span>
        </nav>

        <article class="intranets-leadership__content-card">
          <h1 class="intranets-leadership__title">
            {{ t('pages.intranets.leadership.title') }}
          </h1>

          <button
            v-for="member in leadershipMembers"
            :key="member.id"
            type="button"
            class="intranets-leadership__member"
            :class="{ 'is-active': selectedLeaderId === member.id }"
            :aria-pressed="selectedLeaderId === member.id"
            @click="selectedLeaderId = member.id"
          >
            <h2 class="intranets-leadership__member-title">
              {{ member.title }}
            </h2>
            <span class="intranets-leadership__member-name">
              {{ member.name }}
            </span>
          </button>

          <section class="intranets-leadership__profile">
            <div class="intranets-leadership__profile-header">
              <div
                class="intranets-leadership__profile-photo"
                :aria-label="selectedLeader.name"
              >
                {{ selectedLeaderInitials }}
              </div>
              <div>
                <h2 class="intranets-leadership__profile-name">
                  {{ selectedLeader.name }}
                </h2>
                <p class="intranets-leadership__profile-title">
                  {{ selectedLeader.title }}
                </p>
              </div>
            </div>

            <div class="intranets-leadership__profile-divider" />

            <p
              v-for="paragraph in selectedLeader.description"
              :key="paragraph"
              class="intranets-leadership__profile-paragraph"
            >
              {{ paragraph }}
            </p>
          </section>
        </article>
      </section>

      <IntranetsSharedFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'mobile',
  middleware: 'auth',
})

const { t } = useAppI18n()

type LeadershipMember = {
  id: string
  title: string
  name: string
  description: string[]
}

const leadershipMembers = computed<LeadershipMember[]>(() => {
  const chiefExecutiveOfficer = t('pages.intranets.leadership.chiefExecutiveOfficer')
  const chiefFinancialOfficer = t('pages.intranets.leadership.chiefFinancialOfficer')
  const deputyHeadMotorAndYachts = t('pages.intranets.leadership.deputyHeadMotorAndYachts')
  const headConsumerDivision = t('pages.intranets.leadership.headConsumerDivision')
  const headHealthcareDivision = t('pages.intranets.leadership.headHealthcareDivision')
  const complianceAuditIntegrityOfficer = t('pages.intranets.leadership.complianceAuditIntegrityOfficer')

  return [
    { id: 'alex-pan', title: chiefExecutiveOfficer, name: t('pages.intranets.leadership.alexName'), description: [chiefExecutiveOfficer] },
    {
      id: 'nina-chen',
      title: chiefFinancialOfficer,
      name: t('pages.intranets.leadership.ninaName'),
      description: [
        t('pages.intranets.leadership.ninaBio1'),
        t('pages.intranets.leadership.ninaBio2'),
      ],
    },
    { id: 'jonathan-li', title: deputyHeadMotorAndYachts, name: t('pages.intranets.leadership.jonathanName'), description: [deputyHeadMotorAndYachts] },
    { id: 'ivy-yeung', title: headConsumerDivision, name: t('pages.intranets.leadership.ivyName'), description: [headConsumerDivision] },
    { id: 'cecilia-qi', title: headHealthcareDivision, name: t('pages.intranets.leadership.ceciliaName'), description: [headHealthcareDivision] },
    { id: 'zeng-ning', title: complianceAuditIntegrityOfficer, name: t('pages.intranets.leadership.zengName'), description: [complianceAuditIntegrityOfficer] },
  ]
})

const selectedLeaderId = ref('nina-chen')
const selectedLeader = computed<LeadershipMember>(() => {
  const fallbackLeader = leadershipMembers.value[0]

  if (!fallbackLeader) {
    return {
      id: '',
      title: '',
      name: '',
      description: [],
    }
  }

  return leadershipMembers.value.find(member => member.id === selectedLeaderId.value) || fallbackLeader
})
const selectedLeaderInitials = computed(() => {
  return selectedLeader.value.name
    .split(/\s+/)
    .map(part => part[0] || '')
    .join('')
    .slice(0, 2)
    .toUpperCase()
})
</script>

<style scoped>
.intranets-page {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.intranets-page__body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.intranets-leadership {
  padding: 14px 8px 40px;
  background: #efefef;
}

.intranets-leadership__breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 16px 38px;
  color: #666666;
  font-size: 14px;
  line-height: 1.4;
}

.intranets-leadership__breadcrumb a {
  color: inherit;
  text-decoration: none;
}

.intranets-leadership__breadcrumb span:last-child {
  color: #c4385e;
}

.intranets-leadership__content-card {
  padding: 20px;
  background: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.intranets-leadership__title {
  margin: 0 0 20px;
  color: #171717;
  font-size: 16px;
  line-height: 1.25;
  font-weight: 700;
}

.intranets-leadership__member {
  width: 100%;
  display: block;
  border: 0;
  padding: 0;
  background: transparent;
  text-align: left;
}

.intranets-leadership__member + .intranets-leadership__member {
  margin-top: 24px;
}

.intranets-leadership__member-title {
  margin: 0;
  color: #171717;
  font-size: 15px;
  line-height: 1.35;
  font-weight: 500;
}

.intranets-leadership__member-name {
  display: block;
  margin-top: 10px;
  border-left: 3px solid #cf365d;
  padding-left: 10px;
  color: #b83f5d;
  font-size: 14px;
  line-height: 1.4;
}

.intranets-leadership__member.is-active .intranets-leadership__member-name {
  font-weight: 600;
}

.intranets-leadership__profile {
  margin-top: 28px;
}

.intranets-leadership__profile-header {
  display: flex;
  align-items: flex-start;
  gap: 30px;
}

.intranets-leadership__profile-photo {
  width: 116px;
  height: 145px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: linear-gradient(145deg, #ddd3d0, #f3e4e2);
  color: #8a6a70;
  font-size: 28px;
  font-weight: 600;
}

.intranets-leadership__profile-name,
.intranets-leadership__profile-title {
  margin: 0;
  color: #c4385e;
  font-size: 16px;
  line-height: 1.05;
  font-weight: 500;
}

.intranets-leadership__profile-title {
  margin-top: 2px;
}

.intranets-leadership__profile-divider {
  height: 2px;
  margin: 30px 0 18px;
  background: #cf365d;
}

.intranets-leadership__profile-paragraph {
  margin: 0;
  color: #666666;
  font-size: 14px;
  line-height: 1.55;
}

.intranets-leadership__profile-paragraph + .intranets-leadership__profile-paragraph {
  margin-top: 14px;
}
</style>
