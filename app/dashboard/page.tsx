"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";

// Define types
type User = {
  id: string;
  email: string | undefined;
};

type Comment = {
  id?: number; // Integer ID as per your schema
  content: string;
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string>("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    const storedUserEmail = localStorage.getItem("user_email");

    if (storedUserId && storedUserEmail) {
      setUser({ id: storedUserId, email: storedUserEmail });
    } else {
      // Fallback to Supabase session
      supabase.auth.getSession().then(({ data }) => {
        if (data.session?.user) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email,
          });
        } else {
          setUser(null);
        }
      });
    }

    fetchComments();
  }, []);

  const fetchComments = async () => {
    const { data, error } = await supabase.from("comments").select("*");
    if (error) console.error("Error fetching comments:", error.message);
    setComments(data || []);
  };

  const postComment = async () => {
    if (!newComment) return;

    const { error } = await supabase
      .from("comments")
      .insert([{ content: newComment }]);

    if (error) {
      console.error("Failed to post comment:", error.message);
      return;
    }

    setNewComment("");
    fetchComments();
  };

  const upload = async () => {
    if (!uploadFile) return;

    const { data, error } = await supabase.storage
      .from("xploitagent-bucket")
      .upload(uploadFile.name, uploadFile);
    console.log(data);
    if (error) {
      console.error("Upload error:", error.message);
      return;
    }

    const {
      data: { publicUrl },
    }: { data: { publicUrl: string } } = supabase.storage
      .from("xploitagent-bucket")
      .getPublicUrl(uploadFile.name);

    if (!publicUrl) {
      console.error("Error: Public URL is empty");
      return;
    }

    setFileUrl(publicUrl);
  };

  return (
    <main className="min-h-screen bg-black text-white p-10 space-y-10">
      <h1 className="text-5xl font-bold text-transparent bg-gradient-to-tl from-zinc-200 via-zinc-400 to-zinc-600 bg-clip-text">
        XploitAgent Dashboard
      </h1>

      <p className="text-zinc-400">
        Welcome,{" "}
        <span className="font-mono">
          {user?.email || "Anonymous (no check)"}
        </span>
      </p>

      {/* 💬 Comments */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Comment Wall</h2>
        <div className="flex gap-2 mb-4">
          <input
            placeholder="Drop a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded placeholder:text-zinc-500"
          />
          <button
            onClick={postComment}
            className="bg-green-600 px-4 py-2 rounded"
          >
            Post
          </button>
        </div>
        <div className="space-y-2">
          {comments.map((c, i) => (
            <div
              key={i}
              dangerouslySetInnerHTML={{ __html: c.content }}
              className="bg-zinc-800 border border-zinc-700 p-2 rounded"
            />
          ))}
        </div>
      </section>

      {/* 📂 File Upload */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">File Upload</h2>
        <div className="flex gap-2">
          <input
            type="file"
            onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
            className="text-sm"
          />
          <button onClick={upload} className="bg-purple-600 px-4 py-2 rounded">
            Upload
          </button>
        </div>
        {fileUrl && (
          <p className="mt-2 text-sm">
            Uploaded file URL:{" "}
            <a href={fileUrl} className="text-blue-500">
              {fileUrl}
            </a>
          </p>
        )}
      </section>

      {/* 🕵️ IDOR */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Profile (IDOR)</h2>
        <p className="text-sm text-zinc-400">
          View user profiles using unprotected URLs:
        </p>
        <ul className="mt-2 list-disc list-inside">
          <li>
            <Link href="/dashboard/profile/p/1" className="text-blue-500">
              View Profile ID 1
            </Link>
          </li>
          <li>
            <Link href="/dashboard/profile/p/2" className="text-blue-500">
              View Profile ID 2
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
