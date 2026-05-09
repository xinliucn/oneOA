<template>
  <div class="company-info">
    <section
      class="company-info__hero"
      :style="{ backgroundImage: `url(${heroImage})` }"
    >
      <h1>Company Information</h1>
    </section>

    <main class="company-info__body">
      <nav
        class="company-info__breadcrumb"
        aria-label="Breadcrumb"
      >
        <NuxtLink to="/desktop">
          Home
        </NuxtLink>
        <span>&gt;</span>
        <span>Company Information</span>
      </nav>

      <section class="company-info__article">
        <div
          v-for="section in sections"
          :key="section.title"
          class="company-info__section"
        >
          <h2>{{ section.title }}</h2>
          <p>{{ section.content }}</p>
        </div>

        <figure class="company-info__values">
          <img
            :src="valuesImage"
            alt="Dah Chong Hong team"
          >
          <figcaption>
            <span>Partnership</span>
            <span>Integrity</span>
            <span>Excellence</span>
            <span>Engagement</span>
          </figcaption>
        </figure>
      </section>
    </main>

    <footer class="company-info__copyright">
      Copyright © 2026 Dah Chong Hong Holdings Limited. All rights reserved.
    </footer>
  </div>
</template>

<script setup lang="ts">
import heroImage from '~/assets/images/desktop-banner.jpg'
import valuesImage from '~/assets/images/news/news1.png'

definePageMeta({
  layout: 'desktop',
  middleware: 'auth',
})

const sections = [
  {
    title: 'Vision, mission and values',
    content: 'During our more than 70 years of history, Dah Chong Hong has been guided by the strong purpose to serve our principals and customers to best of our ability. Our customer-centric spirit is embodied in our vision and mission, and drives us to continually look for new and better ways to connect our customers with the brands we represent, delivering value, quality and exceptional service.',
  },
  {
    title: 'Our Vision',
    content: 'Connect people with quality products and services to enrich daily living.',
  },
  {
    title: 'Our Mission',
    content: 'Be the partner of choice for the world’s brands through an intimate understanding of Asian markets and consumers.',
  },
  {
    title: 'Our Values',
    content: 'Our values are the foundation of our business and help create and maintain a strong performance culture. They guide our interactions, daily decisions and our long-term strategies. If our values match yours, you’ll find DCH a rewarding, inspirational place to work.',
  },
  {
    title: '',
    content: 'We have five core values. They are: Partnership, Results, Integrity, Dynamism, Engagement. Each of these values help us to achieve great things, individually and collectively. Together, they create a competitive advantage and have been the core of our long-term success.',
  },
]
</script>

<style scoped>
.company-info {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.company-info__hero {
  min-height: 186px;
  display: flex;
  align-items: center;
  padding: 0 118px;
  background-size: cover;
  background-position: center;
}

.company-info__hero h1 {
  margin: 0;
  color: #ffffff;
  font-size: 34px;
  line-height: 1.2;
  font-weight: 700;
}

.company-info__body {
  flex: 1;
  padding: 0 118px 60px;
}

.company-info__breadcrumb {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0 -118px 44px;
  padding: 22px 118px;
  border-bottom: 1px solid #d9d9d9;
  color: #a60a3a;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
}

.company-info__breadcrumb a {
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

.company-info__breadcrumb span {
  font-family: "Source Sans Pro", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
  vertical-align: middle;
}

.company-info__breadcrumb span:last-child {
  font-weight: 700;
}

.company-info__article {
  max-width: 760px;
}

.company-info__section {
  margin-bottom: 30px;
}

.company-info__section h2 {
  margin: 0 0 6px;
  color: #000000;
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
}

.company-info__section h2:empty {
  display: none;
}

.company-info__section p {
  margin: 0;
  color: #000000;
  font-size: 10px;
  line-height: 1.45;
}

.company-info__values {
  position: relative;
  width: 760px;
  max-width: 100%;
  margin: 42px 0 0;
  overflow: hidden;
}

.company-info__values img {
  display: block;
  width: 100%;
  aspect-ratio: 2.15 / 1;
  object-fit: cover;
}

.company-info__values::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.02));
  pointer-events: none;
}

.company-info__values figcaption {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
  color: #ffffff;
  font-size: 10px;
  line-height: 1.2;
  font-weight: 700;
  text-align: center;
}

.company-info__copyright {
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #a60a3a;
  color: #ffffff;
  font-size: 10px;
  line-height: 1.2;
}
</style>
