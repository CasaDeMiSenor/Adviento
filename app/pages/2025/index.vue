<template>
  <div class="videos-container">
    <h1>Adviento 2025</h1>
    <ClientOnly>
      <div v-if="pending" class="loading">Loading videos...</div>
      <div v-else-if="error" class="error">
        <p>Error cargando los videos: {{ error.message }}</p>
      </div>
      <div v-else-if="videos && videos.length > 0">
        <div class="filter-controls">
          <button
            :class="['filter-btn', { active: sortOrder === 'order' }]"
            @click="sortOrder = 'order'"
          >
            En orden de publicación
          </button>
          <button
            :class="['filter-btn', { active: sortOrder === 'recent' }]"
            @click="sortOrder = 'recent'"
          >
            Más recientes primero
          </button>
        </div>
        <div class="videos-grid">
          <div v-for="video in sortedVideos" :key="video.id" class="video-card">
            <div class="thumbnail-wrapper">
              <img
                :src="video.thumbnailUrl"
                :alt="video.title"
                class="thumbnail"
              />
              <span class="video-id-badge">{{
                video.id === 0 ? "Intro" : `Dia ${video.id}`
              }}</span>
            </div>
            <div class="card-content">
              <h2>{{ video.title }}</h2>
            </div>
            <NuxtLink :to="`/2025/${video.slug}`" class="watch-button"
              >Ver Video</NuxtLink
            >
          </div>
        </div>
      </div>
      <div v-else class="loading">No hay videos disponibles</div>
      <template #fallback>
        <div class="loading">Cargando videos...</div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import type { AdventVideo } from "~/types/video";

const {
  data: videos,
  pending,
  error,
} = await useFetch<AdventVideo[]>("/data/2025-videos.json");

// Load sort order from localStorage or default to "order"
const sortOrder = ref<"recent" | "order">("order");

// Initialize from localStorage on client side
onMounted(() => {
  const saved = localStorage.getItem("adventSortOrder");
  if (saved === "recent" || saved === "order") {
    sortOrder.value = saved;
  }
});

// Save to localStorage when it changes
watch(sortOrder, (newValue) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("adventSortOrder", newValue);
  }
});

const sortedVideos = computed(() => {
  if (!videos.value) return [];

  const now = new Date();

  // Filter videos where displayAfter is in the past
  const availableVideos = videos.value.filter((video) => {
    const displayDate = new Date(video.displayAfter);
    return displayDate <= now;
  });

  if (sortOrder.value === "recent") {
    return availableVideos.sort((a, b) => {
      return (
        new Date(b.displayAfter).getTime() - new Date(a.displayAfter).getTime()
      );
    });
  } else {
    // Sort by id (numeric order)
    return availableVideos.sort((a, b) => a.id - b.id);
  }
});
</script>

<style scoped>
.videos-container {
  max-width: 1200px;
  margin: 15px auto;
  padding: 1rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #1a1a1a;
  font-size: 3.5rem;
  font-weight: 600;
}

.filter-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filter-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #4a5568;
  background: white;
  color: #4a5568;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  background: #f7fafc;
}

.filter-btn.active {
  background: #4a5568;
  color: white;
  font-weight: 700;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: #d32f2f;
}

.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.video-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s, box-shadow 0.2s;
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100%;
}

.video-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.45);
}

.thumbnail-wrapper {
  position: relative;
  width: 100%;
}

.thumbnail {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.video-id-badge {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  backdrop-filter: blur(4px);
}

.card-content {
  padding: 1.5rem 1.5rem 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.video-card h2 {
  margin: 0;
  color: #1a1a1a;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
  min-height: 2.8em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.watch-button {
  display: block;
  background: #4a5568;
  color: white;
  padding: 0.875rem 1.5rem;
  text-align: center;
  text-decoration: none;
  transition: background 0.2s;
  font-weight: 500;
  margin: 1.5rem;
  border-radius: 6px;
}

.watch-button:hover {
  background: #2d3748;
}
</style>
