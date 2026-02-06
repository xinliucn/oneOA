<template>
  <div class="error-page">
    <div class="error-container">
      <!-- Logo -->
      <div class="error-header">
        <div class="error-logo">
          <img src="../assets/images/image002.jpg" alt="logo">
        </div>
      </div>

      <!-- Error Content -->
      <div class="error-content">
        <div class="error-code">500</div>
        <div class="error-title">服务器错误</div>
        <div class="error-message">
          抱歉，服务器遇到了一个错误，无法完成您的请求。
        </div>
        <div class="error-description">
          请稍后再试，或联系系统管理员寻求帮助。
        </div>

        <!-- Action Buttons -->
        <div class="error-actions">
          <el-button class="error-button" size="large" @click="goHome">
            返回首页
          </el-button>
          <el-button class="error-button-secondary" size="large" @click="goBack">
            返回上一页
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 禁用默认布局和全局中间件
definePageMeta({
  layout: false,
  middleware: [] // 禁用所有中间件，包括全局中间件
})

const router = useRouter()

// 返回首页
const goHome = () => {
  navigateTo('/')
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
}

.error-container {
  border-radius: 0.8rem;
  width: 100%;
  max-width: 60rem;
  padding: 5rem 4rem;
}

.error-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 4rem;

  .error-logo {
    width: 30rem;
    max-width: 100%;
    margin: 0 auto;

    img {
      width: 100%;
      display: block;
    }
  }
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.error-code {
  font-size: 12rem;
  font-weight: 700;
  color: #a52a2a;
  line-height: 1;
  margin-bottom: 2rem;
  text-shadow: 0 0.2rem 0.4rem rgba(165, 42, 42, 0.2);
}

.error-title {
  font-size: 3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.6rem;
}

.error-message {
  font-size: 1.6rem;
  color: #666;
  margin-bottom: 1.2rem;
  line-height: 1.6;
}

.error-description {
  font-size: 1.4rem;
  color: #999;
  margin-bottom: 4rem;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 1.6rem;
  flex-wrap: wrap;
  justify-content: center;
}

/* 按钮样式 */
.error-button {
  --el-button-bg-color: #A60A3A;
  --el-button-border-color: #A60A3A;
  --el-button-text-color: #ffffff;
  --el-button-hover-bg-color: #A60A3A26;
  --el-button-hover-border-color: #A60A3A26;
  --el-button-hover-text-color: #A60A3A;
  --el-button-active-bg-color: #A60A3A;
  --el-button-active-border-color: #A60A3A;
}

.error-button-secondary {
  --el-button-bg-color: #A60A3A;
  --el-button-border-color: #A60A3A;
  --el-button-text-color: #ffffff;
  --el-button-hover-bg-color: #A60A3A26;
  --el-button-hover-border-color: #A60A3A26;
  --el-button-hover-text-color: #A60A3A;
  --el-button-active-bg-color: #A60A3A;
  --el-button-active-border-color: #A60A3A;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .error-container {
    padding: 3rem 2rem;
  }

  .error-code {
    font-size: 8rem;
  }

  .error-title {
    font-size: 2.4rem;
  }

  .error-message {
    font-size: 1.4rem;
  }

  .error-description {
    font-size: 1.2rem;
  }

  .error-actions {
    flex-direction: column;
    width: 100%;

    :deep(.el-button) {
      width: 100%;
    }
  }
}
</style>

