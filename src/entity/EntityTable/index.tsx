import {EntityProps} from "../common/types.ts";

import { createUniver, defaultTheme, LocaleType, merge } from '@univerjs/presets'

import { UniverSheetsCorePreset } from '@univerjs/presets/preset-sheets-core'
import sheetsCoreZhCN from '@univerjs/presets/preset-sheets-core/locales/zh-CN'
import '@univerjs/presets/lib/styles/preset-sheets-core.css'

import { UniverSheetsConditionalFormattingPreset } from '@univerjs/presets/preset-sheets-conditional-formatting'
import sheetsConditionalFormattingZhCN from '@univerjs/presets/preset-sheets-conditional-formatting/locales/zh-CN'
import '@univerjs/presets/lib/styles/preset-sheets-conditional-formatting.css'

import { UniverSheetsDataValidationPreset } from '@univerjs/presets/preset-sheets-data-validation'
import sheetsDataValidationZhCN from '@univerjs/presets/preset-sheets-data-validation/locales/zh-CN'
import '@univerjs/presets/lib/styles/preset-sheets-data-validation.css'

// import { UniverSheetsDrawingPreset } from '@univerjs/presets/preset-sheets-drawing'
// import sheetsDrawingZhCN from '@univerjs/presets/preset-sheets-drawing/locales/zh-CN'
// import '@univerjs/presets/lib/styles/preset-sheets-drawing.css'

import { UniverSheetsFilterPreset } from '@univerjs/presets/preset-sheets-filter'
import sheetsFilterZhCN from '@univerjs/presets/preset-sheets-filter/locales/zh-CN'
import '@univerjs/presets/lib/styles/preset-sheets-filter.css'

import { UniverSheetsHyperLinkPreset } from '@univerjs/presets/preset-sheets-hyper-link'
import sheetsHyperLinkZhCN from '@univerjs/presets/preset-sheets-hyper-link/locales/zh-CN'
import '@univerjs/presets/lib/styles/preset-sheets-hyper-link.css'

import {useEffect, useRef} from "react";

// todo 实现图片功能
export default function EntityTable(props: EntityProps<any>) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const { univerAPI } = createUniver({
            locale: LocaleType.ZH_CN,
            locales: {[LocaleType.ZH_CN]: merge({},
                sheetsCoreZhCN,
                sheetsConditionalFormattingZhCN,
                sheetsDataValidationZhCN,
                // sheetsDrawingZhCN,
                sheetsFilterZhCN,
                sheetsHyperLinkZhCN,
            )},
            theme: defaultTheme,
            presets: [
                UniverSheetsCorePreset({container: containerRef.current!}),
                UniverSheetsConditionalFormattingPreset(),
                UniverSheetsDataValidationPreset(),
                // UniverSheetsDrawingPreset(),
                UniverSheetsFilterPreset(),
                UniverSheetsHyperLinkPreset(),
            ],
        });
        univerAPI.createWorkbook(props.value);
        univerAPI.addEvent("SheetValueChanged", () => {
            props.onChange(univerAPI.getActiveWorkbook()?.save() || {})
        });
        return () => {
            univerAPI.dispose();
        };
    }, []);

    return <div className={"w-full h-200"} ref={containerRef} />
}
