import React, { useCallback } from "react";
import { Heart } from "lucide-react";
import favoritesApi from "../../api/favoritesApi";
import useFetch from "../../hooks/useFetch";
import useToast from "../../hooks/useToast";
import PetCard from "../../components/cards/PetCard";
import { SkeletonCard } from "../../components/common/Loader";
import { EmptyState, ErrorState } from "../../components/common/StateDisplays";
import "../Public/PetCatalog.css";

export default function Favorites() {
  const toast = useToast();
  const { data, loading, error, refetch, setData } = useFetch(
    () => favoritesApi.getFavorites().then((r) => r.data.items ?? r.data ?? []),
    []
  );

  const handleRemove = useCallback(
    async (pet) => {
      const prev = data;
      setData((d) => d.filter((p) => p.id !== pet.id));
      try {
        await favoritesApi.removeFavorite(pet.id);
        toast.info(`${pet.name} removed from favorites`);
      } catch (err) {
        setData(prev);
        toast.error(err.message);
      }
    },
    [data, setData, toast]
  );

  return (
    <div className="section container">
      <div className="page-header">
        <div>
          <span className="page-header__eyebrow">Your Account</span>
          <h1>Favorite pets</h1>
          <p>Pets you've saved for later — they'll stay here across sessions.</p>
        </div>
      </div>

      {error && <ErrorState message={error.message} onAction={refetch} />}

      {!error && loading && (
        <div className="catalog__grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!error && !loading && (!data || data.length === 0) && (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          message="Browse the catalog and tap the heart icon on any pet to save it here."
        />
      )}

      {!error && !loading && data && data.length > 0 && (
        <div className="catalog__grid">
          {data.map((pet) => (
            <PetCard key={pet.id} pet={pet} isFavorite onToggleFavorite={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
}
