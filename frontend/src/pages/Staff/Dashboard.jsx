import React from "react";
import { PawPrint, ClipboardList, CheckCircle2, Clock, Eye, TrendingUp } from "lucide-react";
import dashboardApi from "../../api/dashboardApi";
import useFetch from "../../hooks/useFetch";
import StatCard from "../../components/common/StatCard";
import { Loader } from "../../components/common/Loader";
import { ErrorState } from "../../components/common/StateDisplays";
import "./Dashboard.css";

export default function Dashboard() {
  const { data, loading, error, refetch } = useFetch(
    () => dashboardApi.getStats().then((r) => r.data),
    []
  );

  return (
    <div className="staff-page">
      <div className="page-header">
        <div>
          <span className="page-header__eyebrow">Overview</span>
          <h1>Dashboard</h1>
          <p>Key metrics for pet listings and adoption activity (FR14).</p>
        </div>
      </div>

      {loading && <Loader label="Loading dashboard…" />}
      {error && <ErrorState message={error.message} onAction={refetch} />}

      {!loading && !error && data && (
        <>
          <div className="dashboard__stats">
            <StatCard icon={PawPrint} label="Total pets" value={data.totalPets ?? 0} tone="primary" />
            <StatCard
              icon={CheckCircle2}
              label="Available pets"
              value={data.availablePets ?? 0}
              tone="success"
            />
            <StatCard
              icon={ClipboardList}
              label="Total requests"
              value={data.totalRequests ?? 0}
              tone="info"
            />
            <StatCard
              icon={Clock}
              label="Pending requests"
              value={data.pendingRequests ?? 0}
              tone="warning"
            />
          </div>

          <div className="dashboard__grid">
            <div className="dashboard__panel">
              <h2>
                <TrendingUp size={17} /> Requests by status
              </h2>
              <ul className="dashboard__breakdown">
                {Object.entries(data.requestsByStatus || {}).map(([status, count]) => (
                  <li key={status}>
                    <span>{status}</span>
                    <strong>{count}</strong>
                  </li>
                ))}
                {!data.requestsByStatus && <p className="text-muted">No breakdown available.</p>}
              </ul>
            </div>

            <div className="dashboard__panel">
              <h2>
                <Eye size={17} /> Most-viewed pets
              </h2>
              <ul className="dashboard__breakdown">
                {(data.mostViewedPets || []).map((pet) => (
                  <li key={pet.id || pet.name}>
                    <span>{pet.name}</span>
                    <strong>{pet.views} views</strong>
                  </li>
                ))}
                {(!data.mostViewedPets || data.mostViewedPets.length === 0) && (
                  <p className="text-muted">No view data yet.</p>
                )}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
