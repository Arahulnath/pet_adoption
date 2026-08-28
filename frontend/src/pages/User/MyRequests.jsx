import React from "react";
import { ClipboardList } from "lucide-react";
import adoptionRequestApi from "../../api/adoptionRequestApi";
import useFetch from "../../hooks/useFetch";
import Badge from "../../components/common/Badge";
import { Loader } from "../../components/common/Loader";
import { EmptyState, ErrorState } from "../../components/common/StateDisplays";
import { formatDate } from "../../utils/formatters";
import "./MyRequests.css";

export default function MyRequests() {
  const { data, loading, error, refetch } = useFetch(
    () => adoptionRequestApi.getMyRequests().then((r) => r.data.items ?? r.data ?? []),
    []
  );

  return (
    <div className="section container">
      <div className="page-header">
        <div>
          <span className="page-header__eyebrow">Your Account</span>
          <h1>My adoption requests</h1>
          <p>Track the status of every request you've submitted.</p>
        </div>
      </div>

      {loading && <Loader label="Loading your requests…" />}
      {error && <ErrorState message={error.message} onAction={refetch} />}

      {!loading && !error && (!data || data.length === 0) && (
        <EmptyState
          icon={ClipboardList}
          title="No requests yet"
          message="When you submit an adoption request from a pet's profile, it will show up here."
        />
      )}

      {!loading && !error && data && data.length > 0 && (
        <div className="my-requests">
          {data.map((req) => (
            <div key={req.id} className="my-requests__item">
              <div>
                <h3>{req.petName || req.pet?.name || `Pet #${req.petId}`}</h3>
                <p>Submitted {formatDate(req.submissionDate || req.createdAt)}</p>
              </div>
              <Badge status={req.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
