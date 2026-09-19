/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useSignalStore, THRESHOLD_MIN, THRESHOLD_MAX } from '../store/signal';
const store = useSignalStore();
const cvs = ref();
const dialogVisible = ref(false);
const draft = ref('');
function openSettings() {
    // 以上一次生效的门限为初值；取消或校验失败都不会改动它
    draft.value = String(store.threshold);
    dialogVisible.value = true;
}
function applyThreshold() {
    const raw = draft.value.trim();
    if (!raw) {
        ElMessage.warning('门限不能为空');
        return;
    }
    const v = Number(raw);
    if (!Number.isFinite(v)) {
        ElMessage.warning('门限必须是有效数字');
        return;
    }
    if (v < THRESHOLD_MIN || v > THRESHOLD_MAX) {
        ElMessage.warning(`门限需在 ${THRESHOLD_MIN} ~ ${THRESHOLD_MAX} 之间`);
        return;
    }
    // 仅校验通过才生效，否则保留原门限与已有判定结果
    store.setThreshold(v);
    dialogVisible.value = false;
}
function draw() {
    const c = cvs.value;
    if (!c)
        return;
    const ctx = c.getContext('2d');
    const W = c.width, H = c.height;
    ctx.fillStyle = '#0d1520';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#2a3a4a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    ctx.lineTo(W, H / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(W / 2, 0);
    ctx.lineTo(W / 2, H);
    ctx.stroke();
    const scale = W * 0.4;
    // 判决门限圆
    ctx.beginPath();
    ctx.setLineDash([5, 4]);
    ctx.arc(W / 2, H / 2, store.threshold * scale, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffa726';
    ctx.stroke();
    ctx.setLineDash([]);
    const pts = store.result?.constellation || [];
    if (pts.length === 0)
        return;
    const outliers = store.judgment.outliers;
    for (const pt of pts) {
        const x = W / 2 + pt.i * scale, y = H / 2 - pt.q * scale;
        const out = outliers.has(pt);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = out ? '#ef5350' : '#42a5f5';
        ctx.fill();
        if (out) {
            // 圈出落在门限之外的点
            ctx.beginPath();
            ctx.arc(x, y, 6.5, 0, Math.PI * 2);
            ctx.strokeStyle = '#ef5350';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
        else {
            ctx.strokeStyle = 'rgba(66,165,245,0.5)';
            ctx.stroke();
        }
    }
    ctx.fillStyle = '#8899aa';
    ctx.font = '10px system-ui';
    ctx.fillText('I →', W - 25, H / 2 - 5);
    ctx.fillText('Q ↑', W / 2 + 5, 14);
}
onMounted(draw);
// 数据切换或门限调整都按当前条件重画
watch(() => [store.result, store.threshold], draw);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
const __VLS_0 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    size: "small",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClick: (__VLS_ctx.openSettings)
};
__VLS_3.slots.default;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.canvas, __VLS_intrinsicElements.canvas)({
    ref: "cvs",
    width: "300",
    height: "300",
    ...{ class: "const-canvas" },
});
/** @type {typeof __VLS_ctx.cvs} */ ;
if (__VLS_ctx.store.judgment.total) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "judge-info" },
    });
    (__VLS_ctx.store.threshold.toFixed(2));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "out-count" },
    });
    (__VLS_ctx.store.judgment.outliers.size);
    (__VLS_ctx.store.judgment.total);
    ((__VLS_ctx.store.judgment.ratio * 100).toFixed(1));
}
const __VLS_8 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    modelValue: (__VLS_ctx.dialogVisible),
    title: "判决门限设置",
    width: "340px",
}));
const __VLS_10 = __VLS_9({
    modelValue: (__VLS_ctx.dialogVisible),
    title: "判决门限设置",
    width: "340px",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    labelWidth: "80px",
}));
const __VLS_14 = __VLS_13({
    labelWidth: "80px",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
const __VLS_16 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    label: "判决门限",
}));
const __VLS_18 = __VLS_17({
    label: "判决门限",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.draft),
    placeholder: (`${__VLS_ctx.THRESHOLD_MIN} ~ ${__VLS_ctx.THRESHOLD_MAX}`),
    clearable: true,
}));
const __VLS_22 = __VLS_21({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.draft),
    placeholder: (`${__VLS_ctx.THRESHOLD_MIN} ~ ${__VLS_ctx.THRESHOLD_MAX}`),
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
let __VLS_24;
let __VLS_25;
let __VLS_26;
const __VLS_27 = {
    onKeyup: (__VLS_ctx.applyThreshold)
};
var __VLS_23;
var __VLS_19;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "tip" },
});
(__VLS_ctx.THRESHOLD_MIN);
(__VLS_ctx.THRESHOLD_MAX);
var __VLS_15;
{
    const { footer: __VLS_thisSlot } = __VLS_11.slots;
    const __VLS_28 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        ...{ 'onClick': {} },
    }));
    const __VLS_30 = __VLS_29({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    let __VLS_32;
    let __VLS_33;
    let __VLS_34;
    const __VLS_35 = {
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
        }
    };
    __VLS_31.slots.default;
    var __VLS_31;
    const __VLS_36 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_38 = __VLS_37({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    let __VLS_40;
    let __VLS_41;
    let __VLS_42;
    const __VLS_43 = {
        onClick: (__VLS_ctx.applyThreshold)
    };
    __VLS_39.slots.default;
    var __VLS_39;
}
var __VLS_11;
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['const-canvas']} */ ;
/** @type {__VLS_StyleScopedClasses['judge-info']} */ ;
/** @type {__VLS_StyleScopedClasses['out-count']} */ ;
/** @type {__VLS_StyleScopedClasses['tip']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            THRESHOLD_MIN: THRESHOLD_MIN,
            THRESHOLD_MAX: THRESHOLD_MAX,
            store: store,
            cvs: cvs,
            dialogVisible: dialogVisible,
            draft: draft,
            openSettings: openSettings,
            applyThreshold: applyThreshold,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
