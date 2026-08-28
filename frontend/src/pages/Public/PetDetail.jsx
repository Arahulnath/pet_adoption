import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Heart, ArrowLeft, PawPrint, ShieldCheck } from "lucide-react";
import petApi from "../../api/petApi";
import adoptionRequestApi from "../../api/adoptionRequestApi";
import favoritesApi from "../../api/favoritesApi";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { Loader } from "../../components/common/Loader";
import { ErrorState } from "../../components/common/StateDisplays";
import AdoptionRequestForm from "../../components/forms/AdoptionRequestForm";
import { formatAge, resolveImageUrl } from "../../utils/formatters";
import { ADOPTION_STATUS } from "../../constants";
import useAuth from "../../hooks/useAuth";
import useToast from "../../hooks/useToast";
import "./PetDetail.css";

export default function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isUser, identity } = useAuth();
  const toast = useToast();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [requestOpen, setRequestOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const load = () => {
    setLoading(true);
    setError(null);
    petApi
      .getPetById(id)
      .then(({ data }) => setPet(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  useEffect(() => {
    if (!isUser) return;
    favoritesApi
      .getFavorites()
      .then(({ data }) => {
        const ids = (data.items ?? data ?? []).map((p) => p.id ?? p.petId);
        setIsFavorite(ids.includes(Number(id)) || ids.includes(id));
      })
      .catch(() => {});
  }, [isUser, id]);

  const handleToggleFavorite = async () => {
    const next = !isFavorite;
    setIsFavorite(next);
    try {
      if (next) {
        await favoritesApi.addFavorite(id);
        toast.success(`${pet.name} added to favorites`);
      } else {
        await favoritesApi.removeFavorite(id);
        toast.info(`${pet.name} removed from favorites`);
      }
    } catch (err) {
      setIsFavorite(!next);
      toast.error(err.message);
    }
  };

  const handleSubmitRequest = async (values) => {
    await adoptionRequestApi.createRequest({ petId: id, ...values });
    setRequestOpen(false);
    toast.success(`Request submitted! We'll email you about ${pet.name} soon.`);
    load();
  };

  if (loading) return <Loader label="Loading pet profile…" />;
  if (error)
    return (
      <div className="section container">
        <ErrorState message={error.message} onAction={load} />
      </div>
    );
  if (!pet) return null;

  const images = pet.images?.length ? pet.images : (pet.imageUrl || pet.primaryImageUrl) ? [{ imageUrl: pet.imageUrl || pet.primaryImageUrl }] : [];
  const canAdopt = pet.adoptionStatus === ADOPTION_STATUS.AVAILABLE;

  return (
    <div className="section container">
      <button className="pet-detail__back" onClick={() => navigate(-1)}>
        <ArrowLeft size={15} /> Back
      </button>

      <div className="pet-detail">
        <div className="pet-detail__gallery">
          <div className="pet-detail__hero-image">
            {images[activeImage] ? (
              <img src={resolveImageUrl(images[activeImage].imageUrl)} alt={pet.name} />
            ) : (
              <div className="pet-detail__hero-fallback">
                <PawPrint size={48} />
              </div>
            )}
            {isUser && (
              <button
                className={`pet-detail__fav ${isFavorite ? "pet-detail__fav--active" : ""}`}
                onClick={handleToggleFavorite}
                aria-pressed={isFavorite}
                aria-label="Toggle favorite"
              >
                <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
              </button>
            )}
          </div>
          {images.length > 1 && (
            <div className="pet-detail__thumbs">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  className={`pet-detail__thumb ${idx === activeImage ? "pet-detail__thumb--active" : ""}`}
                  onClick={() => setActiveImage(idx)}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img src={resolveImageUrl(img.imageUrl)} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pet-detail__info">
          <Badge status={pet.adoptionStatus} />
          <h1>{pet.name}</h1>
          <p className="pet-detail__meta">
            {pet.breed || pet.species} · {formatAge(pet.age)}
          </p>

          <p className="pet-detail__description">{pet.description}</p>

          <dl className="pet-detail__facts">
            <div>
              <dt>Species</dt>
              <dd>{pet.species}</dd>
            </div>
            <div>
              <dt>Breed</dt>
              <dd>{pet.breed || "—"}</dd>
            </div>
            <div>
              <dt>Age</dt>
              <dd>{formatAge(pet.age)}</dd>
            </div>
          </dl>

          {(pet.vaccinationStatus || pet.spayNeuterStatus) && (
            <div className="pet-detail__health">
              <ShieldCheck size={15} />
              <span>
                {pet.vaccinationStatus && <>Vaccinated: {pet.vaccinationStatus}</>}
                {pet.vaccinationStatus && pet.spayNeuterStatus && " · "}
                {pet.spayNeuterStatus && <>Spay/Neuter: {pet.spayNeuterStatus}</>}
              </span>
            </div>
          )}

          <div className="pet-detail__actions">
            {canAdopt ? (
              <Button variant="accent" size="lg" icon={PawPrint} onClick={() => setRequestOpen(true)}>
                Submit Adoption Request
              </Button>
            ) : (
              <Button variant="secondary" size="lg" disabled>
                {pet.adoptionStatus === ADOPTION_STATUS.PENDING
                  ? "Adoption pending"
                  : "Already adopted"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        title={`Adopt ${pet.name}`}
        size="md"
      >
        <AdoptionRequestForm
          initialValues={{
            applicantName: identity?.name,
            applicantEmail: identity?.email,
          }}
          onSubmit={handleSubmitRequest}
          onCancel={() => setRequestOpen(false)}
        />
      </Modal>
    </div>
  );
}
