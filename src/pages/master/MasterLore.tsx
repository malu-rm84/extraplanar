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
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {/* Header atualizado */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Arquivo Extraplanar
          </h1>
          <p className="text-muted-foreground text-lg">
            Registros das realidades transcendentes
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar de Pastas atualizada */}
          <div className="w-64 bg-black/20 backdrop-blur-lg rounded-xl p-4 border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-primary">Pastas</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nova pasta"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="text-sm px-3 py-1 bg-black/30 rounded-full w-32 border border-white/10 focus:ring-0"
                />
                <button
                  onClick={handleCreateFolder}
                  className="p-1.5 hover:bg-primary/20 rounded-full transition-all"
                >
                  <Plus size={18} className="text-primary" />
                </button>
              </div>
            </div>

            {folders.map((folder) => (
              <div
                key={folder.id}
                className={`flex items-center p-2 mb-1 rounded-lg transition-all ${
                  selectedFolder === folder.id 
                    ? 'bg-primary/20 text-primary' 
                    : 'hover:bg-white/5'
                }`}
                onClick={() => setSelectedFolder(folder.id)}
              >
                <Folder size={18} className="mr-2 text-muted-foreground" />
                {folder.name}
              </div>
            ))}
          </div>

          {/* Área Principal atualizada */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              {!selectedNote && (
                <button
                  onClick={handleCreateNote}
                  className="bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-full flex items-center transition-all"
                >
                  <Plus className="mr-2" size={18} />
                  Nova Anotação
                </button>
              )}
            </div>

            {/* Lista de Anotações atualizada */}
            {!selectedNote && (
              <div className="grid grid-cols-2 gap-4">
                {notes
                  .filter((n) => n.folderId === selectedFolder)
                  .map((note) => (
                    <div
                      key={note.id}
                      className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl p-4 hover:bg-white/5 transition-all"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <FileText className="text-primary" size={18} />
                          <h3 className="font-medium">{note.title}</h3>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedNote(note)}
                            className="text-muted-foreground hover:text-primary"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-3 prose">
                        <ReactMarkdown>{note.content}</ReactMarkdown>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Editor atualizado */}
            {selectedNote && (
              <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <input
                    type="text"
                    value={selectedNote.title}
                    onChange={(e) =>
                      setSelectedNote({ ...selectedNote, title: e.target.value })
                    }
                    className="text-2xl font-bold bg-transparent border-b-2 border-primary/50 focus:outline-none"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => exportToMarkdown(selectedNote)}
                      className="p-2 hover:bg-primary/20 rounded-full transition-all"
                    >
                      <Download size={18} className="text-primary" />
                    </button>
                    <button
                      onClick={() => {
                        handleSaveNote(selectedNote);
                        setSelectedNote(null);
                      }}
                      className="bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-full transition-all"
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
                    className="w-full p-4 bg-black/30 border border-white/10 rounded-xl font-mono focus:ring-0 resize-none"
                    placeholder="Escreva seu conteúdo em Markdown..."
                  />
                  <div className="bg-black/30 border border-white/10 rounded-xl p-4 overflow-y-auto prose max-w-none">
                    <ReactMarkdown>{selectedNote.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default MasterLore;