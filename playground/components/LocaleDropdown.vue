<template>
  <el-dropdown
    trigger="click"
    :placement="placement"
    :persistent="false"
    popper-class="locale-dropdown-popper"
    @command="handleCommand"
  >
    <button
      type="button"
      :class="['locale-dropdown__trigger', `locale-dropdown__trigger--${variant}`]"
      :aria-label="t('locale.ariaLabel')"
    >
      <IconCustom name="globe" :size="20" />
    </button>

    <template #dropdown>
      <el-dropdown-menu class="locale-dropdown__menu">
        <el-dropdown-item
          v-for="item in locales"
          :key="item.code"
          :command="item.code"
          :class="['locale-dropdown__item', { 'is-active': item.code === locale }]"
        >
          <span class="locale-dropdown__check">{{ item.code === locale ? '✓' : '' }}</span>
          <span class="locale-dropdown__label">{{ item.label }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'desktop' | 'mobile'
    placement?: 'bottom-start' | 'bottom-end'
  }>(),
  {
    variant: 'desktop',
    placement: 'bottom-start'
  }
)

const { locale, locales, setLocale, t } = useAppI18n()
const handleCommand = (nextLocale: string | number | object) => {
  if (typeof nextLocale === 'string') {
    setLocale(nextLocale)
  }
}
</script>

<style>
.locale-dropdown__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.locale-dropdown__trigger:hover {
  transform: translateY(-1px);
}

.locale-dropdown__trigger--desktop {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background-color: #fce4ec;
  color: #a60a3a;
}

.locale-dropdown__trigger--desktop:hover {
  background-color: #f8bbd0;
}

.locale-dropdown__trigger--mobile {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background-color: #fce4ec;
  color: #a60a3a;
}

.locale-dropdown__trigger--mobile:hover {
  background-color: #f8bbd0;
}

.locale-dropdown-popper.el-popper {
  border: none !important;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.22) !important;
  border-radius: 24px !important;
  overflow: hidden;
  padding: 0 !important;
}

.locale-dropdown-popper .el-popper__arrow {
  display: none !important;
}

.locale-dropdown__menu {
  min-width: 148px;
  padding: 10px 0;
  background: #ffffff;
  border-radius: 24px;
}

.locale-dropdown__menu .el-dropdown-menu__item {
  min-height: 52px;
  padding: 0 22px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #111111;
  font-size: 1.2rem;
  font-weight: 600;
}

.locale-dropdown__menu .el-dropdown-menu__item:focus,
.locale-dropdown__menu .el-dropdown-menu__item:not(.is-disabled):hover {
  background: rgba(166, 10, 58, 0.06);
  color: #111111;
}

.locale-dropdown__check {
  width: 16px;
  color: #a60a3a;
  font-size: 1.6rem;
  line-height: 1;
}

.locale-dropdown__label {
  font-size: 1.2rem;
  letter-spacing: 0.02em;
}
</style>
