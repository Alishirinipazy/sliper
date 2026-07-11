<!--
  استفاده:
  <StoryViewer :stories="stories" :start-index="0" @close="viewerOpen = false" />
-->
<template>
    <Teleport to="body">
        <div class="story-overlay" @click.self="$emit('close')">

            <!-- progress bars بالا -->
            <div class="story-progress px-3 pt-3 d-flex gap-1">
                <div v-for="(s, i) in stories" :key="s.id" class="story-progress-bar flex-fill">
                    <div class="story-progress-fill"
                        :style="{
                            width: i < currentIndex ? '100%'
                                 : i === currentIndex ? progressWidth + '%'
                                 : '0%',
                            transition: i === currentIndex ? 'none' : 'none'
                        }">
                    </div>
                </div>
            </div>

            <!-- هدر -->
          <div class="story-header flex items-center justify-between  px-3 pt-2">
            <div class="flex items-center gap-2">
              <div class="rounded-circle bg-white overflow-hidden"
                   style="width:36px;height:36px;flex-shrink:0">
                <img v-if="current?.thumbnail || current?.type === 'image'"
                     :src="current.thumbnail || current.file"
                     style="width:100%;height:100%;object-fit:cover" />
                <div v-else class="w-100 h-100 bg-secondary d-flex align-items-center justify-content-center">
                  <i class="bi bi-play-fill text-white small"></i>
                </div>
              </div>
              <div>
                <div class="text-white fw-bold small">{{ current?.title || 'استوری' }}</div>
              </div>
            </div>
            <UButton  class="rounded-full text-white text-lg" @click="$emit('close')" icon="material-symbols:cancel-outline"  square
                        :padded="false"
                      color="yellow"
                      variant="link">

            </UButton>
          </div>
            <!-- محتوا -->
            <div class="story-content" @click="handleContentClick">

                <!-- ناحیه کلیک قبلی / بعدی -->
                <div class="story-tap-prev" @click.stop="prev"></div>
                <div class="story-tap-next" @click.stop="next"></div>

                <!-- تصویر -->
                <img v-if="current?.type === 'image'"
                    :src="current.file"
                    class="story-media" />

                <!-- ویدیو -->
                <video v-else-if="current?.type === 'video'"
                    ref="videoEl"
                    :src="current.file"
                    :poster="current.thumbnail"
                    class="story-media"
                    autoplay playsinline
                    @ended="next"
                    @loadedmetadata="onVideoLoaded"
                    @timeupdate="onVideoProgress">
                </video>

                <!-- متن caption -->
                <div v-if="current?.caption" class="story-caption">
                    <p class="mb-0">{{ current.caption }}</p>
                </div>

                <!-- دکمه لینک -->
                <div v-if="current?.link_url" class="story-link-btn">
                    <a :href="current.link_url" target="_blank" @click.stop
                        class="btn btn-light rounded-pill px-4 py-2 fw-bold shadow">
                        <i class="bi bi-link-45deg me-1"></i>
                        {{ current.link_label || 'مشاهده' }}
                    </a>
                </div>
            </div>

            <!-- دکمه‌های ناوبری روی کنار (دسکتاپ) -->
            <button v-if="currentIndex > 0"
                class="story-nav story-nav-prev"
                @click="prev">
                <i class="bi bi-chevron-right"></i>
            </button>
            <button v-if="currentIndex < stories.length - 1"
                class="story-nav story-nav-next"
                @click="next">
                <i class="bi bi-chevron-left"></i>
            </button>

        </div>
    </Teleport>
</template>

<script setup>
const props = defineProps({
    stories:    { type: Array,  required: true },
    startIndex: { type: Number, default: 0 },
})
const emit = defineEmits(['close'])

const currentIndex = ref(props.startIndex)
const progressWidth = ref(0)
const videoEl = ref(null)
const videoDuration = ref(0)

const STORY_DURATION = 5000  // مدت نمایش تصویر: ۵ ثانیه
let timer = null
let startTime = null
let elapsed = 0

