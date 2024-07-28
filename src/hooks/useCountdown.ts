/**
 * Description: 倒计时，默认60s开始
 * Author: BaiQi
 * Created Date: 2024-06-28
 */
import { ref, onUnmounted } from 'vue';

export function useCountdown(initCount = 60, interval = 1) {
    const countdown = ref(0);
    const isStart = ref(false);
    let time = null;

    const stop = () => {
        clearInterval(time);
    };

    const start = () => {
        countdown.value = initCount;
        isStart.value = true;
        time = setInterval(() => {
            countdown.value -= interval;
            if (countdown.value <= 0) {
                clearInterval(time);
                isStart.value = false;
                countdown.value = 0;
            }
        }, 1000);
    };

    onUnmounted(() => {
        clearInterval(time);
    });

    return {
        stop,
        start,
        countdown,
        isStart,
    };
}
