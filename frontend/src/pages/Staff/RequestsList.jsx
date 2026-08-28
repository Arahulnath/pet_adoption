import React, { useCallback, useState } from "react";
import { Eye } from "lucide-react";
import adoptionRequestApi from "../../api/adoptionRequestApi";
import useFetch from "../../hooks/useFetch";
import useToast from "../../hooks/useToast";
import DataTable from "../../components/tables/DataTable";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { Select } from "../../components/common/FormField";
import Pagination from "../../components/common/Pagination";
import { formatDateTime } from "../../utils/formatters";
import { REQUEST_STATUS_OPTIONS, TABLE_PAGE_SIZE } from "../../constants";
import "./Staff.css";

export default function RequestsList() {
  const toast = useToast();
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [activeRequest, setActiveRequest] = useState(null);
  const [updating, setUpdating] = useState(false);

  const { data, loading, error, refetch } = useFetch(
    () =>
      adoptionRequestApi
        .getRequests({ status: statusFilter || undefined, page, limit: TABLE_PAGE_SIZE })
        .then((r) => r.data),
    [statusFilter, page]
  );

  const requests = data?.items ?? data?.data ?? (Array.isArray(data) ? data : []);
  const total = data?.total ?? data?.count ?? requests.length;
  const totalPages = Math.max(1, Math.ceil(total / TABLE_PAGE_SIZE));

  const handleStatusChange = useCallback(
    async (request, newStatus) => {
      setUpdating(true);
      try {
        await adoptionRequestApi.updateRequestStatus(request.id, newStatus);
        toast.success(`Request for ${request.petName || "pet"} marked as ${newStatus}.`);
        setActiveRequest(null);
        refetch();
      } catch (err) {
        toast.error(err.message);
      } finally {
        setUpdating(false);
      }
    },
    [toast, refetch]
  );

  const columns = [
    { key: "applicantName", header: "Applicant", render: (row) => <strong>{row.applicantName}</strong> },
    { key: "petName", header: "Pet", render: (row) => row.petName || row.pet?.name || `#${row.petId}` },
    { key: "applicantEmail", header: "Contact", render: (row) => row.applicantEmail },
    {
      key: "submissionDate",
      header: "Submitted",
      render: (row) => formatDateTime(row.submissionDate || row.createdAt),
    },
    { key: "status", header: "Status", render: (row) => <Badge status={row.status} /> },
    {
      key: "actions",
      header: "",
      width: 90,
      render: (row) => (
        <div className="row-actions">
          <Button
            size="sm"
            variant="ghost"
            icon={Eye}
            onClick={() => setActiveRequest(row)}
            aria-label={`View request from ${row.applicantName}`}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="staff-page">
      <div className="page-header">
        <div>
          <span className="page-header__eyebrow">Adoption Requests</span>
          <h1>Manage requests</h1>
          <p>Review applications and move each one through the approval lifecycle (FR9 / FR10).</p>
        </div>
      </div>

      <div className="staff-page__filters">
        <Select
          name="statusFilter"
          placeholder="All statuses"
          options={REQUEST_STATUS_OPTIONS}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by status"
        />
      </div>

      {error ? (
        <div className="data-table">
          <p className="text-error" style={{ padding: "var(--sp-6)" }}>
            {error.message}{" "}
            <button className="staff-page__retry" onClick={refetch}>
              Try again
            </button>
          </p>
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={requests}
            loading={loading}
            emptyTitle="No adoption requests"
            emptyMessage="Requests submitted by adopters will appear here."
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={total}
            pageSize={TABLE_PAGE_SIZE}
            onPageChange={setPage}
          />
        </>
      )}

      <Modal
        open={Boolean(activeRequest)}
        onClose={() => setActiveRequest(null)}
        title="Adoption request details"
        size="sm"
      >
        {activeRequest && (
          <div className="request-detail">
            <dl>
              <div>
                <dt>Applicant</dt>
                <dd>{activeRequest.applicantName}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{activeRequest.applicantEmail}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{activeRequest.applicantPhone}</dd>
              </div>
              <div>
                <dt>Pet</dt>
                <dd>{activeRequest.petName || activeRequest.pet?.name || `#${activeRequest.petId}`}</dd>
              </div>
              <div>
                <dt>Submitted</dt>
                <dd>{formatDateTime(activeRequest.submissionDate || activeRequest.createdAt)}</dd>
              </div>
            </dl>

            <Select
              label="Update status"
              name="status"
              options={REQUEST_STATUS_OPTIONS}
              value={activeRequest.status}
              onChange={(e) => handleStatusChange(activeRequest, e.target.value)}
              hint="Approving auto-marks the pet Adopted; rejecting reverts it to Available (FR10)."
            />
            {updating && <p className="text-muted">Updating…</p>}
          </div>
        )}
      </Modal>
    </div>
  );
}
