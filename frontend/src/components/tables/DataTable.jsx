import React from "react";
import { SkeletonRow } from "../common/Loader";
import { EmptyState } from "../common/StateDisplays";
import "./DataTable.css";

/**
 * Generic, reusable data table driven entirely by a `columns` config —
 * the concrete example referenced throughout the SRS/viva notes
 * ("<DataTable columns={columns} data={users} .../>"). Used for both the
 * Staff Pets list and the Staff Adoption Requests list so table markup,
 * loading skeletons, and empty state only exist once in the codebase.
 *
 * columns: [{ key, header, render?(row) }]
 */
export default function DataTable({
  columns,
  data = [],
  loading = false,
  emptyTitle = "No records found",
  emptyMessage = "There's nothing to show here yet.",
  rowKey = "id",
}) {
  const showEmpty = !loading && data.length === 0;

  return (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ width: col.width }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading &&
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} columns={columns.length} />)}

          {!loading &&
            data.map((row) => (
              <tr key={row[rowKey]}>
                {columns.map((col) => (
                  <td key={col.key} data-label={col.header}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>

      {showEmpty && (
        <EmptyState title={emptyTitle} message={emptyMessage} />
      )}
    </div>
  );
}
