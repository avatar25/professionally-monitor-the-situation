import type { LayoutItem } from 'react-grid-layout';

export const GRID_BREAKPOINTS = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
export const GRID_COLS = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };
export const GRID_ROW_HEIGHT = 100;
export const GRID_MARGIN: [number, number] = [16, 16];

export const SIDEBAR_WIDTH = 64;
export const TOP_BAR_HEIGHT = 40;
export const GRID_EDGE_PADDING = 16;
export const CONTROL_PANEL_CLEARANCE = 112;

const VIDEO_ASPECT_RATIO = 16 / 9;

export interface AutoFitMetrics {
    width: number;
    height: number;
    cols: number;
    rowHeight: number;
    margin: [number, number];
}

function distributeUnits(total: number, buckets: number) {
    const base = Math.floor(total / buckets);
    const remainder = total % buckets;

    return Array.from({ length: buckets }, (_, index) => base + (index < remainder ? 1 : 0));
}

function getRowsForHeight(height: number, rowHeight: number, marginY: number) {
    return Math.max(1, Math.floor((height + marginY) / (rowHeight + marginY)));
}

function getRowCounts(itemCount: number, rowCount: number) {
    return distributeUnits(itemCount, rowCount).filter(count => count > 0);
}

function getLayoutScore(rowCounts: number[], rowHeights: number[], metrics: AutoFitMetrics) {
    const [marginX, marginY] = metrics.margin;
    const colWidth = (metrics.width - marginX * (metrics.cols - 1)) / metrics.cols;
    let score = 0;
    let itemCount = 0;

    rowCounts.forEach((itemsInRow, rowIndex) => {
        const colSpans = distributeUnits(metrics.cols, itemsInRow);
        const itemHeight = metrics.rowHeight * rowHeights[rowIndex] + marginY * (rowHeights[rowIndex] - 1);

        colSpans.forEach((colSpan) => {
            const itemWidth = colWidth * colSpan + marginX * (colSpan - 1);
            score += Math.abs(Math.log((itemWidth / itemHeight) / VIDEO_ASPECT_RATIO));
            itemCount += 1;
        });
    });

    const widestRow = Math.max(...rowCounts);
    const narrowestRow = Math.min(...rowCounts);
    const balancePenalty = (widestRow - narrowestRow) * 0.05;

    return score / itemCount + balancePenalty;
}

function getBestRowCounts(itemCount: number, metrics: AutoFitMetrics) {
    if (itemCount <= 2) {
        return [itemCount];
    }

    const availableRows = getRowsForHeight(metrics.height, metrics.rowHeight, metrics.margin[1]);
    let bestRowCounts = getRowCounts(itemCount, Math.ceil(Math.sqrt(itemCount)));
    let bestScore = Number.POSITIVE_INFINITY;

    for (let rowCount = Math.ceil(itemCount / metrics.cols); rowCount <= itemCount; rowCount += 1) {
        const rowCounts = getRowCounts(itemCount, rowCount);

        if (Math.max(...rowCounts) > metrics.cols) {
            continue;
        }

        const rowHeights = distributeUnits(Math.max(availableRows, rowCounts.length), rowCounts.length);
        const score = getLayoutScore(rowCounts, rowHeights, metrics);

        if (score < bestScore) {
            bestScore = score;
            bestRowCounts = rowCounts;
        }
    }

    return bestRowCounts;
}

export function getGridColsForWidth(width: number) {
    if (width >= GRID_BREAKPOINTS.lg) return GRID_COLS.lg;
    if (width >= GRID_BREAKPOINTS.md) return GRID_COLS.md;
    if (width >= GRID_BREAKPOINTS.sm) return GRID_COLS.sm;
    if (width >= GRID_BREAKPOINTS.xs) return GRID_COLS.xs;
    return GRID_COLS.xxs;
}

export function createAutoFitLayout(streamIds: string[], metrics: AutoFitMetrics): LayoutItem[] {
    if (streamIds.length === 0) {
        return [];
    }

    const rowCounts = getBestRowCounts(streamIds.length, metrics);
    const availableRows = getRowsForHeight(metrics.height, metrics.rowHeight, metrics.margin[1]);
    const rowHeights = distributeUnits(Math.max(availableRows, rowCounts.length), rowCounts.length);
    const layout: LayoutItem[] = [];
    let streamIndex = 0;
    let y = 0;

    rowCounts.forEach((itemsInRow, rowIndex) => {
        const colSpans = distributeUnits(metrics.cols, itemsInRow);
        let x = 0;

        colSpans.forEach((colSpan) => {
            layout.push({
                i: streamIds[streamIndex],
                x,
                y,
                w: colSpan,
                h: rowHeights[rowIndex],
            });

            streamIndex += 1;
            x += colSpan;
        });

        y += rowHeights[rowIndex];
    });

    return layout;
}
