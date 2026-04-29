<?php

namespace App\Domain\Orphan\Services;

use App\Domain\Orphan\Models\Orphan;
use App\Domain\Orphan\Models\OrphanMedicalRecord;
use App\Domain\Orphan\Models\OrphanEducationRecord;
use App\Domain\Orphan\Models\OrphanFamilyContact;
use App\Domain\Orphan\Repositories\OrphanRepositoryInterface;

class OrphanService
{
    public function __construct(private OrphanRepositoryInterface $repository)
    {
    }

    public function getAllOrphans(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->repository->all();
    }

    public function getFilteredOrphans(array $filters): \Illuminate\Database\Eloquent\Collection
    {
        return $this->repository->filter($filters);
    }

    public function getOrphanById(int $id): ?Orphan
    {
        return $this->repository->find($id);
    }

    public function createOrphan(array $data): Orphan
    {
        // Generate unique code
        do {
            $code = 'ORPH-' . strtoupper(substr($data['name'], 0, 3)) . '-' . now()->format('YmdHis');
        } while (Orphan::where('code', $code)->exists());
        $data['code'] = $code;
        return $this->repository->create($data);
    }

    public function updateOrphan(int $id, array $data): bool
    {
        return $this->repository->update($id, $data);
    }

    public function deleteOrphan(int $id): bool
    {
        return $this->repository->delete($id);
    }

    // Medical Records
    public function getMedicalRecords(int $orphanId): \Illuminate\Database\Eloquent\Collection
    {
        $orphan = $this->repository->find($orphanId);
        return $orphan ? $orphan->medicalRecords()->latest('date')->get() : collect();
    }

    public function createMedicalRecord(int $orphanId, array $data): ?OrphanMedicalRecord
    {
        $orphan = $this->repository->find($orphanId);
        if (!$orphan) return null;
        $data['orphan_id'] = $orphanId;
        return OrphanMedicalRecord::create($data);
    }

    public function updateMedicalRecord(int $recordId, array $data): bool
    {
        $record = OrphanMedicalRecord::find($recordId);
        if (!$record) return false;
        return $record->update($data);
    }

    public function deleteMedicalRecord(int $recordId): bool
    {
        $record = OrphanMedicalRecord::find($recordId);
        if (!$record) return false;
        return $record->delete();
    }

    // Education Records
    public function getEducationRecords(int $orphanId): \Illuminate\Database\Eloquent\Collection
    {
        $orphan = $this->repository->find($orphanId);
        return $orphan ? $orphan->educationRecords()->latest()->get() : collect();
    }

    public function createEducationRecord(int $orphanId, array $data): ?OrphanEducationRecord
    {
        $orphan = $this->repository->find($orphanId);
        if (!$orphan) return null;
        $data['orphan_id'] = $orphanId;
        return OrphanEducationRecord::create($data);
    }

    public function updateEducationRecord(int $recordId, array $data): bool
    {
        $record = OrphanEducationRecord::find($recordId);
        if (!$record) return false;
        return $record->update($data);
    }

    public function deleteEducationRecord(int $recordId): bool
    {
        $record = OrphanEducationRecord::find($recordId);
        if (!$record) return false;
        return $record->delete();
    }

    // Family Contacts
    public function getFamilyContacts(int $orphanId): \Illuminate\Database\Eloquent\Collection
    {
        $orphan = $this->repository->find($orphanId);
        return $orphan ? $orphan->familyContacts()->get() : collect();
    }

    public function createFamilyContact(int $orphanId, array $data): ?OrphanFamilyContact
    {
        $orphan = $this->repository->find($orphanId);
        if (!$orphan) return null;
        $data['orphan_id'] = $orphanId;
        return OrphanFamilyContact::create($data);
    }

    public function updateFamilyContact(int $contactId, array $data): bool
    {
        $contact = OrphanFamilyContact::find($contactId);
        if (!$contact) return false;
        return $contact->update($data);
    }

    public function deleteFamilyContact(int $contactId): bool
    {
        $contact = OrphanFamilyContact::find($contactId);
        if (!$contact) return false;
        return $contact->delete();
    }

    public function upcomingBirthdays(int $days = 30): \Illuminate\Database\Eloquent\Collection
    {
        return $this->repository->upcomingBirthdays($days);
    }
}
?>