const current = computed(() => props.stories[currentIndex.value])

// شروع تایمر
function startTimer(duration = STORY_DURATION) {
    stopTimer()
    progressWidth.value = 0
    startTime = Date.now()
    elapsed = 0

    const tick = () => {
        elapsed = Date.now() - startTime
        progressWidth.value = Math.min((elapsed / duration) * 100, 100)
        if (elapsed < duration) {
            timer = requestAnimationFrame(tick)
        } else {
            next()
        }
    }
    timer = requestAnimationFrame(tick)
}

function stopTimer() {
    if (timer) cancelAnimationFrame(timer)
    timer = null
}

// برای ویدیو — duration از metadata می‌گیریم
function onVideoLoaded() {
    videoDuration.value = videoEl.value?.duration * 1000 || STORY_DURATION
}

function onVideoProgress() {
    if (!videoEl.value) return
    const pct = (videoEl.value.currentTime / videoEl.value.duration) * 100
    progressWidth.value = pct
}

function next() {
    stopTimer()
    if (currentIndex.value < props.stories.length - 1) {
        currentIndex.value++
        startStory()
    } else {
        emit('close')
    }
}

function prev() {
    stopTimer()
    if (currentIndex.value > 0) {
        currentIndex.value--
        startStory()
    }
}

function startStory() {
    progressWidth.value = 0
    nextTick(() => {
        if (current.value?.type === 'video') {
            // ویدیو خودش پیشرفت رو مدیریت می‌کنه، تایمر برای image
        } else {
            startTimer(STORY_DURATION)
        }
    })
}

function handleContentClick() { /* کنترل با tap نواحی */ }

// جلوگیری از scroll
onMounted(() => {
    document.body.style.overflow = 'hidden'
    startStory()
})
onUnmounted(() => {
    document.body.style.overflow = ''
    stopTimer()
})

// کیبورد
function onKeydown(e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') next()
    if (e.key === 'Escape') emit('close')
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
.story-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.92);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

/* progress */
.story-progress {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: min(400px, 100%);
    z-index: 10;
}
.story-progress-bar {
    height: 3px;
    background: rgba(255,255,255,0.35);
    border-radius: 2px;
    overflow: hidden;
}
.story-progress-fill {
    height: 100%;
    background: #fff;
    transition: width 0.1s linear;
}

/* هدر */
.story-header {
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    width: min(400px, 100%);
    z-index: 10;
}

/* محتوا */
.story-content {
    position: relative;
    width: min(400px, 100vw);
    height: min(710px, 100dvh);
    overflow: hidden;
    border-radius: 12px;
}

.story-media {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

/* نواحی tap */
.story-tap-prev,
.story-tap-next {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 35%;
    z-index: 5;
    cursor: pointer;
}
.story-tap-prev { left: 0; }
.story-tap-next { right: 0; }

/* متن */
.story-caption {
    position: absolute;
    bottom: 0px;
    left: 0;
    right: 0;
    padding: 30px 20px 15px;
    background: linear-gradient(transparent, #ffbe33);
    color: #fff;
    font-size: 15px;
    text-align: center;
    white-space: pre-line;
    z-index: 6;

}

/* دکمه لینک */
.story-link-btn {
    position: absolute;
    bottom: 24px;
    left: 0;
    right: 0;
    text-align: center;
    z-index: 7;
}

/* دکمه‌های ناوبری کنار (دسکتاپ) */
.story-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255,255,255,0.15);
    border: none;
    color: #fff;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    backdrop-filter: blur(4px);
    transition: background 0.2s;
}
.story-nav:hover { background: rgba(255,255,255,0.3); }
.story-nav-prev { right: calc(50% + min(210px, 50vw) + 12px); }
.story-nav-next { left:  calc(50% + min(210px, 50vw) + 12px); }

@media (max-width: 600px) {
    .story-nav { display: none; }
    .story-content { border-radius: 0; }
}
</style>
