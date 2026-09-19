import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import type { AnalysisResult, ConstellationPoint } from '@/types'

// 判决门限允许范围（幅度半径）
export const THRESHOLD_MIN = 0.1
export const THRESHOLD_MAX = 2.0

export const useSignalStore = defineStore('signal', () => {
  const loading = ref(false)
  const result = ref<AnalysisResult | null>(null)
  const activeView = ref('spectrum')

  // 判决门限：|I+jQ| 超过该值的星座点判为超门限点
  const threshold = ref(1.0)

  function setThreshold(v: number) {
    threshold.value = v
  }

  // 按当前门限的判决结果；数据或门限变化时自动重新判定
  const judgment = computed(() => {
    const pts = result.value?.constellation ?? []
    const t = threshold.value
    const outliers = new Set<ConstellationPoint>()
    for (const p of pts) {
      if (Math.hypot(p.i, p.q) > t) outliers.add(p)
    }
    return {
      total: pts.length,
      outliers,
      ratio: pts.length ? outliers.size / pts.length : 0
    }
  })

  async function analyze(params: { modulation: string; samples: number; snr: number }) {
    loading.value = true
    try {
      const { data } = await axios.post('/api/generate', params)
      result.value = data
    } finally { loading.value = false }
  }

  async function importCSV(formData: FormData) {
    loading.value = true
    try {
      const { data } = await axios.post('/api/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      result.value = data
    } finally { loading.value = false }
  }

  return { loading, result, activeView, threshold, setThreshold, judgment, analyze, importCSV }
})
