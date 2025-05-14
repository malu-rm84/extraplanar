import { MasterLayout } from "@/components/layout/MasterLayout";
import { useState, useEffect } from "react";
import { Folder, Plus, FileText, Edit, Trash2, Download } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { db, auth } from "@/components/auth/firebase-config";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  userId: string;
}

interface Folder {
  id: string;
  name: string;
  userId: string;
}

const MasterLore = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>("root");
  const [newFolderName, setNewFolderName] = useState("");

  // Carregar notas do Firestore
  useEffect(() => {
    if (!auth.currentUser?.uid) return;

    const notesQuery = query(
      collection(db, "lore"),
      where("userId", "==", auth.currentUser.uid)
    );
    const notesUnsubscribe = onSnapshot(notesQuery, (snapshot) => {
      const notesData: Note[] = [];
      snapshot.forEach((doc) => {
        notesData.push({ id: doc.id, ...doc.data() } as Note);
      });
      setNotes(notesData);
    });

    return () => notesUnsubscribe();
  }, [auth.currentUser]);

  // Carregar pastas do Firestore
  useEffect(() => {
    if (!auth.currentUser?.uid) return;

    const foldersQuery = query(
      collection(db, "folders"),
      where("userId", "==", auth.currentUser.uid)
    );
    const foldersUnsubscribe = onSnapshot(foldersQuery, (snapshot) => {
      const foldersData: Folder[] = [];
      snapshot.forEach((doc) => {
        foldersData.push({ id: doc.id, ...doc.data() } as Folder);
      });
      setFolders(foldersData);
    });

    return () => foldersUnsubscribe();
  }, [auth.currentUser]);

  const handleCreateNote = async () => {
    if (!auth.currentUser) return;

    const newNote = {
      title: "Nova Anotação",
      content: "# Escreva aqui...",
      folderId: selectedFolder || "root",
      userId: auth.currentUser.uid,
    };

    try {
      const docRef = await addDoc(collection(db, "lore"), newNote);
      setSelectedNote({ id: docRef.id, ...newNote });
    } catch (error) {
      console.error("Erro ao criar nota:", error);
    }
  };

  const handleSaveNote = async (updatedNote: Note) => {
    try {
      await updateDoc(doc(db, "lore", updatedNote.id), {
        title: updatedNote.title,
        content: updatedNote.content,
      });
    } catch (error) {
      console.error("Erro ao salvar nota:", error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteDoc(doc(db, "lore", noteId));
      setSelectedNote(null);
    } catch (error) {
      console.error("Erro ao excluir nota:", error);
    }
  };

  const handleCreateFolder = async () => {
    if (!auth.currentUser) return;

    const newFolder = {
      name: newFolderName || "Nova Pasta",
      userId: auth.currentUser.uid,
    };

    try {
      await addDoc(collection(db, "folders"), newFolder);
      setNewFolderName("");
    } catch (error) {
      console.error("Erro ao criar pasta:", error);
    }
  };

  const exportToMarkdown = (note: Note) => {
    const blob = new Blob([note.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title}.md`;
    a.click();
  };

  return (
    <MasterLayout>
      <div className="flex h-screen">
        {/* Sidebar de Pastas */}
        <div className="w-64 border-r p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Pastas</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nome da pasta"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="text-sm px-2 py-1 border rounded w-32"
              />
              <button
                onClick={handleCreateFolder}
                className="p-1 hover:bg-muted rounded"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {folders.map((folder) => (
            <div
              key={folder.id}
              className={`flex items-center p-2 hover:bg-muted rounded cursor-pointer ${
                selectedFolder === folder.id ? "bg-muted" : ""
              }`}
              onClick={() => setSelectedFolder(folder.id)}
            >
              <Folder size={16} className="mr-2" />
              {folder.name}
            </div>
          ))}
        </div>

        {/* Área Principal */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-serif font-bold">Lore</h1>
            {!selectedNote && (
              <button
                onClick={handleCreateNote}
                className="bg-primary text-primary-foreground px-4 py-2 rounded flex items-center"
              >
                <Plus className="mr-2" size={16} />
                Nova Anotação
              </button>
            )}
          </div>

          {/* Lista de Anotações */}
          {!selectedNote && (
            <div className="grid grid-cols-3 gap-4">
              {notes
                .filter((n) => n.folderId === selectedFolder)
                .map((note) => (
                  <div
                    key={note.id}
                    className="border p-4 rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <FileText className="text-muted-foreground" size={16} />
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedNote(note)}
                          className="hover:text-primary"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="hover:text-destructive"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-medium">{note.title}</h3>
                    <div className="text-sm text-muted-foreground mt-2 line-clamp-3">
                      <div className="prose">
                        <ReactMarkdown>{note.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Editor de Markdown */}
          {selectedNote && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  value={selectedNote.title}
                  onChange={(e) =>
                    setSelectedNote({ ...selectedNote, title: e.target.value })
                  }
                  className="text-xl font-bold bg-transparent border-b-2 focus:border-primary focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => exportToMarkdown(selectedNote)}
                    className="p-2 hover:bg-muted rounded"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => {
                      handleSaveNote(selectedNote);
                      setSelectedNote(null);
                    }}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded"
                  >
                    Salvar e Sair
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 h-[700px]">
                <textarea
                  value={selectedNote.content}
                  onChange={(e) =>
                    setSelectedNote({ ...selectedNote, content: e.target.value })
                  }
                  className="w-full p-4 border rounded-lg font-mono focus:ring-0 resize-none"
                  placeholder="Escreva seu conteúdo em Markdown..."
                />

                <div className="border rounded-lg p-4 overflow-y-auto">
                  <div className="prose max-w-none">
                    <ReactMarkdown>{selectedNote.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MasterLayout>
  );
};

export default MasterLore;