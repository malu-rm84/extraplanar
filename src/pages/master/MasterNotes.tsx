// NotesMaster.tsx
import { MasterLayout } from "@/components/layout/MasterLayout";
import NotesPage from "../NotesPage";

const NotesMaster = () => {
  return (
    <MasterLayout>
      <NotesPage 
        role="master"
        collectionName="lore"
        foldersCollection="folders"
      />
    </MasterLayout>
  );
};

export default NotesMaster;