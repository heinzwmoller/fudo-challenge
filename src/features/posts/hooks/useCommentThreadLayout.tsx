import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";

export type CommentThreadLayoutConfig = {
  indentPx: number;
  guideColor: string;
  guideWidthPx: number;
  cornerRadiusPx: number;
  avatarSizePx: number;
  horizontalOffsetPx?: number;
};

type GuideMetrics = {
  top: number;
  height: number;
};

type UseCommentThreadLayoutArgs = {
  hasReplies: boolean;
  depth: number;
  config: CommentThreadLayoutConfig;
};

export function useCommentThreadLayout({
  hasReplies,
  depth,
  config,
}: UseCommentThreadLayoutArgs) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const repliesRef = useRef<HTMLDivElement | null>(null);
  const avatarRef = useRef<HTMLDivElement | null>(null);
  const [verticalGuide, setVerticalGuide] = useState<GuideMetrics | null>(null);

  const layout = useMemo<CommentThreadLayoutConfig>(
    () => ({
      horizontalOffsetPx: 0,
      ...config,
    }),
    [config]
  );

  const metrics = useMemo(() => {
    const lineLeft =
      Math.max(
        0,
        layout.avatarSizePx / 2 -
          layout.guideWidthPx / 2 +
          (layout.horizontalOffsetPx ?? 0)
      ) || 0;
    const elbowWidth = Math.max(layout.indentPx - lineLeft, 0);
    return {
      lineLeft,
      elbowWidth,
    };
  }, [layout]);

  useLayoutEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const rootEl = rootRef.current;
    const repliesEl = repliesRef.current;
    const avatarEl = avatarRef.current;

    if (!hasReplies || !rootEl || !repliesEl || !avatarEl) {
      setVerticalGuide(null);
      return;
    }

    let frame: number | null = null;

    const compute = () => {
      frame = null;
      const rootRect = rootEl.getBoundingClientRect();
      const avatarRect = avatarEl.getBoundingClientRect();
      const lastChild = repliesEl.lastElementChild as HTMLElement | null;

      if (!lastChild) {
        setVerticalGuide(null);
        return;
      }

      const startTop = avatarRect.top + avatarRect.height / 2 - rootRect.top;

      const lastElbow = lastChild.querySelector<HTMLElement>(
        '[data-testid="elbow"]'
      );

      let endY: number | null = null;

      if (lastElbow) {
        const elbowRect = lastElbow.getBoundingClientRect();
        endY = elbowRect.bottom - rootRect.top;
      }

      if (endY === null) {
        const lastAvatar = lastChild.querySelector<HTMLImageElement>(
          '[data-testid="avatar-wrap"] img'
        );
        if (lastAvatar) {
          const avatarBounds = lastAvatar.getBoundingClientRect();
          endY = avatarBounds.top + avatarBounds.height / 2 - rootRect.top;
        }
      }

      if (endY === null) {
        const fallbackRect = lastChild.getBoundingClientRect();
        endY = fallbackRect.top + layout.avatarSizePx / 2 - rootRect.top;
      }

      const lineWidth = Math.max(1, layout.guideWidthPx);
      const height = Math.max(0, endY - startTop - lineWidth - 20 / 2);
      setVerticalGuide({ top: startTop, height });
    };

    const scheduleCompute = () => {
      if (frame !== null) {
        cancelAnimationFrame(frame);
      }
      frame = requestAnimationFrame(compute);
    };

    scheduleCompute();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(scheduleCompute);
      resizeObserver.observe(rootEl);
      resizeObserver.observe(repliesEl);
    }

    let mutationObserver: MutationObserver | null = null;
    if (typeof MutationObserver !== "undefined") {
      mutationObserver = new MutationObserver(scheduleCompute);
      mutationObserver.observe(repliesEl, {
        childList: true,
        subtree: true,
      });
    }

    window.addEventListener("resize", scheduleCompute);

    return () => {
      if (frame !== null) {
        cancelAnimationFrame(frame);
      }
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      window.removeEventListener("resize", scheduleCompute);
    };
  }, [hasReplies, layout.avatarSizePx, layout.guideWidthPx, metrics.lineLeft]);

  const nodeStyle = useMemo<CSSProperties>(() => {
    if (depth <= 0) {
      return {};
    }
    return {
      marginLeft: `${layout.indentPx}px`,
    };
  }, [depth, layout.indentPx]);

  const verticalStyle = useMemo<CSSProperties | undefined>(() => {
    if (!verticalGuide) {
      return undefined;
    }
    return {
      left: `${metrics.lineLeft}px`,
      top: `${verticalGuide.top}px`,
      height: `${verticalGuide.height}px`,
      width: `${layout.guideWidthPx}px`,
      backgroundColor: layout.guideColor,
      zIndex: 5,
      pointerEvents: "none",
    };
  }, [layout.guideColor, layout.guideWidthPx, metrics.lineLeft, verticalGuide]);

  const elbowStyle = useMemo<CSSProperties>(
    () => ({
      left: `${-metrics.elbowWidth}px`,
      top: `${-layout.avatarSizePx / 2}px`,
      width: `${metrics.elbowWidth}px`,
      height: `${layout.avatarSizePx}px`,
      borderLeftWidth: `${layout.guideWidthPx}px`,
      borderBottomWidth: `${layout.guideWidthPx}px`,
      borderLeftStyle: "solid",
      borderBottomStyle: "solid",
      borderColor: layout.guideColor,
      borderBottomLeftRadius: `${layout.cornerRadiusPx}px`,
      pointerEvents: "none",
      zIndex: 5,
    }),
    [
      layout.avatarSizePx,
      layout.cornerRadiusPx,
      layout.guideColor,
      layout.guideWidthPx,
      metrics.elbowWidth,
    ]
  );

  return {
    rootRef,
    repliesRef,
    avatarRef,
    nodeStyle,
    verticalStyle,
    elbowStyle,
    hasVerticalGuide: hasReplies && !!verticalGuide,
  };
}
