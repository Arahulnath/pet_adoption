import React from "react";
import { MapPin, Clock, Phone, Mail } from "lucide-react";
import shelterApi from "../../api/shelterApi";
import useFetch from "../../hooks/useFetch";
import { Loader } from "../../components/common/Loader";
import { ErrorState } from "../../components/common/StateDisplays";
import "./Shelter.css";

export default function Shelter() {
  const { data, loading, error, refetch } = useFetch(
    () => shelterApi.getShelterInfo().then((r) => r.data),
    []
  );

  return (
    <div className="section container">
      <div className="page-header">
        <div>
          <span className="page-header__eyebrow">Our Shelter</span>
          <h1>Visit us in person</h1>
          <p>Meet our pets, ask questions, and learn more about the adoption process.</p>
        </div>
      </div>

      {loading && <Loader label="Loading shelter information…" />}
      {error && <ErrorState message={error.message} onAction={refetch} />}

      {!loading && !error && data && (
        <div className="shelter-info">
          <div className="shelter-info__item">
            <MapPin size={18} />
            <div>
              <h3>Address</h3>
              <p>{data.address || "Address not available"}</p>
            </div>
          </div>
          <div className="shelter-info__item">
            <Clock size={18} />
            <div>
              <h3>Operating hours</h3>
              <p>{data.operatingHours || "Please call for hours"}</p>
            </div>
          </div>
          <div className="shelter-info__item">
            <Phone size={18} />
            <div>
              <h3>Phone</h3>
              <p>{data.contactPhone || "—"}</p>
            </div>
          </div>
          <div className="shelter-info__item">
            <Mail size={18} />
            <div>
              <h3>Email</h3>
              <p>{data.contactEmail || "—"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
