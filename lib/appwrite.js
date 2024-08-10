import { Client, Account, ID, Avatars, Databases } from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.mgie.aora",
  projectId: "66b7354d003ab2ad3bef",
  databaseId: "66b73672000741c38a54",
  userCollectionId: "66b7368e0019d913f0bf",
  videoCollectionId: "66b736ac000eab91a0b8",
  storageId: "66b7379f002348c00608",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccout = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccout) {
      throw new Error("Account creation failed");
    }

    const avatarUrl = avatars.getInitials(newAccout.name);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccout.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );
    return newUser;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    if (!session) {
      throw new Error("Session creation failed");
    }
    return session;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
