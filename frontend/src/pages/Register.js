import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User registered:", userCredential.user);
  } catch (error) {
    console.error("Registration error:", error.message);
  }
};
