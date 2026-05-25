<script setup lang="ts">
definePageMeta({ layout: 'desktop' })

const route = useRoute()
const id = route.params.id as string
const notificationRequestId = computed(() => String(route.query.requestId || route.query.requestid || ''))

if (notificationRequestId.value) {
  await navigateTo({
    path: `/desktop/todo/${encodeURIComponent(id)}`,
    query: {
      requestId: notificationRequestId.value,
      source: route.query.source || 'notification',
      notificationId: route.query.notificationId,
    },
  }, {
    replace: true,
  })
}

const showAllApprovers = ref(false)

const notification = ref({
  id,
  title: 'DCHBI Order Approval',
  status: 'Pending',
  referenceNo: id,
  applicant: 'Sofia Johnson',
  applicationDate: '2025-10-24',
  contractName: 'CK2025-SN-test03',
  contractType: 'Procurement Agreement / Quotation (BU Principal)',
  contractStart: '2025-11-20',
  contractEnd: '2025-12-31',
  comments: '',
  dchPartyAUnit: 'DCH BI TEST',
  partyBUnit: 'CK2025-SN-test03',
  affiliatedBU: 'Corporate',
  contractOwner: 'Sofia Johnson',
  contractAmountHKD: '300,000,001.00',
  amount: '',
})

const approvers = ref([
  { name: 'Approver 1', action: 'Approved', date: '2026-02-01 at 14:47' },
  { name: 'Approver 2', action: 'Approved', date: '2026-02-03 at 17:21' },
  { name: 'Approver 3', action: 'Pending', date: '' },
])

const visibleApprovers = computed(() =>
  showAllApprovers.value ? approvers.value : approvers.value.slice(0, 2),
)

const actionOptions = ['Approve', 'Reject', 'Return']
const selectedAction = ref('')
const actionComment = ref('')

const statusColorMap: Record<string, string> = {
  Pending: '#d4a017',
  Approved: '#28a745',
  Rejected: '#dc3545',
}

const statusColor = computed(() => statusColorMap[notification.value.status] || '#666')
</script>

