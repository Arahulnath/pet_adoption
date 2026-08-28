import React from "react";
import { Link } from "react-router-dom";
import { Heart, PawPrint } from "lucide-react";
import Badge from "../common/Badge";
import { formatAge, resolveImageUrl } from "../../utils/formatters";
import "./PetCard.css";

/**
 * Reusable pet card — used on the public catalog and on the Favorites
 * page. `onToggleFavorite` is optional so the same component works for
 * both guests (no favorite button) and registered users.
 */
export default function PetCard({ pet, isFavorite, onToggleFavorite }) {
  const image = resolveImageUrl(pet.imageUrl || pet.primaryImageUrl || pet.images?.[0]?.imageUrl);

  return (
    <article className="pet-card">
      <Link to={`/pets/${pet.id}`} className="pet-card__media-link">
        <div className="pet-card__media">
          {image ? (
            <img src={image} alt={pet.name} loading="lazy" />
          ) : (
            <div className="pet-card__media-fallback">
              <PawPrint size={32} />
            </div>
          )}
          <Badge status={pet.adoptionStatus} className="pet-card__badge" />
        </div>
      </Link>

      {onToggleFavorite && (
        <button
          className={`pet-card__fav ${isFavorite ? "pet-card__fav--active" : ""}`}
          onClick={() => onToggleFavorite(pet)}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? `Remove ${pet.name} from favorites` : `Add ${pet.name} to favorites`}
        >
          <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      )}

      <div className="pet-card__body">
        <Link to={`/pets/${pet.id}`} className="pet-card__name">
          {pet.name}
        </Link>
        <p className="pet-card__meta">
          {pet.breed || pet.species} · {formatAge(pet.age)}
        </p>
      </div>
    </article>
  );
}
