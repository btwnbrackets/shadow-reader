import { commonStyles } from "@/style/commonStyles";
import { View } from "react-native";
import { RowField, TableRow } from "./Row";

type Props = {
  rowData: RowField[];
};

export function Table({ rowData }: Props) {
  return (
    <View style={commonStyles.gapM}>
      {rowData.map((row) => {
        return (
          <TableRow
            key={row.label}
            {...row}
          />
        );
      })}
    </View>
  );
}
