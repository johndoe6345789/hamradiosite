import { renderHook, act } from '@testing-library/react';
import useCountdown from './useCountdown';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('useCountdown', () => {
  it('formats time correctly at initialization', () => {
    const onTimeUp = jest.fn();
    const { result } = renderHook(() => useCountdown(125, onTimeUp));

    expect(result.current.formatted).toBe('02:05');
    expect(result.current.isLowTime).toBe(true);
  });

  it('decrements every second', () => {
    const onTimeUp = jest.fn();
    const { result } = renderHook(() => useCountdown(10, onTimeUp));

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.formatted).toBe('00:09');
  });

  it('calls onTimeUp when reaching zero', () => {
    const onTimeUp = jest.fn();
    renderHook(() => useCountdown(2, onTimeUp));

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(onTimeUp).toHaveBeenCalledTimes(1);
  });

  it('stops at zero and does not go negative', () => {
    const onTimeUp = jest.fn();
    const { result } = renderHook(() => useCountdown(1, onTimeUp));

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.formatted).toBe('00:00');
    expect(onTimeUp).toHaveBeenCalledTimes(1);
  });

  it('isLowTime is false when secondsLeft >= 300', () => {
    const onTimeUp = jest.fn();
    const { result } = renderHook(() => useCountdown(300, onTimeUp));

    expect(result.current.isLowTime).toBe(false);
  });

  it('isLowTime is true when secondsLeft < 300', () => {
    const onTimeUp = jest.fn();
    const { result } = renderHook(() => useCountdown(299, onTimeUp));

    expect(result.current.isLowTime).toBe(true);
  });

  it('formats with leading zeros correctly', () => {
    const onTimeUp = jest.fn();
    const { result } = renderHook(() => useCountdown(61, onTimeUp));

    expect(result.current.formatted).toBe('01:01');
  });

  it('clears interval on unmount', () => {
    const onTimeUp = jest.fn();
    const { unmount } = renderHook(() => useCountdown(60, onTimeUp));

    unmount();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(onTimeUp).not.toHaveBeenCalled();
  });

  it('uses latest onTimeUp callback via ref', () => {
    const onTimeUp1 = jest.fn();
    const onTimeUp2 = jest.fn();

    const { rerender } = renderHook(
      ({ cb }) => useCountdown(2, cb),
      { initialProps: { cb: onTimeUp1 } }
    );

    rerender({ cb: onTimeUp2 });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(onTimeUp1).not.toHaveBeenCalled();
    expect(onTimeUp2).toHaveBeenCalledTimes(1);
  });
});
