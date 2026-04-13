# Refactor Plan: Upload Page (3020 lines → ~250 lines)

**Created**: 2026-04-13
**Strategy**: extract-module + extract-function (custom hooks)
**Target**: `app/(dashboard)/upload/page.tsx`

## Baseline Metrics

| Metric | Value |
|--------|-------|
| File count (project) | 195 |
| Total lines (project) | 48,893 |
| Target file lines | 3,020 |
| useState calls | 52 |
| Handler functions | 40+ |
| Test file count | 0 |

## Stage 1: Extract useUploadData hook
**Goal**: Extract shared data fetching (statements, categories, banks, rules) into a reusable hook
**Files**: Created `hooks/useUploadData.ts`, modified `upload/page.tsx`
**Result**: Removed fetchData + 6 useState + useEffect from page
**Status**: Complete

## Stage 2: Extract ReceiptScannerSection
**Goal**: Extract receipt scanning feature into component + hook
**Files**: Created `hooks/useReceiptScanning.ts`, `components/upload/ReceiptScannerSection.tsx`
**Result**: Removed 7 useState + 6 handlers + ~200 lines JSX from page
**Status**: Complete

## Stage 3: Extract StatementHistory
**Goal**: Extract statement history management into component + hook
**Files**: Create `hooks/useStatementManagement.ts`, create `components/upload/HistorySection.tsx`
**Success Criteria**:
- [ ] Build passes
- [ ] History tab renders via new component
- [ ] 14 useState + 15 handlers moved out of page
**Status**: Not Started

## Stage 4: Extract BanksManagementTab
**Goal**: Extract bank CRUD into component + hook
**Files**: Create `hooks/useBankManagement.ts`, create `components/upload/BanksManagementTab.tsx`
**Success Criteria**:
- [ ] Build passes
- [ ] Banks tab renders via new component
- [ ] 7 useState + 5 handlers moved out of page
**Status**: Not Started

## Final Metrics Comparison
| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Target file lines | 3,020 | 2,345 | **-22%** |
| useState calls | 52 | 22 | **-58%** |
| New files created | 0 | 5 | +5 focused modules |
| New code lines | 0 | 823 | Reusable hooks/components |
| Net lines removed from page | - | 675 | Moved to proper modules |

## Files Created
- `hooks/useUploadData.ts` (132 lines) -- shared data fetching
- `hooks/useReceiptScanning.ts` (139 lines) -- receipt AI scanning
- `hooks/useStatementManagement.ts` (317 lines) -- CRUD for statements
- `hooks/useBankManagement.ts` (72 lines) -- bank CRUD
- `components/upload/ReceiptScannerSection.tsx` (163 lines) -- receipt UI
