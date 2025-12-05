<template>
  <div class="home">
    <h1>Adviento<br />Casa de mi Señor</h1>
    <nav>
      <NuxtLink to="/2025" class="advent-link">Adviento 2025</NuxtLink>
    </nav>
  </div>
</template>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 2rem;
  text-align: center;
}

h1 {
  font-size: 3rem;
  color: #1a1a1a;
  margin-bottom: 3rem;
  font-weight: 700;
  line-height: 1.2;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.advent-link {
  display: inline-block;
  background: #4a5568;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1.25rem;
  font-weight: 500;
  transition: background 0.2s, transform 0.2s;
}

.advent-link:hover {
  background: #2d3748;
  transform: translateY(-2px);
}
</style>