<template>
  <div class="notification-detail">
    <div class="notification-detail__breadcrumb">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/desktop' }">
          Home
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/desktop/todo' }">
          To-Do
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ id }}</el-breadcrumb-item>
      </el-breadcrumb>
      <h2 class="notification-detail__title">
        {{ notification.title }}
      </h2>
    </div>

    <div class="notification-detail__content">
      <div class="notification-detail__status__content">
        <div
          class="notification-detail__status-bar"
          :style="{ backgroundColor: statusColor }"
        >
          {{ notification.status }}
        </div>

        <div class="notification-detail__approvers">
          <div
            v-for="(approver, index) in visibleApprovers"
            :key="index"
            class="notification-detail__approver-item"
          >
            <div class="notification-detail__approver-marker">
              <div class="notification-detail__approver-avatar">
                <IconCustom
                  name="personnel"
                  :size="20"
                />
              </div>
              <div
                v-if="index < visibleApprovers.length - 1"
                class="notification-detail__approver-connector"
              />
            </div>
            <div class="notification-detail__approver-info">
              <span class="notification-detail__approver-name">{{ approver.name }}</span>
              <span
                v-if="approver.date"
                class="notification-detail__approver-date"
              >
                {{ approver.action }} {{ approver.date }}
              </span>
            </div>
          </div>
          <button
            v-if="approvers.length > 2"
            class="notification-detail__show-more"
            @click="showAllApprovers = !showAllApprovers"
          >
            {{ showAllApprovers ? 'Show less' : 'Show more' }}
          </button>
        </div>
      </div>

      <div class="notification-detail__form">
        <div class="notification-detail__row">
          <div class="notification-detail__row__left">
            <div class="notification-detail__field">
              <span>Reference No.</span><el-input
                :value="notification.referenceNo"
                style="width: 327px;height: 40px;"
                :disabled="true"
              />
            </div>
            <div class="notification-detail__field">
              <span>Applicant</span>
              <el-input
                :value="notification.applicant"
                readonly
                style="width: 327px;height: 40px;"
              />
            </div>
            <div class="notification-detail__field">
              <label>Contract Name</label>
              <el-input
                :value="notification.contractName"
                readonly
                style="width: 327px;height: 40px;"
              />
            </div>
            <div class="notification-detail__field">
              <label>Contract Start</label>
              <el-input
                :value="notification.contractStart"
                readonly
                style="width: 327px;height: 40px;"
              />
            </div>
            <div class="notification-detail__field">
              <label>Contract End</label>
              <el-input
                :value="notification.contractEnd"
                readonly
                style="width: 327px;height: 40px;"
              />
            </div>
          </div>
          <div class="notification-detail__row__right">
            <div class="notification-detail__field">
              <div class="notification-detail__field__status">
                <span>Process Status</span>
                <span class="notification-detail__status">{{ notification.status }}</span>
              </div>
            </div>
            <div class="notification-detail__field">
              <label>Application Date</label>
              <el-input
                :value="notification.applicationDate"
                readonly
                style="width: 327px;height: 40px;"
              />
            </div>
            <div class="notification-detail__field">
              <label>Contract Type</label>
              <el-input
                :value="notification.contractType"
                readonly
                style="width: 327px;height: 40px;"
              />
            </div>
          </div>
        </div>
        <div class="notification-detail__row notification-detail__row--full">
          <div class="notification-detail__field__comments">
            <label>Comments</label>
            <el-input
              :value="notification.comments"
              type="textarea"
              :rows="3"
              readonly
              style="width: 912px;height: 120px;display: flex;align-items: center;margin-left: 20px;"
            />
          </div>
        </div>

        <div class="notification-detail__row">
          <div class="notification-detail__row__left">
            <div class="notification-detail__field">
              <label>DCH Party A Unit</label>
              <el-input
                :value="notification.dchPartyAUnit"
                readonly
                style="width: 327px;height: 40px;"
              />
            </div>
            <div class="notification-detail__field">
              <label>Affiliated BU</label>
              <el-input
                :value="notification.affiliatedBU"
                readonly
                style="width: 327px;height: 40px;"
              />
            </div>
            <div class="notification-detail__field">
              <label>Contract Owner</label>
              <el-input
                :value="notification.contractOwner"
                readonly
                style="width: 327px;height: 40px;"
              />
            </div>
            <div class="notification-detail__field">
              <div style="display: flex;flex-direction: column;justify-content: flex-end;">
                <span>Contract Amount
                </span>
                <span>
                  (HKD)
                </span>
              </div>
              <el-input
                :value="notification.contractAmountHKD"
                readonly
                style="width: 327px;height: 40px;"
              />
            </div>
          </div>
          <div class="notification-detail__row__right__a">
            <div class="notification-detail__field">
              <label>Party B Unit</label>
              <el-input
                :value="notification.partyBUnit"
                readonly
                style="width: 327px;height: 40px;"
              />
            </div>

            <div class="notification-detail__field">
              <label>Amount</label>
              <el-input
                :value="notification.amount"
                readonly
                style="width: 327px;height: 40px;"
              />
            </div>
          </div>
        </div>
        <div class="notification-detail__row" />
        <div class="notification-detail__row">
          <div class="notification-detail__field" />
        </div>
        <div class="notification-detail__row">
          <div class="notification-detail__field" />
        </div>
        <div class="notification-detail__row" />
      </div>

      <div class="notification-detail__action-area">
        <el-input
          v-model="actionComment"
          type="textarea"
          :rows="3"
          placeholder="Add Comments"
          style="width: 992px;height: 80px;"
        />
        <div class="notification-detail__action-row">
          <el-select
            v-model="selectedAction"
            placeholder="Action"
            style="width: 160px"
          >
            <el-option
              v-for="opt in actionOptions"
              :key="opt"
              :label="opt"
              :value="opt"
            />
          </el-select>
          <el-button
            class="notification-detail__submit-btn"
            type="primary"
            :disabled="!selectedAction"
            style="width: 120px;height: 40px; font-size: 14px;"
          >
            Submit
          </el-button>
        </div>
      </div>
    </div>

    <footer class="notification-detail__footer">
      Copyright © 2026 Dah Chong Hong Holdings Limited. All rights reserved.
    </footer>
  </div>
</template>

