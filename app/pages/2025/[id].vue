<template>
  <div class="video-view">
    <div v-if="pending" class="loading">Loading video...</div>

    <div v-else-if="error" class="error">
      <p>Error cargando el video: {{ error.message }}</p>
      <NuxtLink to="/2025" class="back-button"
        >Volver al listado de videos</NuxtLink
      >
    </div>

    <div v-else-if="video" class="video-content">
      <NuxtLink to="/2025" class="back-button"
        >← Volver al listado de videos</NuxtLink
      >

      <h1>{{ video.title }}</h1>

      <div class="video-player">
        <iframe
          v-if="youtubeEmbedUrl"
          :src="youtubeEmbedUrl"
          frameborder="0"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>

      <div v-if="video.markdownContent" class="markdown-content">
        <div v-html="renderedMarkdown"></div>
      </div>

      <div v-if="video.person || video.verse" class="video-info">
        <p v-if="video.verse" class="verse">
          Pasaje bíblico: <span>{{ video.verse }}</span>
        </p>
        <p v-if="video.person" class="speaker">
          Presentado por: <span>{{ video.person }}</span>
        </p>
      </div>
    </div>

    <div v-else class="not-found">
      <p>Video not found</p>
      <NuxtLink to="/2025" class="back-button">Back to Videos</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdventVideo } from "~/types/video";

const route = useRoute();
const videoSlug = computed(() => route.params.id as string);

const { data: videos } = await useFetch<AdventVideo[]>(
  "/data/2025-videos.json"
);
const video = computed(() =>
  videos.value?.find((v) => v.slug === videoSlug.value)
);

const pending = computed(() => !videos.value);
const error = ref<Error | null>(null);

// Extract YouTube video ID from URL
const getYouTubeId = (url: string): string | null => {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7] && match[7].length === 11 ? match[7] : null;
};

// Generate YouTube embed URL with custom parameters
const youtubeEmbedUrl = computed(() => {
  if (!video.value?.url) return null;
  const videoId = getYouTubeId(video.value.url);
  if (!videoId) return null;

  // Parameters:
  // autoplay=0 - no autoplay
  // rel=0 - no related videos at end
  // modestbranding=1 - minimal YouTube branding
  // controls=1 - show player controls
  return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&controls=1&showinfo=0&rel=0`;
});

// Basic markdown rendering (you can install a proper markdown library if needed)
const renderedMarkdown = computed(() => {
  if (!video.value?.markdownContent) return "";

  // Simple markdown to HTML conversion (consider using a library like marked or markdown-it)
  let html = video.value.markdownContent;

  // Headers
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Line breaks
  html = html.replace(/\n/g, "<br>");

  return html;
});

// Set page metadata
useHead({
  title: video.value?.title || "Video",
  meta: [
    {
      name: "description",
      content: `${video.value?.title} - ${video.value?.person}`,
    },
  ],
});
</script>

<style scoped>
.video-view {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.loading,
.error,
.not-found {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
}

.error {
  color: #d32f2f;
}

.back-button {
  display: inline-block;
  color: #4a5568;
  text-decoration: none;
  margin-bottom: 1.5rem;
  font-weight: 500;
  transition: color 0.2s;
}

.back-button:hover {
  color: #2d3748;
}

.video-content h1 {
  margin: 1rem 0;
  color: #1a1a1a;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.3;
}

.video-info {
  margin: 1rem 0 2rem;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 8px;
}

.speaker,
.verse {
  margin: 0.5rem 0;
  color: #555;
  font-size: 0.95rem;
}

.speaker span {
  font-style: italic;
}

.verse span {
  font-style: bold;
  font-weight: 600;
}

.video-player {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  margin: 2rem 0;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}

.video-player iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.markdown-content {
  margin-top: 3rem;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  line-height: 1.6;
}

.markdown-content :deep(h1) {
  font-size: 1.75rem;
  margin: 1.5rem 0 1rem;
}

.markdown-content :deep(h2) {
  font-size: 1.5rem;
  margin: 1.25rem 0 0.75rem;
}

.markdown-content :deep(h3) {
  font-size: 1.25rem;
  margin: 1rem 0 0.5rem;
}

.markdown-content :deep(p) {
  margin: 1rem 0;
}
</style>
