import styles from "@/styles/Home.module.css";
import { Auth } from "@/components/auth";
import { db, auth, storage } from "../config/firebase";
import { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

export default function Home() {
  const [movieList, setMovieList] = useState<any>([]);
  // New movie states
  const [newMovieTitle, setNewMovieTitle] = useState<string>("");
  const [newReleaseDate, setNewReleaseDate] = useState<number>(0);
  const [hasOscar, setHasOscar] = useState<boolean>(false);
  // Update Title State
  const [updatedTitle, setUpdatedTitle] = useState<string>("");
  // File Upload State
  const [fileUpload, setFileUpload] = useState<File[] | null>(null);
  const moviesCollectionRef = collection(db, "movies");

  const getMovieList = async () => {
    // READ THE DATA FROM DB
    try {
      console.log("printing this");
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs?.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(filteredData);
      setMovieList(filteredData);
    } catch (error) {
      console.error(error);
    }
    // SET THE MOVIE LIST STATE

    // DISPLAY DATA
  };

  const deleteMovie = async (id: string) => {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
    getMovieList();
  };

  const updateMovieTitle = async (id: string) => {
    const movieDoc = doc(db, "movies", id);
    try {
      await updateDoc(movieDoc, { title: updatedTitle });
    } catch (error) {
      console.error(`Error inside updateMovieTitle function: ${error}`);
    }
    getMovieList();
  };

  const uploadFile = async () => {
    console.log("clicked upload");
    if (!fileUpload || !fileUpload[0]) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload[0]?.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload[0]);
    } catch (error) {
      console.error(`Error inside uploadFile function: ${error}`);
    }
  };

  useEffect(() => {
    getMovieList();
  }, []);

  const handleSubmit = async (e: {}) => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedOscar: hasOscar,
        userId: auth?.currentUser?.uid,
      });
      getMovieList();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className={styles.inputs}>
        <Auth />
      </div>
      <div className={styles.list}>
        <div style={{ marginTop: "25px" }}>
          <input
            placeholder="Movie title..."
            onChange={(e) => setNewMovieTitle(e.target.value)}
          />
          <input
            placeholder="Release Date..."
            type="number"
            onChange={(e) => setNewReleaseDate(Number(e.target.value))}
          />
          <input
            placeholder="Movie title..."
            type="checkbox"
            checked={hasOscar}
            onChange={(e) => setHasOscar(e.target.checked)}
          />
          <label htmlFor="">Received an Oscar</label>
          <button onClick={handleSubmit}>Submit Movie</button>
        </div>
        {movieList &&
          movieList.map(
            (movie: {
              id: string;
              title: string;
              releaseDate: number;
              receivedOscar: boolean;
            }) => (
              <div key={movie.id}>
                <h1 style={{ color: movie.receivedOscar ? "green" : "red" }}>
                  {movie.title}
                </h1>
                <p>Date of Mooovie: {movie.releaseDate}</p>
                <button onClick={() => deleteMovie(movie.id)}>Delete</button>
                <input
                  type="text"
                  placeholder="New Title.."
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                />
                <button onClick={() => updateMovieTitle(movie.id)}>Edit</button>
              </div>
            )
          )}
      </div>
      <div>
        <input
          type="file"
          onChange={(e) =>
            setFileUpload(e ? Array.from(e.target?.files || []) : null)
          }
        />
        <button onClick={() => uploadFile()}>Upload File 2</button>
      </div>
    </div>
  );
}
