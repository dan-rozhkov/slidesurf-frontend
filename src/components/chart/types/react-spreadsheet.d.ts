declare module "react-spreadsheet" {
  import { FC } from "react";

  export type Cell = {
    value: string | number;
  };

  export type Matrix = Cell[][];

  type SpreadsheetProps = {
    data: Matrix;
    onChange: (data: Matrix) => void;
  };

  const Spreadsheet: FC<SpreadsheetProps>;
  export default Spreadsheet;
}

declare module "@iddan/react-spreadsheet" {
  export type Matrix = import("react-spreadsheet").Matrix;
}
