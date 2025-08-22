import { initializeApp } from "firebase/app"
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDT6Dd49VhGjMn6VuYEg8uv7SVJ5_HpveY",
  authDomain: "visiarisestudio-3813e.firebaseapp.com",
  projectId: "visiarisestudio-3813e",
  storageBucket: "visiarisestudio-3813e.firebasestorage.app",
  messagingSenderId: "808663717080",
  appId: "1:808663717080:web:c3264e47c1afde7ced73ad",
  measurementId: "G-49P84LJS0G",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Project interface
export interface Project {
  id?: string
  name: string
  description: string
  assets: any[]
  userId: string
  createdAt: Date
  updatedAt: Date
  published: boolean
  publishUrl?: string
}

// Firebase operations
export const saveProject = async (project: Omit<Project, "id">) => {
  try {
    const docRef = await addDoc(collection(db, "projects"), {
      ...project,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error saving project:", error)
    throw error
  }
}

export const getUserProjects = async (userId: string) => {
  try {
    const q = query(collection(db, "projects"), where("userId", "==", userId))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Project[]
  } catch (error) {
    console.error("Error getting projects:", error)
    throw error
  }
}

export const getProject = async (projectId: string) => {
  try {
    const docRef = doc(db, "projects", projectId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Project
    }
    return null
  } catch (error) {
    console.error("Error getting project:", error)
    throw error
  }
}

export const updateProject = async (projectId: string, updates: Partial<Project>) => {
  try {
    const docRef = doc(db, "projects", projectId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error("Error updating project:", error)
    throw error
  }
}

export const deleteProject = async (projectId: string) => {
  try {
    await deleteDoc(doc(db, "projects", projectId))
  } catch (error) {
    console.error("Error deleting project:", error)
    throw error
  }
}
