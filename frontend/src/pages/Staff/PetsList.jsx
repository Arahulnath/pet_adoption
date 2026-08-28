import React, { useCallback, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import petApi from "../../api/petApi";
import useFetch from "../../hooks/useFetch";
import useDebounce from "../../hooks/useDebounce";
import useToast from "../../hooks/useToast";
import DataTable from "../../components/tables/DataTable";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { Input } from "../../components/common/FormField";
import Pagination from "../../components/common/Pagination";
import PetForm from "../../components/forms/PetForm";
import { formatAge } from "../../utils/formatters";
import { TABLE_PAGE_SIZE } from "../../constants";
import "./Staff.css";

export default function PetsList() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 350);

  const [modalState, setModalState] = useState(null); // { mode: 'create'|'edit', pet? }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const openEdit = useCallback(async (row) => {
    try {
      const { data: images } = await petApi.getImages(row.id);
      const primary = images?.find((i) => i.isPrimary) || images?.[0];
      setModalState({ mode: "edit", pet: { ...row, imageUrl: row.imageUrl || primary?.imageUrl || "" } });
    } catch {
      setModalState({ mode: "edit", pet: row });
    }
  }, []);

  const { data, loading, error, refetch } = useFetch(
    () =>
      petApi
        .getPets({ search: debouncedSearch || undefined, page, limit: TABLE_PAGE_SIZE, staffView: true })
        .then((r) => r.data),
    [debouncedSearch, page]
  );

  const pets = data?.items ?? data?.data ?? data?.pets ?? (Array.isArray(data) ? data : []);
  const total = data?.total ?? data?.count ?? pets.length;
  const totalPages = Math.max(1, Math.ceil(total / TABLE_PAGE_SIZE));

  const handleCreate = useCallback(
    async (values) => {
      const res = await petApi.createPet(values);
      const petId = res.data?.id;
      if (petId && values.imageUrl) {
        await petApi.addImage(petId, values.imageUrl);
      }
      toast.success(`${values.name} was added to the catalog.`);
      setModalState(null);
      refetch();
    },
    [toast, refetch]
  );

  const handleUpdate = useCallback(
    async (values) => {
      await petApi.updatePet(modalState.pet.id, values);
      if (values.imageUrl?.startsWith("data:")) {
        await petApi.addImage(modalState.pet.id, values.imageUrl);
      }
      toast.success(`${values.name} was updated.`);
      setModalState(null);
      refetch();
    },
    [modalState, toast, refetch]
  );

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await petApi.deletePet(deleteTarget.id);
      toast.success(`${deleteTarget.name} was deleted.`);
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: "name", header: "Name", render: (row) => <strong>{row.name}</strong> },
    { key: "species", header: "Species / Breed", render: (row) => `${row.species} · ${row.breed || "—"}` },
    { key: "age", header: "Age", render: (row) => formatAge(row.age) },
    { key: "adoptionStatus", header: "Status", render: (row) => <Badge status={row.adoptionStatus} /> },
    {
      key: "actions",
      header: "",
      width: 110,
      render: (row) => (
        <div className="row-actions">
          <Button
            size="sm"
            variant="ghost"
            icon={Pencil}
            onClick={() => openEdit(row)}
            aria-label={`Edit ${row.name}`}
          />
          <Button
            size="sm"
            variant="danger-ghost"
            icon={Trash2}
            onClick={() => setDeleteTarget(row)}
            aria-label={`Delete ${row.name}`}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="staff-page">
      <div className="page-header">
        <div>
          <span className="page-header__eyebrow">Pet Management</span>
          <h1>Pets</h1>
          <p>Create, edit, and remove pet listings (FR8 — staff CRUD).</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setModalState({ mode: "create" })}>
          Add pet
        </Button>
      </div>

      <div className="staff-page__toolbar">
        <Input
          name="search"
          icon={Search}
          placeholder="Search by name or breed…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          aria-label="Search pets"
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
            data={pets}
            loading={loading}
            emptyTitle="No pets found"
            emptyMessage="Add your first pet to get started."
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
        open={Boolean(modalState)}
        onClose={() => setModalState(null)}
        title={modalState?.mode === "edit" ? `Edit ${modalState.pet.name}` : "Add a new pet"}
        size="lg"
      >
        {modalState && (
          <PetForm
            mode={modalState.mode}
            initialData={modalState.pet}
            onSubmit={modalState.mode === "edit" ? handleUpdate : handleCreate}
            onCancel={() => setModalState(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this pet?"
        message={`Are you sure you want to permanently delete ${deleteTarget?.name}? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
