<template>
  <div class="company-docs">
    <section
      class="company-docs__hero"
      :style="{ backgroundImage: `url(${heroImage})` }"
    >
      <h1>Company Documents</h1>
    </section>

    <main class="company-docs__body">
      <nav
        class="company-docs__breadcrumb"
        aria-label="Breadcrumb"
      >
        <NuxtLink to="/desktop">
          Home
        </NuxtLink>
        <span>&gt;</span>
        <span>Company Documents</span>
      </nav>

      <div class="company-docs__toolbar">
        <label class="company-docs__search">
          <IconCustom
            name="search"
            :size="14"
          />
          <input
            type="search"
            placeholder="Search Company Documents"
          >
        </label>

        <div
          class="company-docs__filters"
          aria-label="Document status"
        >
          <button
            v-for="filter in filters"
            :key="filter"
            type="button"
            :class="['company-docs__filter', { 'is-active': activeFilter === filter }]"
            @click="activeFilter = filter"
          >
            {{ filter }}
          </button>
        </div>
      </div>

      <div class="company-docs-table">
        <div class="company-docs-table__row company-docs-table__row--head">
          <button type="button">
            Folder Title
          </button>
          <button type="button">
            Folder Description
          </button>
          <button type="button">
            No of Articles
          </button>
        </div>

        <div
          v-for="folder in folders"
          :key="folder.title"
          class="company-docs-table__row"
        >
          <NuxtLink
            class="company-docs-table__link"
            to="/desktop/company-documents"
          >
            {{ folder.title }}
          </NuxtLink>
          <span>{{ folder.description }}</span>
          <span>{{ folder.articles }}</span>
        </div>
      </div>

      <div class="company-docs__footer-row">
        <span class="company-docs__record-count">
          1 to 15 of 31 records
        </span>

        <div
          class="company-docs__pagination"
          aria-label="Pagination"
        >
          <button
            type="button"
            class="company-docs__page-nav"
          >
            <IconCustom
              name="chevron-right"
              :size="16"
              :rotate="180"
            />
          </button>
          <button
            type="button"
            class="company-docs__page is-active"
          >
            1
          </button>
          <button
            type="button"
            class="company-docs__page"
          >
            2
          </button>
          <button
            type="button"
            class="company-docs__page"
          >
            3
          </button>
          <button
            type="button"
            class="company-docs__page-nav"
          >
            <IconCustom
              name="chevron-right"
              :size="16"
            />
          </button>
        </div>
      </div>
    </main>

    <footer class="company-docs__copyright">
      Copyright © 2026 Dah Chong Hong Holdings Limited. All rights reserved.
    </footer>
  </div>
</template>

<script setup lang="ts">
import heroImage from '~/assets/images/Rectangle 2.png'

definePageMeta({
  layout: 'desktop',
  middleware: 'auth',
})

const filters = ['All', 'Acknowledged', 'Not Yet Acknowledged']
const activeFilter = ref('All')

const folders = [
  { title: 'Group DOA', description: 'Group DOA', articles: 1 },
  { title: 'Anti-Money Laundering Policy', description: 'Anti-money Laundering Policy', articles: 1 },
  { title: 'Group Treasury Policies', description: 'Group Treasury Policies', articles: 3 },
  { title: 'Special Purpose Vehicle (SPV) Management Rules', description: 'Special Purpose Vehicle (SPV) Management Rules', articles: 1 },
  { title: 'Group Taxation Policies', description: 'Group Taxation Policies', articles: 5 },
  { title: 'Group Financial System Policies', description: 'Group Financial System Policies', articles: 1 },
  { title: 'Group Business Record Keeping Guidelines', description: 'Group Business Record Keeping Guidelines', articles: 1 },
  { title: 'Group Credit Control Policy', description: 'Group Credit Control Policy', articles: 2 },
  { title: 'Group Risk Management Policy & Reporting Guidelines', description: 'Group Risk Management Policy & Reporting Guidelines', articles: 3 },
  { title: 'Group Provision Policy', description: 'Group Provision Policy', articles: 1 },
  { title: 'Group Policy on Intercompany Transactions', description: 'Group Policy on Intercompany Transactions', articles: 1 },
  { title: 'Construction Project Guideline', description: 'Construction Project Guideline', articles: 2 },
  { title: 'Group Policy for Property Leasing', description: 'Group Policy for Property Leasing', articles: 1 },
  { title: 'GAD Policies', description: 'GAD Admin Policies', articles: 2 },
  { title: 'Group Accounting Policies', description: 'Group Accounting Policies', articles: 5 },
]
</script>

