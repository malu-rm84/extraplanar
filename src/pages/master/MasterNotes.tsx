import { MasterLayout } from "@/components/layout/MasterLayout";
import { useState, useEffect, useCallback, memo } from "react";
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  Plus, 
  FileText, 
  Edit, 
  Trash2, 
  Download, 
  FolderOpen
} from "lucide-react";
import React from "react"; 
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

const MasterNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editedFolderName, setEditedFolderName] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreatingTopLevelFolder, setIsCreatingTopLevelFolder] = useState(false);
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);

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
      
      // Se a pasta atual foi excluída, voltar para a raiz
      if (folderId === currentFolderId) {
        setCurrentFolderId(null);
      }
    } catch (error) {
      console.error("Erro ao excluir pasta:", error);
    } finally {
      setDeletingFolderId(null);
    }
  };

  const createFolder = async (name: string, parentId: string | null) => {
    if (!auth.currentUser) return;
    try {
      setIsCreatingFolder(true);
      const newFolder = {
        name: name || "Nova Pasta",
        userId: auth.currentUser.uid,
        parentFolderId: parentId,
      };
      await addDoc(collection(db, "folders"), newFolder);
      setNewFolderName("");
      setShowNewFolderInput(false);
      setIsCreatingTopLevelFolder(false);
      
      // Se criamos uma subpasta, expandimos a pasta pai
      if (parentId) {
        setExpandedFolders(prev => ({ ...prev, [parentId]: true }));
      }
    } catch (error) {
      console.error("Erro ao criar pasta:", error);
    } finally {
      setIsCreatingFolder(false);
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

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
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
      <div className="flex items-center gap-1 mb-4 text-sm text-muted-foreground bg-black/20 p-2 rounded-md border border-white/10">
        <button
          onClick={() => setCurrentFolderId(null)}
          className={`hover:text-primary px-1 py-0.5 rounded ${!currentFolderId ? 'bg-primary/20 text-primary' : ''}`}
        >
          Explorador
        </button>
        {getFolderPath().map((folder, index) => (
          <span key={folder.id} className="flex items-center">
            <span className="mx-1 text-muted-foreground"></span>
            <button
              onClick={() => setCurrentFolderId(folder.id)}
              className={`hover:text-primary px-1 py-0.5 rounded ${
                index === getFolderPath().length - 1 ? 'bg-primary/20 text-primary' : ''
              }`}
            >
              {folder.name}
            </button>
          </span>
        ))}
      </div>
    );
  };

  // Componente recursivo para renderizar a estrutura de pastas
  const FolderTree = ({ parentId = null }: { parentId?: string | null }) => {
    const subfolders = folders.filter(f => f.parentFolderId === parentId);
    if (subfolders.length === 0) return null;
    
    return (
      <div className={`${parentId ? 'pl-4 ml-2 border-l border-white/10' : ''}`}>
        {subfolders.map(folder => {
          const isExpanded = expandedFolders[folder.id];
          const notesInFolder = notes.filter(n => n.folderId === folder.id);
          const hasSubfolders = folders.some(f => f.parentFolderId === folder.id);
          const hasContent = notesInFolder.length > 0 || hasSubfolders;
          
          return (
            <div key={folder.id} className="my-1">
              <div 
                className={`flex items-center group py-1 px-2 rounded-md ${
                  currentFolderId === folder.id ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'
                }`}
              >
                {hasContent ? (
                  <button
                    onClick={() => toggleFolder(folder.id)}
                    className="mr-1 text-muted-foreground hover:text-primary"
                  >
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                ) : (
                  <div className="w-4 mr-1" />
                )}
                <button
                  className="flex items-center flex-grow"
                  onClick={() => setCurrentFolderId(folder.id)}
                >
                  {isExpanded ? 
                    <FolderOpen size={16} className={`mr-2 ${currentFolderId === folder.id ? 'text-primary' : 'text-muted-foreground'}`} /> : 
                    <Folder size={16} className={`mr-2 ${currentFolderId === folder.id ? 'text-primary' : 'text-muted-foreground'}`} />
                  }
                  {editingFolderId === folder.id ? (
                    <input
                      value={editedFolderName}
                      onChange={(e) => setEditedFolderName(e.target.value)}
                      onBlur={() => handleEditFolder(folder.id, editedFolderName)}
                      onKeyDown={(e) => e.key === "Enter" && handleEditFolder(folder.id, editedFolderName)}
                      autoFocus
                      className="bg-black/50 border-b border-primary/50 w-full text-sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="truncate">{folder.name}</span>
                  )}
                </button>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowNewFolderInput(true);
                      setCurrentFolderId(folder.id);
                    }}
                    className="p-1 hover:bg-primary/20 rounded-full"
                    title="Nova subpasta"
                  >
                    <Plus size={14} className="text-muted-foreground hover:text-primary" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingFolderId(folder.id);
                      setEditedFolderName(folder.name);
                    }}
                    className="p-1 hover:bg-primary/20 rounded-full"
                    title="Editar pasta"
                  >
                    <Edit size={14} className="text-muted-foreground hover:text-primary" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFolder(folder.id);
                    }}
                    className="p-1 hover:bg-destructive/20 rounded-full"
                    title="Excluir pasta"
                  >
                    {deletingFolderId === folder.id ? (
                      <Spinner />
                    ) : (
                      <Trash2 size={14} className="text-muted-foreground hover:text-destructive" />
                    )}
                  </button>
                </div>
              </div>
              {isExpanded && hasContent && (
                <div className="mt-1">
                  {/* Notas da pasta */}
                  {notesInFolder.map(note => (
                    <div
                      key={note.id}
                      className={`flex items-center group ml-6 py-1 px-2 rounded-md hover:bg-white/5 cursor-pointer ${
                        activeNote?.id === note.id ? 'bg-black/50 text-primary' : ''
                      }`}
                      onClick={() => setActiveNote(note)}
                    >
                      <FileText size={16} className="mr-2 text-muted-foreground" />
                      <span className="truncate flex-grow">{note.title}</span>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveNote(note);
                          }}
                          className="p-1 hover:bg-primary/20 rounded-full"
                          title="Editar nota"
                        >
                          <Edit size={14} className="text-muted-foreground hover:text-primary" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(note.id);
                          }}
                          className="p-1 hover:bg-destructive/20 rounded-full"
                          title="Excluir nota"
                        >
                          <Trash2 size={14} className="text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {/* Subpastas recursivamente */}
                  <FolderTree parentId={folder.id} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const Sidebar = memo(() => {
    const rootNotes = notes.filter(n => n.folderId === 'root');
    return (
      <div className="w-64 bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 flex flex-col h-[calc(100vh-220px)]">
        <div className="flex justify-between items-center p-3 border-b border-white/10 bg-black/20">
          <h2 className="font-medium text-primary flex items-center">
            <FileText size={16} className="mr-2" /> Explorador de Anotações
          </h2>
        </div>
        <div className="flex-1 overflow-auto p-2">
          {/* Parte superior - Criar pasta */}
          <div className="flex justify-between items-center mb-2 px-2">
            <button
              onClick={() => {
                setIsCreatingTopLevelFolder(true);
                setShowNewFolderInput(true);
                setCurrentFolderId(null);
              }}
              className="text-sm flex items-center gap-1 hover:bg-primary/20 px-2 py-1 rounded-md text-muted-foreground hover:text-primary"
              title="Nova pasta"
            >
              <Plus size={14} /> Nova Pasta
            </button>
          </div>
          {showNewFolderInput && currentFolderId === null && isCreatingTopLevelFolder && (
            <div className="flex items-center mb-2 px-2">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Nome da pasta"
                className="bg-black/50 border border-white/10 rounded p-1 text-sm w-full"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    createFolder(newFolderName, null);
                  } else if (e.key === "Escape") {
                    setShowNewFolderInput(false);
                    setIsCreatingTopLevelFolder(false);
                  }
                }}
              />
              <button
                onClick={() => createFolder(newFolderName, null)}
                disabled={isCreatingFolder}
                className="ml-1 p-1 bg-primary/20 hover:bg-primary/30 rounded"
              >
                {isCreatingFolder ? <Spinner /> : <Plus size={14} className="text-primary" />}
              </button>
            </div>
          )}
          {showNewFolderInput && currentFolderId !== null && !isCreatingTopLevelFolder && (
            <div className="flex items-center mb-2 px-2 ml-6">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Nome da subpasta"
                className="bg-black/50 border border-white/10 rounded p-1 text-sm w-full"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    createFolder(newFolderName, currentFolderId);
                  } else if (e.key === "Escape") {
                    setShowNewFolderInput(false);
                  }
                }}
              />
              <button
                onClick={() => createFolder(newFolderName, currentFolderId)}
                disabled={isCreatingFolder}
                className="ml-1 p-1 bg-primary/20 hover:bg-primary/30 rounded"
              >
                {isCreatingFolder ? <Spinner /> : <Plus size={14} className="text-primary" />}
              </button>
            </div>
          )}
          {/* Lista de arquivos na raiz */}
          <div
            className={`py-1 px-2 rounded-md mb-2 ${
              currentFolderId === null ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'
            }`}
            onClick={() => setCurrentFolderId(null)}
          >
            <div className="flex items-center">
              {rootNotes.length > 0 ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedFolders(prev => ({ ...prev, root: !prev.root }));
                  }}
                  className="mr-1 text-muted-foreground hover:text-primary"
                >
                  {expandedFolders.root ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
              ) : (
                <div className="w-4 mr-1" />
              )}
              <FolderOpen size={16} className={`mr-2 ${currentFolderId === null ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="truncate">Arquivos</span>
            </div>
          </div>
          {/* Notas raiz */}
          {expandedFolders.root && rootNotes.map(note => (
            <div
              key={note.id}
              className={`flex items-center group ml-6 py-1 px-2 rounded-md hover:bg-white/5 cursor-pointer ${
                activeNote?.id === note.id ? 'bg-black/50 text-primary' : ''
              }`}
              onClick={() => setActiveNote(note)}
            >
              <FileText size={16} className="mr-2 text-muted-foreground" />
              <span className="truncate flex-grow">{note.title}</span>
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveNote(note);
                  }}
                  className="p-1 hover:bg-primary/20 rounded-full"
                  title="Editar nota"
                >
                  <Edit size={14} className="text-muted-foreground hover:text-primary" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNote(note.id);
                  }}
                  className="p-1 hover:bg-destructive/20 rounded-full"
                  title="Excluir nota"
                >
                  <Trash2 size={14} className="text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            </div>
          ))}
          {/* Árvore de pastas */}
          <FolderTree />
        </div>
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
              className="hover:bg-primary/20 p-2 rounded"
              title="Exportar como Markdown"
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
                  className="bg-primary/20 text-primary px-4 py-2 rounded-md hover:bg-primary/30"
                  disabled={isSavingNote}
                >
                  {isSavingNote ? <Spinner /> : 'Salvar'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedNote(note);
                  }}
                  className="bg-destructive/20 text-destructive px-4 py-2 rounded-md hover:bg-destructive/30"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-primary/20 text-primary px-4 py-2 rounded-md hover:bg-primary/30"
                >
                  Editar
                </button>
                <button
                  onClick={() => setActiveNote(null)}
                  className="bg-gray-500/20 text-gray-500 px-4 py-2 rounded-md hover:bg-gray-500/30"
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
            <div className="bg-black/30 border border-white/10 rounded-xl p-4 overflow-y-auto prose prose-invert">
              <ReactMarkdown>{editedNote.content}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown>{editedNote.content}</ReactMarkdown>
          </div>
        )}
      </div>
    );
  };

  const ContentGrid = () => {
    const currentNotes = notes.filter(n => n.folderId === (currentFolderId || 'root'));
    const subFolders = folders.filter(f => f.parentFolderId === currentFolderId);
    
    return (
      <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
          <div className="flex items-center">
            <FolderOpen size={20} className="mr-2 text-primary" />
            <span className="font-medium">
              {currentFolderId 
                ? folders.find(f => f.id === currentFolderId)?.name || "Pasta" 
                : "Todos os Arquivos"}
            </span>
          </div>
          <button
            onClick={handleCreateNote}
            className="bg-primary/20 hover:bg-primary/30 text-primary px-4 py-1.5 rounded-md flex items-center text-sm"
          >
            <Plus size={16} className="mr-1" />
            Nova Anotação
          </button>
        </div>
        {/* Headers de colunas estilo Explorer */}
        <div className="grid grid-cols-12 text-xs font-medium text-muted-foreground border-b border-white/10 pb-2 px-2">
          <div className="col-span-6">Nome</div>
          <div className="col-span-4">Tipo</div>
          <div className="col-span-2">Ações</div>
        </div>
        {/* Lista de pastas */}
        {subFolders.length === 0 && currentNotes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Pasta vazia. Crie uma nota ou pasta.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {subFolders.map(folder => (
              <div 
                key={folder.id}
                className="grid grid-cols-12 items-center py-2 px-2 hover:bg-white/5 cursor-pointer rounded-md group"
                onClick={() => setCurrentFolderId(folder.id)}
              >
                <div className="col-span-6 flex items-center">
                  <Folder size={18} className="mr-2 text-primary" />
                  {editingFolderId === folder.id ? (
                    <input
                      value={editedFolderName}
                      onChange={(e) => setEditedFolderName(e.target.value)}
                      onBlur={() => handleEditFolder(folder.id, editedFolderName)}
                      onKeyDown={(e) => e.key === "Enter" && handleEditFolder(folder.id, editedFolderName)}
                      autoFocus
                      className="bg-black/50 border-b border-primary/50"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="truncate">{folder.name}</span>
                  )}
                </div>
                <div className="col-span-4 text-muted-foreground">Pasta</div>
                <div className="col-span-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingFolderId(folder.id);
                      setEditedFolderName(folder.name);
                    }}
                    className="p-1 hover:bg-primary/20 rounded"
                    title="Editar pasta"
                  >
                    <Edit size={14} className="text-muted-foreground hover:text-primary" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFolder(folder.id);
                    }}
                    className="p-1 hover:bg-destructive/20 rounded"
                    title="Excluir pasta"
                  >
                    {deletingFolderId === folder.id ? (
                      <Spinner />
                    ) : (
                      <Trash2 size={14} className="text-muted-foreground hover:text-destructive" />
                    )}
                  </button>
                </div>
              </div>
            ))}
            {/* Lista de notas */}
            {currentNotes.map(note => (
              <div 
                key={note.id}
                className="grid grid-cols-12 items-center py-2 px-2 hover:bg-white/5 cursor-pointer rounded-md group"
                onClick={() => setActiveNote(note)}
              >
                <div className="col-span-6 flex items-center">
                  <FileText size={18} className="mr-2 text-muted-foreground" />
                  <span className="truncate">{note.title}</span>
                </div>
                <div className="col-span-4 text-muted-foreground">Anotação</div>
                <div className="col-span-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveNote(note);
                    }}
                    className="p-1 hover:bg-primary/20 rounded"
                    title="Editar nota"
                  >
                    <Edit size={14} className="text-muted-foreground hover:text-primary" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNote(note.id);
                    }}
                    className="p-1 hover:bg-destructive/20 rounded"
                    title="Excluir nota"
                  >
                    <Trash2 size={14} className="text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <MasterLayout>
      <div className="p-6">
        <div className="flex space-x-4">
          <Sidebar />
          <div className="flex-1">
            <Breadcrumbs />
            {activeNote ? (
              <NoteView note={activeNote} />
            ) : (
              <ContentGrid />
            )}
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default MasterNotes;