<style scoped>
.notification-detail {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.notification-detail__breadcrumb {
  margin: 0;
  padding: 22px 82px 24px;
  border-bottom: 1px solid #d9d9d9;
  background: #f5f5f5;
  color: #a60a3a;
  font-family: var(--font-source-sans-pro);
  font-size: 16px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
}

:deep(.el-breadcrumb) {
  display: flex;
  align-items: center;
  font-family: var(--font-source-sans-pro);
  font-size: 16px !important;
  font-weight: 400;
  line-height: 100%;
}

:deep(.notification-detail__breadcrumb .el-breadcrumb__item span) {
  font-size: 16px !important;
  font-weight: 400;
  line-height: 100%;
  color: #a60a3a;
}

:deep(.notification-detail__breadcrumb .el-breadcrumb__separator) {
  font-size: 16px !important;
  font-weight: 400;
  line-height: 100%;
  color: #a60a3a;
  margin: 0 5px;
}

:deep(.notification-detail__breadcrumb .el-breadcrumb__item:first-child .el-breadcrumb__inner.is-link) {
  color: #a60a3a !important;
  font-family: var(--font-source-sans-pro);
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0;
  vertical-align: middle;
  text-decoration: underline;
  text-decoration-style: solid;
  text-decoration-thickness: 0%;
  text-underline-offset: 0%;
  text-decoration-skip-ink: auto;
}

:deep(.notification-detail__breadcrumb .el-breadcrumb__inner.is-link) {
  color: #a60a3a !important;
  font-family: var(--font-source-sans-pro);
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0;
  vertical-align: middle;
  text-decoration: underline;
  text-decoration-style: solid;
  text-decoration-thickness: 0%;
  text-underline-offset: 0%;
  text-decoration-skip-ink: auto;
}

:deep(.notification-detail__breadcrumb .el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: #a60a3a !important;
  font-family: var(--font-source-sans-pro);
  font-size: 16px;
  font-weight: 700;
  line-height: 100%;
  letter-spacing: 0;
  vertical-align: middle;
}

.notification-detail__content {
  flex: 1;
  padding: 24px 32px;
  max-width: 1185px;
}

.notification-detail__status__content {
  max-width: 684px;
}

.notification-detail__title {
  font-size: 22px;
  font-weight: 600;
  margin: 28px 0 0;
  color: #000000;
  font-family: var(--font-source-sans-pro);
  line-height: 110%;
}

.notification-detail__status-bar {
  color: #fff;
  font-weight: 600;
  padding: 10px 18px;
  border-radius: 12px 12px 0 0;
  font-size: 14px;
}

.notification-detail__approvers {
  background: #f2f2f2;
  border-radius: 0 0 12px 12px;
  padding: 18px 18px 16px;
  margin-bottom: 24px;
}

.notification-detail__approver-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.notification-detail__approver-marker {
  width: 44px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.notification-detail__approver-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #15911f;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.notification-detail__approver-connector {
  width: 0;
  height: 30px;
  border-left: 2px dotted #9aa0a6;
  margin-top: 6px;
}

.notification-detail__approver-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 8px;
}

.notification-detail__approver-name {
  font-size: 14px;
  font-weight: 500;
}

.notification-detail__approver-date {
  font-size: 12px;
  color: #888;
}

.notification-detail__show-more {
  background: none;
  border: none;
  color: #a50034;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 0;
  margin-top: 4px;
}

.notification-detail__form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
  border-bottom: 1px solid #D9D9D9;
}

.notification-detail__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 32px;
}

.notification-detail__row__left {
  width: 475px;
}

.notification-detail__row__right__a {
  display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.notification-detail__row__date {
  display: flex;
  flex-direction: column;
}

.notification-detail__row--full {
  grid-template-columns: 1fr;
}

.notification-detail__field {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  max-width: 500px;
  margin-top: 20px;
  gap: 15px;

  span {
    font-size: 14px;
    flex-shrink: 0;
  }
}

.notification-detail__field__status {
  margin-left: 68px;
  width: 100%;
}

.notification-detail__field__comments {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.notification-detail__field label {
  font-size: 14px;
  color: #555;
}

.notification-detail__status {
  margin-left: 20px;
  font-size: 16px;
  color: #D79E00;
}

:deep(.el-input__wrapper) {
  font-size: 14px !important;
}

:deep(.el-textarea__inner) {
  font-size: 14px !important;
}

.status-pending :deep(.el-input__inner) {
  color: #d4a017 !important;
  font-weight: 600;
}

.notification-detail__action-area {
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #F5F5F5;
}

.notification-detail__action-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

:deep(.notification-detail__submit-btn.el-button--primary:not(.is-disabled)) {
  background-color: #A60A3A !important;
  border-color: #A60A3A !important;
  color: #ffffff !important;
}

:deep(.notification-detail__submit-btn.el-button) {
  font-size: 14px !important;
}

:deep(.notification-detail__submit-btn.el-button--primary.is-disabled) {
  background-color: #d9d9d9 !important;
  border-color: #d9d9d9 !important;
  color: #ffffff !important;
}

:deep(.el-select .el-select__placeholder span) {
  font-size: 14px !important;
}

:deep(.el-select .el-select__selected-item span) {
  font-size: 14px !important;
}

.notification-detail__footer {
  background: #8b001a;
  color: #fff;
  text-align: center;
  padding: 16px;
  font-size: 14px;
  margin-top: auto;
}
</style>
