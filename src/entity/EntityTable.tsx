import {EntityProps} from "./common.ts";
import { HotTable } from '@handsontable/react-wrapper';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';
import {CellValue} from "handsontable/common";

registerAllModules();

interface EntityTableInfo {
    data: CellValue[][] | null
}

export default function EntityTable(props: EntityProps<EntityTableInfo>) {


    return <HotTable
        data={props.value?.data || [['1']]}
        afterChange={function (_, source) {
            if (source!== 'loadData') {
                // @ts-ignore
                const data = this.getData();
                props.onChange({data})
            }
        }}
        stretchH="all"
        contextMenu={true}
        rowHeaders={true}
        colHeaders={false}
        height="100%"
        width="100%"
        autoWrapRow={true}
        autoWrapCol={true}
        licenseKey="non-commercial-and-evaluation"
    />
}