<style scoped>
.company-docs {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.company-docs__hero {
  min-height: 250px;
  display: flex;
  align-items: center;
  padding: 0 110px;
  background-size: cover;
  background-position: center;
}

.company-docs__hero h1 {
  margin: 0;
  color: #ffffff;
  font-size: 34px;
  line-height: 1.2;
  font-weight: 700;
}

.company-docs__body {
  flex: 1;
  padding: 0 110px 62px;
}

.company-docs__breadcrumb {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0 -110px 58px;
  padding: 22px 110px;
  border-bottom: 1px solid #d9d9d9;
  color: #a60a3a;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
}

.company-docs__breadcrumb a {
  color: inherit;
  font-family: "Source Sans Pro", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;
  text-decoration: underline;
  text-decoration-style: solid;
  text-decoration-thickness: 0%;
  text-underline-offset: 0%;
  text-decoration-skip-ink: auto;
}

.company-docs__breadcrumb span {
  font-family: "Source Sans Pro", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
  vertical-align: middle;
}

.company-docs__breadcrumb span:last-child {
  font-weight: 700;
}

.company-docs__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 52px;
}

.company-docs__search {
  width: 258px;
  height: 32px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  border-radius: 5px;
  background: #f5f5f5;
  color: #777777;
}

.company-docs__search input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #333333;
  font-size: 10px;
}

.company-docs__search input::placeholder {
  color: #b0b0b0;
}

.company-docs__filters {
  display: flex;
  gap: 7px;
}

.company-docs__filter {
  min-height: 28px;
  border: 1px solid #d9d9d9;
  border-radius: 999px;
  padding: 0 12px;
  background: #ffffff;
  color: #555555;
  font-size: 10px;
  line-height: 1;
  cursor: pointer;
}

.company-docs__filter.is-active {
  border-color: #a60a3a;
  background: #a60a3a;
  color: #ffffff;
}

.company-docs-table {
  width: 100%;
}

.company-docs-table__row {
  display: grid;
  grid-template-columns: 1.25fr 1.25fr 0.55fr;
  align-items: center;
  min-height: 34px;
  padding: 0 24px;
  column-gap: 18px;
  color: #000000;
  font-size: 10px;
  line-height: 1.2;
}

.company-docs-table__row:nth-child(odd):not(.company-docs-table__row--head) {
  background: #f8f8f8;
  border-radius: 6px;
}

.company-docs-table__row--head {
  min-height: 28px;
  padding-bottom: 6px;
  font-weight: 700;
}

.company-docs-table__row--head button {
  justify-self: start;
  border: 0;
  padding: 0;
  background: transparent;
  color: #000000;
  font: inherit;
}

.company-docs-table__row--head button::after {
  content: "↕";
  margin-left: 4px;
  color: #000000;
  font-size: 12px;
}

.company-docs-table__link {
  color: #a60a3a;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.company-docs__footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-top: 30px;
}

.company-docs__record-count {
  color: #555555;
  font-size: 10px;
}

.company-docs__pagination {
  display: flex;
  align-items: center;
  gap: 8px;
}

.company-docs__page,
.company-docs__page-nav {
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 6px;
  background: #ffffff;
  color: #666666;
  font-size: 12px;
}

.company-docs__page-nav {
  background: #f8dbe6;
  color: #a60a3a;
}

.company-docs__page.is-active {
  background: #a60a3a;
  color: #ffffff;
}

.company-docs__copyright {
  min-height: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #a60a3a;
  color: #ffffff;
  font-size: 10px;
  line-height: 1.2;
}
</style>
