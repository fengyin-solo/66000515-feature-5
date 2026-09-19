import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { AnalysisResult } from '@/types'

// 判决门限（幅度半径）允许范围：(THRESHOLD_MIN, THRESHOLD_MAX]
export const THRESHOLD_MIN = 0
export const THRESHOLD_MAX = 2

export const useSignalStore = defineStore('signal', () => {
  const loading = ref(false)
  const result = ref<AnalysisResult | null>(null)
  const activeView = ref('spectrum')
  // 判决门限：|I+jQ| > threshold 判为越限；切换数据后保留，按当前门限重新判定
  const threshold = ref(1.2)

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

  return { loading, result, activeView, threshold, analyze, importCSV }
})