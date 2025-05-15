import { MasterLayout } from "@/components/layout/MasterLayout";
import { useState, useEffect } from "react";
import { Folder, Plus, FileText, Edit, Trash2, Download, ArrowUp } from "lucide-react";
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

interface Tab {
  id: string;
  type: 'folder' | 'note';
  name: string;
  data?: Note | null;
}

const MasterLore = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [tabs, setTabs] = useState<Tab[]>([{ 
    id: 'root', 
    type: 'folder' as const, 
    name: 'Raiz', 
    data: null 
  }]);
  const [activeTab, setActiveTab] = useState<string>('root');
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editedFolderName, setEditedFolderName] = useState("");
  const [newNoteId, setNewNoteId] = useState<string | null>(null);
  const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  useEffect(() => {
    if (!auth.currentUser?.uid) return;
    const notesQuery = query(collection(db, "lore"), where("userId", "==", auth.currentUser.uid));
    const unsubscribe = onSnapshot(notesQuery, (snapshot) => {
      setNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Note)));
    });
    return unsubscribe;
  }, [auth.currentUser]);

  useEffect(() => {
    if (!auth.currentUser?.uid) return;
    const foldersQuery = query(collection(db, "folders"), where("userId", "==", auth.currentUser.uid));
    const unsubscribe = onSnapshot(foldersQuery, (snapshot) => {
      setFolders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Folder)));
    });
    return unsubscribe;
  }, [auth.currentUser]);

  const handleCreateNote = async (folderId: string) => {
    if (!auth.currentUser) return;
    const newNote = {
      title: "Nova Anotação",
      content: "# Escreva aqui...",
      folderId: folderId,
      userId: auth.currentUser.uid,
    };
    try {
      const docRef = await addDoc(collection(db, "lore"), newNote);
      const createdNote = { id: docRef.id, ...newNote };
      handleNoteClick(createdNote);
      setNewNoteId(docRef.id);
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
      closeTab(noteId);
    } catch (error) {
      console.error("Erro ao excluir nota:", error);
    }
  };

  const handleCreateFolder = async () => {
    if (!auth.currentUser) return;
    setIsCreatingFolder(true);
    const parentFolderId = tabs.find(t => t.id === activeTab)?.id === 'root' 
      ? null 
      : tabs.find(t => t.id === activeTab)?.id;

    const newFolder = {
      name: newFolderName || "Nova Pasta",
      userId: auth.currentUser.uid,
      parentFolderId: parentFolderId,
    };
    try {
      const docRef = await addDoc(collection(db, "folders"), newFolder);
      setNewFolderName("");
      handleFolderClick({ id: docRef.id, ...newFolder });
    } catch (error) {
      console.error("Erro ao criar pasta:", error);
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleEditFolder = async (folderId: string, newName: string) => {
    try {
      await updateDoc(doc(db, "folders", folderId), { name: newName });
      setTabs(tabs.map(tab => 
        tab.id === folderId ? { ...tab, name: newName } : tab
      ));
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
        const notesQuery = query(collection(db, "lore"), where("folderId", "==", id));
        const notesSnapshot = await getDocs(notesQuery);
        await Promise.all(notesSnapshot.docs.map(d => deleteDoc(d.ref)));

        const foldersQuery = query(collection(db, "folders"), where("parentFolderId", "==", id));
        const foldersSnapshot = await getDocs(foldersQuery);
        await Promise.all(foldersSnapshot.docs.map(d => deleteFolderRecursively(d.id)));

        await deleteDoc(doc(db, "folders", id));
      };

      await deleteFolderRecursively(folderId);
      closeTab(folderId);
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

  const handleFolderClick = (folder: Folder) => {
    const newTab: Tab = {
      id: folder.id,
      type: 'folder',
      name: folder.name,
      data: null
    };
    
    setTabs(prev => {
      const exists = prev.find(t => t.id === folder.id);
      return exists ? prev : [...prev, newTab];
    });
    setActiveTab(folder.id);
  };

  const handleNoteClick = (note: Note) => {
    const newTab: Tab = {
      id: note.id,
      type: 'note',
      name: note.title,
      data: note
    };
    
    setTabs(prev => {
      const exists = prev.find(t => t.id === note.id);
      return exists ? prev : [...prev, newTab];
    });
    setActiveTab(note.id);
  };

  const closeTab = (tabId: string) => {
    setTabs(prev => prev.filter(t => t.id !== tabId));
    if (activeTab === tabId) {
      setActiveTab(tabs[0]?.id || 'root');
    }
  };

  const Spinner = () => (
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
  );

  const TabBar = () => (
    <div className="flex gap-2 mb-4 border-b border-white/10 pb-2">
      {tabs.map(tab => (
        <div
          key={tab.id}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg cursor-pointer ${
            activeTab === tab.id 
              ? 'bg-primary/20 border border-b-0 border-primary/50' 
              : 'hover:bg-white/5'
          }`}
        >
          <span onClick={() => setActiveTab(tab.id)} className="flex items-center gap-2">
            {tab.type === 'folder' ? <Folder size={14} /> : <FileText size={14} />}
            {tab.name}
          </span>
          {tab.id !== 'root' && (
            <button 
              onClick={() => closeTab(tab.id)} 
              className="ml-2 hover:text-destructive"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      ))}
    </div>
  );

  const FolderView = ({ folderId }: { folderId: string }) => {
    const currentFolder = folders.find(f => f.id === folderId);
    const parentFolderId = currentFolder?.parentFolderId || 'root';

    return (
      <div>
        <div className="flex items-center gap-4 mb-6">
          {folderId !== 'root' && (
            <button
              onClick={() => {
                const parentTab = tabs.find(t => t.id === parentFolderId);
                if (parentTab) setActiveTab(parentTab.id);
              }}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
            >
              <ArrowUp size={16} />
              Voltar
            </button>
          )}
          <button
            onClick={() => handleCreateNote(folderId)}
            className="bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-full"
          >
            <Plus className="mr-2" size={18} />
            Nova Anotação
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {folders
            .filter(f => f.parentFolderId === (folderId === 'root' ? null : folderId))
            .map(folder => (
              <div
                key={folder.id}
                className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-4 hover:bg-white/5 cursor-pointer"
                onClick={() => handleFolderClick(folder)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Folder size={18} className="text-primary" />
                    <h3 className="font-medium">{folder.name}</h3>
                  </div>
                  <div className="flex gap-2 opacity-0 hover:opacity-100">
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
                      disabled={deletingFolderId === folder.id}
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
            .filter(n => n.folderId === folderId)
            .map(note => (
              <div
                key={note.id}
                className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-4 hover:bg-white/5 cursor-pointer"
                onClick={() => handleNoteClick(note)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-primary" />
                    <h3 className="font-medium">{note.title}</h3>
                  </div>
                  <div className="flex gap-2 opacity-0 hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNoteClick(note);
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
      </div>
    );
  };

  const NoteView = ({ note }: { note?: Note }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedNote, setEditedNote] = useState(note);

    useEffect(() => {
      setEditedNote(note);
    }, [note]);

    if (!editedNote) return null;

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
                  onClick={() => closeTab(editedNote.id)}
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
          <div className="w-64 bg-black/30 backdrop-blur-lg rounded-xl p-4 border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-primary">Pastas</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nova pasta"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="text-sm px-3 py-1 bg-black/50 rounded-full w-32 border border-white/10 focus:ring-0 text-muted-foreground"
                />
                <button 
                  onClick={handleCreateFolder} 
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
                  className="flex items-center justify-between p-2 mb-1 rounded-lg hover:bg-white/5 cursor-pointer"
                  onClick={() => handleFolderClick(folder)}
                >
                  <div className="flex items-center">
                    <Folder size={18} className="mr-2 text-muted-foreground" />
                    {folder.name}
                  </div>
                </div>
              ))}
          </div>

          <div className="flex-1">
            <TabBar />
            
            {tabs.map(tab => (
              <div key={tab.id} className={`${activeTab === tab.id ? 'block' : 'hidden'}`}>
                {tab.type === 'folder' ? (
                  <FolderView folderId={tab.id} />
                ) : (
                  <NoteView note={tab.data} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default MasterLore;