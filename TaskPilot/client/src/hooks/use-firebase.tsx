import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { QueryData, SearchResult, FavoriteQuery } from '@/types/query';

export function useFirebase() {
  const [searches, setSearches] = useState<SearchResult[]>([]);
  const [favorites, setFavorites] = useState<FavoriteQuery[]>([]);
  const [loading, setLoading] = useState(false);

  const deviceId = useState(() => {
    let id = localStorage.getItem('deviceId');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('deviceId', id);
    }
    return id;
  })[0];

  useEffect(() => {
    const searchesRef = collection(db, 'searches');
    const favoritesRef = collection(db, 'favorites');

    const unsubscribeSearches = onSnapshot(
      query(searchesRef, orderBy('createdAt', 'desc')),
      (snapshot) => {
        const searchData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as SearchResult[];
        setSearches(searchData);
      }
    );

    const unsubscribeFavorites = onSnapshot(
      query(favoritesRef, orderBy('createdAt', 'desc')),
      (snapshot) => {
        const favoriteData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as FavoriteQuery[];
        setFavorites(favoriteData);
      }
    );

    return () => {
      unsubscribeSearches();
      unsubscribeFavorites();
    };
  }, []);

  const saveSearch = async (queryData: QueryData, query: string, explanation: string, url: string) => {
    setLoading(true);
    try {
      await addDoc(collection(db, 'searches'), {
        input: JSON.stringify(queryData),
        query,
        engine: queryData.engine,
        url,
        explanation,
        queryData,
        deviceId,
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Error saving search:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const saveFavorite = async (name: string, description: string, queryData: QueryData) => {
    setLoading(true);
    try {
      await addDoc(collection(db, 'favorites'), {
        queryName: name,
        queryData,
        description,
        deviceId,
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Error saving favorite:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteFavorite = async (id: string) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'favorites', id));
    } catch (error) {
      console.error('Error deleting favorite:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteSearch = async (id: string) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'searches', id));
    } catch (error) {
      console.error('Error deleting search:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearAllSearches = async () => {
    setLoading(true);
    try {
      const searchesSnapshot = await getDocs(collection(db, 'searches'));
      const deletePromises = searchesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error clearing searches:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    searches,
    favorites,
    loading,
    saveSearch,
    saveFavorite,
    deleteFavorite,
    deleteSearch,
    clearAllSearches
  };
}
