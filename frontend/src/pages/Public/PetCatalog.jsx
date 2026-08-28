import React, { useCallback, useEffect, useState } from "react";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";
import petApi from "../../api/petApi";
import favoritesApi from "../../api/favoritesApi";
import PetCard from "../../components/cards/PetCard";
import { SkeletonCard } from "../../components/common/Loader";
import { EmptyState, ErrorState } from "../../components/common/StateDisplays";
import { Input, Select } from "../../components/common/FormField";
import Pagination from "../../components/common/Pagination";
import useDebounce from "../../hooks/useDebounce";
import useAuth from "../../hooks/useAuth";
import useToast from "../../hooks/useToast";
import { SPECIES_OPTIONS, AGE_GROUP_OPTIONS, PAGE_SIZE } from "../../constants";
import "./PetCatalog.css";

export default function PetCatalog() {
  const { isUser } = useAuth();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [species, setSpecies] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [page, setPage] = useState(1);

  const [pets, setPets] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  const debouncedSearch = useDebounce(search, 350);

  const loadPets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await petApi.getPets({
        search: debouncedSearch || undefined,
        species: species || undefined,
        ageGroup: ageGroup || undefined,
        page,
        limit: PAGE_SIZE,
      });
      const raw = data.items ?? data.data ?? data.pets ?? (Array.isArray(data) ? data : []);
      setPets(raw);
      setTotal(data.total ?? data.count ?? raw.length);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, species, ageGroup, page]);

  useEffect(() => {
    loadPets();
  }, [loadPets]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, species, ageGroup]);

  useEffect(() => {
    if (!isUser) return;
    favoritesApi
      .getFavorites()
      .then(({ data }) => {
        const ids = (data.items ?? data ?? []).map((p) => p.id ?? p.petId);
        setFavoriteIds(new Set(ids));
      })
      .catch(() => {});
  }, [isUser]);

  const handleToggleFavorite = async (pet) => {
    const isFav = favoriteIds.has(pet.id);
    // Optimistic update — instant feedback, matches SRS UX flow diagram.
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      isFav ? next.delete(pet.id) : next.add(pet.id);
      return next;
    });
    try {
      if (isFav) {
        await favoritesApi.removeFavorite(pet.id);
        toast.info(`${pet.name} removed from favorites`);
      } else {
        await favoritesApi.addFavorite(pet.id);
        toast.success(`${pet.name} added to favorites`);
      }
    } catch (err) {
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        isFav ? next.add(pet.id) : next.delete(pet.id);
        return next;
      });
      toast.error(err.message);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setSpecies("");
    setAgeGroup("");
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasFilters = search || species || ageGroup;

  return (
    <div className="section container">
      <div className="page-header">
        <div>
          <span className="page-header__eyebrow">Pet Catalog</span>
          <h1>Find your new best friend</h1>
          <p>Every pet listed here is currently available for adoption.</p>
        </div>
      </div>

      <div className="catalog__filters">
        <Input
          name="search"
          placeholder="Search by name or breed…"
          icon={Search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search pets"
        />
        <Select
          name="species"
          placeholder="All species"
          options={SPECIES_OPTIONS}
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          aria-label="Filter by species"
        />
        <Select
          name="ageGroup"
          placeholder="Any age"
          options={AGE_GROUP_OPTIONS}
          value={ageGroup}
          onChange={(e) => setAgeGroup(e.target.value)}
          aria-label="Filter by age"
        />
        {hasFilters && (
          <button className="catalog__reset" onClick={resetFilters}>
            <RotateCcw size={14} /> Reset
          </button>
        )}
      </div>

      {error && <ErrorState message={error.message} onAction={loadPets} />}

      {!error && loading && (
        <div className="catalog__grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!error && !loading && pets.length === 0 && (
        <EmptyState
          icon={SlidersHorizontal}
          title="No pets match your search"
          message="Try adjusting your filters or check back soon — new pets are added regularly."
          actionLabel={hasFilters ? "Clear filters" : undefined}
          onAction={hasFilters ? resetFilters : undefined}
        />
      )}

      {!error && !loading && pets.length > 0 && (
        <>
          <div className="catalog__grid">
            {pets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                isFavorite={favoriteIds.has(pet.id)}
                onToggleFavorite={isUser ? handleToggleFavorite : undefined}
              />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={total}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
