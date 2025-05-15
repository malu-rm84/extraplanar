import { MasterLayout } from "@/components/layout/MasterLayout";
import { useState, useEffect, useCallback, memo } from "react";
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
  getDocs
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
  parentFolderId?: string | null;
}

const MasterLore = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editedFolderName, setEditedFolderName] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null);

  // Carregar notas
  useEffect(() => {
    if (!auth.currentUser?.uid) return;
    const notesQuery = query(collection(db, "lore"), where("userId", "==", auth.currentUser.uid));
    const unsubscribe = onSnapshot(notesQuery, (snapshot) => {
      setNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Note)));
    });
    return unsubscribe;
  }, [auth.currentUser]);

  // Carregar pastas
  useEffect(() => {
    if (!auth.currentUser?.uid) return;
    const foldersQuery = query(collection(db, "folders"), where("userId", "==", auth.currentUser.uid));
    const unsubscribe = onSnapshot(foldersQuery, (snapshot) => {
      setFolders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Folder)));
    });
    return unsubscribe;
  }, [auth.currentUser]);

  const handleCreateNote = async () => {
    if (!auth.currentUser) return;
    const newNote = {
      title: "Nova Anotação",
      content: "# Escreva aqui...",
      folderId: currentFolderId || 'root',
      userId: auth.currentUser.uid,
    };
    try {
      const docRef = await addDoc(collection(db, "lore"), newNote);
      setActiveNote({ id: docRef.id, ...newNote });
    } catch (error) {
      console.error("Erro ao criar nota:", error);
    }
  };

  const handleSaveNote = async (note: Note) => {
    try {
      setIsSavingNote(true);
      await updateDoc(doc(db, "lore", note.id), { title: note.title, content: note.content });
    } catch (error) {
      console.error("Erro ao salvar nota:", error);
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta anotação?")) return;
    try {
      await deleteDoc(doc(db, "lore", noteId));
      setActiveNote(null);
    } catch (error) {
      console.error("Erro ao excluir nota:", error);
    }
  };

  const handleEditFolder = async (folderId: string, newName: string) => {
    try {
      await updateDoc(doc(db, "folders", folderId), { name: newName });
      setEditingFolderId(null);
    } catch (error) {
      console.error("Erro ao editar pasta:", error);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!window.confirm("Excluir pasta e todas as anotações/subpastas dentro?")) return;
    
    try {
      setDeletingFolderId(folderId);
      const deleteFolderRecursively = async (id: string) => {
        // Deletar notas
        const notesQuery = query(collection(db, "lore"), where("folderId", "==", id));
        const notesSnapshot = await getDocs(notesQuery);
        await Promise.all(notesSnapshot.docs.map(d => deleteDoc(d.ref)));

        // Deletar subpastas
        const foldersQuery = query(collection(db, "folders"), where("parentFolderId", "==", id));
        const foldersSnapshot = await getDocs(foldersQuery);
        await Promise.all(foldersSnapshot.docs.map(d => deleteFolderRecursively(d.id)));

        // Deletar pasta principal
        await deleteDoc(doc(db, "folders", id));
      };

      await deleteFolderRecursively(folderId);
    } catch (error) {
      console.error("Erro ao excluir pasta:", error);
    } finally {
      setDeletingFolderId(null);
    }
  };

  const exportToMarkdown = (note: Note) => {
    const blob = new Blob([note.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title.replace(/\s+/g, '_')}.md`;
    a.click();
  };

  const Spinner = () => (
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
  );

  const Breadcrumbs = () => {
    const getFolderPath = (): Folder[] => {
      const path: Folder[] = [];
      let current = folders.find(f => f.id === currentFolderId);
      
      while(current) {
        path.unshift(current);
        current = folders.find(f => f.id === current?.parentFolderId);
      }
      return path;
    };

    return (
      <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
        <button
          onClick={() => setCurrentFolderId(null)}
          className="hover:text-primary"
        >
          Raiz
        </button>
        {getFolderPath().map(folder => (
          <span key={folder.id} className="flex items-center gap-2">
            / 
            <button
              onClick={() => setCurrentFolderId(folder.id)}
              className="hover:text-primary"
            >
              {folder.name}
            </button>
          </span>
        ))}
      </div>
    );
  };

  const Sidebar = memo(() => {
    const [localFolderName, setLocalFolderName] = useState("");

    const handleCreateFolderLocal = useCallback(async () => {
      if (!auth.currentUser) return;
      setIsCreatingFolder(true);
      const newFolder = {
        name: localFolderName || "Nova Pasta",
        userId: auth.currentUser.uid,
        parentFolderId: currentFolderId,
      };
      try {
        await addDoc(collection(db, "folders"), newFolder);
        setLocalFolderName("");
      } catch (error) {
        console.error("Erro ao criar pasta:", error);
      } finally {
        setIsCreatingFolder(false);
      }
    }, [localFolderName, currentFolderId]);

    return (
      <div className="w-64 bg-black/30 backdrop-blur-lg rounded-xl p-4 border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-primary">Pastas</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nova pasta"
              value={localFolderName}
              onChange={(e) => setLocalFolderName(e.target.value)}
              className="text-sm px-3 py-1 bg-black/50 rounded-full w-32 border border-white/10 focus:ring-0 text-muted-foreground"
            />
            <button 
              onClick={handleCreateFolderLocal}
              className="p-1.5 hover:bg-primary/20 rounded-full"
              disabled={isCreatingFolder}
            >
              {isCreatingFolder ? <Spinner /> : <Plus size={18} className="text-primary" />}
            </button>
          </div>
        </div>

        {folders
          .filter(f => f.parentFolderId === null)
          .map(folder => (
            <div
              key={folder.id}
              className="flex items-center justify-between p-2 mb-1 rounded-lg hover:bg-white/5 cursor-pointer group"
              onClick={() => setCurrentFolderId(folder.id)}
            >
              <div className="flex items-center">
                <Folder size={18} className="mr-2 text-muted-foreground" />
                {folder.name}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFolder(folder.id);
                }}
                className="text-transparent group-hover:text-destructive ml-2"
              >
                {deletingFolderId === folder.id ? <Spinner /> : <Trash2 size={14} />}
              </button>
            </div>
          ))}
      </div>
    );
  });

  const NoteView = ({ note }: { note: Note }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedNote, setEditedNote] = useState(note);

    useEffect(() => {
      setEditedNote(note);
    }, [note]);

    return (
      <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          {isEditing ? (
            <input
              value={editedNote.title}
              onChange={(e) => setEditedNote({ ...editedNote, title: e.target.value })}
              className="text-2xl font-bold bg-transparent border-b-2 border-primary/50"
            />
          ) : (
            <h2 className="text-2xl font-bold">{editedNote.title}</h2>
          )}
          <div className="flex gap-3">
            <button 
              onClick={() => exportToMarkdown(editedNote)} 
              className="hover:bg-primary/20 p-2"
            >
              <Download size={18} className="text-primary" />
            </button>
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    handleSaveNote(editedNote);
                    setIsEditing(false);
                  }}
                  className="bg-primary/20 text-primary px-4 py-2"
                  disabled={isSavingNote}
                >
                  {isSavingNote ? <Spinner /> : 'Salvar'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedNote(note);
                  }}
                  className="bg-destructive/20 text-destructive px-4 py-2"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-primary/20 text-primary px-4 py-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => setActiveNote(null)}
                  className="bg-gray-500/20 text-gray-500 px-4 py-2"
                >
                  Fechar
                </button>
              </>
            )}
          </div>
        </div>
        
        {isEditing ? (
          <div className="grid grid-cols-2 gap-6 h-[700px]">
            <textarea
              value={editedNote.content}
              onChange={(e) => setEditedNote({ ...editedNote, content: e.target.value })}
              className="w-full p-4 bg-black/30 border border-white/10 rounded-xl font-mono resize-none"
            />
            <div className="bg-black/30 border border-white/10 rounded-xl p-4 overflow-y-auto prose">
              <ReactMarkdown>{editedNote.content}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="prose max-w-none">
            <ReactMarkdown>{editedNote.content}</ReactMarkdown>
          </div>
        )}
      </div>
    );
  };

  return (
    <MasterLayout>
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="text-center mb-12 pt-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Arquivo Extraplanar
          </h1>
          <p className="text-muted-foreground text-lg">
            Registros das realidades transcendentes
          </p>
        </div>

        <div className="flex gap-8">
          <Sidebar />
          
          <div className="flex-1">
            {activeNote ? (
              <NoteView note={activeNote} />
            ) : (
              <>
                <Breadcrumbs />
                
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={handleCreateNote}
                    className="bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-full"
                  >
                    <Plus className="mr-2" size={18} />
                    Nova Anotação
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {folders
                    .filter(f => f.parentFolderId === currentFolderId)
                    .map(folder => (
                      <div
                        key={folder.id}
                        className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-4 hover:bg-white/5 cursor-pointer"
                        onClick={() => setCurrentFolderId(folder.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Folder size={18} className="text-primary" />
                            <h3 className="font-medium">{folder.name}</h3>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingFolderId(folder.id);
                                setEditedFolderName(folder.name);
                              }}
                              className="text-muted-foreground hover:text-primary"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteFolder(folder.id);
                              }}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              {deletingFolderId === folder.id ? <Spinner /> : <Trash2 size={14} />}
                            </button>
                          </div>
                        </div>
                        {editingFolderId === folder.id && (
                          <input
                            value={editedFolderName}
                            onChange={(e) => setEditedFolderName(e.target.value)}
                            onBlur={() => handleEditFolder(folder.id, editedFolderName)}
                            onKeyPress={(e) => e.key === "Enter" && handleEditFolder(folder.id, editedFolderName)}
                            autoFocus
                            className="mt-2 w-full bg-transparent border-b border-primary/50"
                          />
                        )}
                      </div>
                    ))}

                  {notes
                    .filter(n => n.folderId === (currentFolderId || 'root'))
                    .map(note => (
                      <div
                        key={note.id}
                        className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-4 hover:bg-white/5 cursor-pointer"
                        onClick={() => setActiveNote(note)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <FileText size={18} className="text-primary" />
                            <h3 className="font-medium">{note.title}</h3>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveNote(note);
                              }}
                              className="text-muted-foreground hover:text-primary"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNote(note.id);
                              }}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          <ReactMarkdown>{note.content}</ReactMarkdown>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default MasterLore;