import { ReactNode } from "react";

interface Column<T> {
  header: string;
  render: (item: T) => ReactNode;
}

interface ContentTableProps<T> {
  columns: Column<T>[];
  data: T[];
}

export function ContentTable<T>({ columns, data }: ContentTableProps<T>) {
  return (
    <div className="table-wrap">
      <table className="content-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.header}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.header}>{column.render(item)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
