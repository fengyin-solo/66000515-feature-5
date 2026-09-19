<template>
  <div class="panel">
    <div class="panel-header">
      <h3>⭐ 星座图 (IQ平面)</h3>
      <el-button size="small" @click="openSettings">⚙ 门限设置</el-button>
    </div>
    <canvas ref="cvs" width="300" height="300" class="const-canvas"></canvas>
    <div v-if="store.judgment.total" class="judge-info">
      门限 {{ store.threshold.toFixed(2) }}：超门限点
      <span class="out-count">{{ store.judgment.outliers.size }}</span> / {{ store.judgment.total }}
      （{{ (store.judgment.ratio * 100).toFixed(1) }}%）
    </div>

    <el-dialog v-model="dialogVisible" title="判决门限设置" width="340px">
      <el-form label-width="80px">
        <el-form-item label="判决门限">
          <el-input
            v-model="draft"
            :placeholder="`${THRESHOLD_MIN} ~ ${THRESHOLD_MAX}`"
            clearable
            @keyup.enter="applyThreshold"
          />
        </el-form-item>
        <div class="tip">幅度 |I+jQ| 超过门限的点将被红圈圈出，允许范围 {{ THRESHOLD_MIN }} ~ {{ THRESHOLD_MAX }}</div>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="applyThreshold">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useSignalStore, THRESHOLD_MIN, THRESHOLD_MAX } from '../store/signal'
const store = useSignalStore()
const cvs = ref<HTMLCanvasElement>()
const dialogVisible = ref(false)
const draft = ref('')

function openSettings() {
  // 以上一次生效的门限为初值；取消或校验失败都不会改动它
  draft.value = String(store.threshold)
  dialogVisible.value = true
}

function applyThreshold() {
  const raw = draft.value.trim()
  if (!raw) {
    ElMessage.warning('门限不能为空')
    return
  }
  const v = Number(raw)
  if (!Number.isFinite(v)) {
    ElMessage.warning('门限必须是有效数字')
    return
  }
  if (v < THRESHOLD_MIN || v > THRESHOLD_MAX) {
    ElMessage.warning(`门限需在 ${THRESHOLD_MIN} ~ ${THRESHOLD_MAX} 之间`)
    return
  }
  // 仅校验通过才生效，否则保留原门限与已有判定结果
  store.setThreshold(v)
  dialogVisible.value = false
}

function draw() {
  const c = cvs.value
  if (!c) return
  const ctx = c.getContext('2d')!
  const W = c.width, H = c.height
  ctx.fillStyle = '#0d1520'; ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = '#2a3a4a'; ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(0, H/2); ctx.lineTo(W, H/2); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(W/2, 0); ctx.lineTo(W/2, H); ctx.stroke()

  const scale = W * 0.4
  // 判决门限圆
  ctx.beginPath()
  ctx.setLineDash([5, 4])
  ctx.arc(W/2, H/2, store.threshold * scale, 0, Math.PI*2)
  ctx.strokeStyle = '#ffa726'
  ctx.stroke()
  ctx.setLineDash([])

  const pts = store.result?.constellation || []
  if (pts.length === 0) return
  const outliers = store.judgment.outliers
  for (const pt of pts) {
    const x = W/2 + pt.i * scale, y = H/2 - pt.q * scale
    const out = outliers.has(pt)
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI*2)
    ctx.fillStyle = out ? '#ef5350' : '#42a5f5'; ctx.fill()
    if (out) {
      // 圈出落在门限之外的点
      ctx.beginPath(); ctx.arc(x, y, 6.5, 0, Math.PI*2)
      ctx.strokeStyle = '#ef5350'; ctx.lineWidth = 1.5; ctx.stroke()
    } else {
      ctx.strokeStyle = 'rgba(66,165,245,0.5)'; ctx.stroke()
    }
  }
  ctx.fillStyle = '#8899aa'; ctx.font = '10px system-ui'
  ctx.fillText('I →', W-25, H/2-5); ctx.fillText('Q ↑', W/2+5, 14)
}

onMounted(draw)
// 数据切换或门限调整都按当前条件重画
watch(() => [store.result, store.threshold], draw)
</script>

<style scoped>
.panel { background:#1a2332; border-radius:8px; padding:16px; border:1px solid #2a3a4a }
.panel-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px }
.panel-header h3 { color:#90caf9; font-size:14px }
.const-canvas { display:block; margin:0 auto; border-radius:4px }
.judge-info { margin-top:8px; text-align:center; font-size:12px; color:#8899aa }
.out-count { color:#ef5350; font-weight:700 }
.tip { font-size:12px; color:#8899aa; margin:-8px 0 4px 80px }
</style>
