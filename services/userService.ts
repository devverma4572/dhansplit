import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../config/firebase";
import { ResponseType, UserDataType } from "../types/types";

export const updateUser = async(
    uid: string,
    updatedData: UserDataType
): Promise<ResponseType> =>{
    try{
        const userRef = doc(firestore, "users", uid);
        await setDoc(userRef, updatedData, { merge: true });

        return{ success: true, msg: "updated successfully"}
    }catch(error: any){
        console.log("Error, updating user: ", error);
        return {success: false, msg: error?.message}
    }   
}
