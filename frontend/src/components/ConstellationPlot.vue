<template>
  <div class="panel">
    <div class="panel-head">
      <h3>⭐ 星座图 (IQ平面)</h3>
      <div class="th-bar">
        <span class="th-current">门限 r = {{ store.threshold }}</span>
        <el-button size="small" @click="openSettings">⚙ 门限设置</el-button>
      </div>
    </div>
    <canvas ref="cvs" width="300" height="300" class="const-canvas"></canvas>
    <div v-if="stats.total > 0" class="th-stats">
      越限点 <b class="out">{{ stats.out }}</b> / {{ stats.total }}，占比
      <b class="out">{{ stats.pct }}%</b>
    </div>

    <el-dialog v-model="dlgVisible" title="判决门限设置" width="340px" append-to-body>
      <el-input
        v-model="thInput"
        placeholder="请输入门限半径"
        clearable
        @keyup.enter="applyThreshold"
      >
        <template #prepend>门限 r</template>
      </el-input>
      <div class="dlg-hint">
        判定 |I+jQ| &gt; r 的点为越限点，有效范围 ({{ THRESHOLD_MIN }}, {{ THRESHOLD_MAX }}]
      </div>
      <template #footer>
        <el-button @click="dlgVisible = false">取 消</el-button>
        <el-button type="primary" @click="applyThreshold">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useSignalStore, THRESHOLD_MIN, THRESHOLD_MAX } from '../store/signal'
const store = useSignalStore()
const cvs = ref<HTMLCanvasElement>()

const dlgVisible = ref(false)
const thInput = ref('')
const stats = reactive({ out: 0, total: 0, pct: '0.00' })

function openSettings() {
  thInput.value = String(store.threshold)
  dlgVisible.value = true
}

function applyThreshold() {
  const raw = thInput.value.trim()
  if (raw === '') {
    ElMessage.warning('门限不能为空')
    return
  }
  const v = Number(raw)
  if (!Number.isFinite(v) || v <= THRESHOLD_MIN || v > THRESHOLD_MAX) {
    ElMessage.warning(`门限需在 (${THRESHOLD_MIN}, ${THRESHOLD_MAX}] 范围内`)
    return
  }
  store.threshold = v
  dlgVisible.value = false
  ElMessage.success(`判决门限已更新为 ${v}`)
}

function draw() {
  const c = cvs.value; if (!c) return
  const ctx = c.getContext('2d')!; const W = c.width, H = c.height
  ctx.fillStyle = '#0d1520'; ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = '#2a3a4a'; ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(0, H/2); ctx.lineTo(W, H/2); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(W/2, 0); ctx.lineTo(W/2, H); ctx.stroke()

  const th = store.threshold
  const scale = W * 0.4

  // 判决门限圆
  ctx.beginPath(); ctx.arc(W/2, H/2, th * scale, 0, Math.PI*2)
  ctx.setLineDash([5, 4])
  ctx.strokeStyle = 'rgba(255,167,38,0.8)'; ctx.lineWidth = 1.5; ctx.stroke()
  ctx.setLineDash([])

  const pts = store.result?.constellation || []
  if (pts.length === 0) { stats.out = 0; stats.total = 0; stats.pct = '0.00'; return }

  let out = 0
  for (const pt of pts) {
    const x = W/2 + pt.i * scale, y = H/2 - pt.q * scale
    const isOut = Math.hypot(pt.i, pt.q) > th
    if (isOut) out++
    ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI*2)
    ctx.fillStyle = isOut ? '#ef5350' : '#42a5f5'; ctx.fill()
    if (isOut) {
      // 圈出落在门限之外的点
      ctx.beginPath(); ctx.arc(x, y, 6.5, 0, Math.PI*2)
      ctx.strokeStyle = '#ef5350'; ctx.lineWidth = 1.5; ctx.stroke()
    } else {
      ctx.strokeStyle = 'rgba(66,165,245,0.5)'; ctx.lineWidth = 1; ctx.stroke()
    }
  }
  stats.out = out
  stats.total = pts.length
  stats.pct = ((out / pts.length) * 100).toFixed(2)

  ctx.fillStyle = '#8899aa'; ctx.font = '10px system-ui'
  ctx.fillText('I →', W-25, H/2-5); ctx.fillText('Q ↑', W/2+5, 14)
}

onMounted(draw)
watch(() => store.result, draw)      // 切换数据：按当前门限重新判定
watch(() => store.threshold, draw)   // 门限调整：立即按新条件重画
</script>

<style scoped>
.panel { background:#1a2332; border-radius:8px; padding:16px; border:1px solid #2a3a4a }
.panel-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px }
.panel h3 { color:#90caf9; font-size:14px }
.th-bar { display:flex; align-items:center; gap:8px }
.th-current { font-size:12px; color:#ffa726 }
.const-canvas { display:block; margin:0 auto; border-radius:4px }
.th-stats { margin-top:8px; text-align:center; font-size:12px; color:#8899aa }
.th-stats .out { color:#ef5350 }
.dlg-hint { margin-top:8px; font-size:12px; color:#8899aa }
</style>
