// NotesPlayer.tsx
import { PlayerLayout } from "@/components/layout/PlayerLayout";
import NotesPage from "../NotesPage";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { query, collection, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/components/auth/firebase-config";

const NotesPlayer = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    const checkCampaignNotes = async () => {
        if (!currentUser?.uid) return;
        
        const campaignsQuery = query(
        collection(db, "campanhas"),
        where("participantUserIds", "array-contains", currentUser.uid)
        );
        
        const snapshot = await getDocs(campaignsQuery);
        snapshot.forEach(async (campaignDoc) => {
        const campaignData = campaignDoc.data();

        // Criar pasta para campanha se não existir
        const folderExists = await getDocs(query(
            collection(db, "folders"),
            where("campaignId", "==", campaignDoc.id),
            where("userId", "==", currentUser.uid)
        ));
        
        if (folderExists.empty) {
            await addDoc(collection(db, "folders"), {
            name: campaignData.name,
            userId: currentUser.uid,
            campaignId: campaignDoc.id
            });
        }
        });
    };

    checkCampaignNotes();
    }, [currentUser]);

  return (
    <PlayerLayout>
      <NotesPage
        role="player"
        collectionName="lore"
        foldersCollection="folders"
      />
    </PlayerLayout>
  );
};

export default NotesPlayer;